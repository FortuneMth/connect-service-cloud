"use client";

import { useState } from "react";

import { StatusBadge } from "@/components/shell/status-badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ACCEPTANCE_RESULTS, type InstallationAcceptance, type InstallationRecord } from "@/data/installations";

const fieldClass =
  "h-8 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50";

export function CustomerAcceptance({
  installation,
  onRecord,
}: {
  installation: InstallationRecord;
  onRecord: (acceptance: InstallationAcceptance) => void;
}) {
  const [open, setOpen] = useState(false);
  const [contact, setContact] = useState(installation.acceptance.contact);
  const [result, setResult] = useState<(typeof ACCEPTANCE_RESULTS)[number]>("Accepted");
  const [notes, setNotes] = useState("");
  const [saved, setSaved] = useState(false);
  const acceptance = installation.acceptance;

  return (
    <section className="rounded-lg border bg-card p-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-sm font-medium">Customer acceptance</h2>
        {installation.status === "CUSTOMER_ACCEPTANCE" ? (
          <Button type="button" variant="outline" size="sm" onClick={() => setOpen((current) => !current)}>
            Record Customer Acceptance
          </Button>
        ) : null}
      </div>
      <dl className="mt-3 grid gap-2 text-sm sm:grid-cols-2">
        <div>
          <dt className="text-muted-foreground">Status</dt>
          <dd className="mt-1"><StatusBadge status={acceptance.status} /></dd>
        </div>
        <div>
          <dt className="text-muted-foreground">Customer</dt>
          <dd>{acceptance.contact}</dd>
        </div>
        <div>
          <dt className="text-muted-foreground">Acceptance date</dt>
          <dd>{acceptance.dateLabel}</dd>
        </div>
        <div>
          <dt className="text-muted-foreground">Acceptance method</dt>
          <dd>{acceptance.method}</dd>
        </div>
      </dl>
      {acceptance.notes ? <p className="mt-3 text-sm text-muted-foreground">{acceptance.notes}</p> : null}
      {open ? (
        <form
          className="mt-3 flex flex-col gap-3 border-t pt-3"
          onSubmit={(event) => {
            event.preventDefault();
            onRecord({
              status: result,
              contact: contact.trim() || installation.siteContactName,
              dateLabel: "Today",
              method: "On site",
              notes: notes.trim(),
            });
            setSaved(true);
            setOpen(false);
          }}
        >
          <div className="flex flex-col gap-1.5">
            <Label>Customer Contact</Label>
            <Input value={contact} onChange={(event) => setContact(event.target.value)} />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label>Acceptance Result</Label>
            <select className={fieldClass} value={result} onChange={(event) => setResult(event.target.value as (typeof ACCEPTANCE_RESULTS)[number])}>
              {ACCEPTANCE_RESULTS.map((option) => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          </div>
          <div className="flex flex-col gap-1.5">
            <Label>Notes</Label>
            <textarea className={`${fieldClass} h-16 py-2`} value={notes} onChange={(event) => setNotes(event.target.value)} />
          </div>
          <div className="flex justify-end">
            <Button type="submit" size="sm">Save acceptance</Button>
          </div>
        </form>
      ) : null}
      {saved ? <p className="mt-3 text-sm text-emerald-700 dark:text-emerald-400">Customer acceptance recorded.</p> : null}
    </section>
  );
}
