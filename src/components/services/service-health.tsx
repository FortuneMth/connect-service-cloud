"use client";

import { useState } from "react";

import { StatusBadge } from "@/components/shell/status-badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CHECK_OUTCOMES, HEALTH_LABEL, type CheckOutcome, type ServiceRecord } from "@/data/services";

const fieldClass =
  "h-8 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50";

export function ServiceHealth({
  service,
  onRecord,
}: {
  service: ServiceRecord;
  onRecord: (check: { name: string; result: string; outcome: CheckOutcome; notes: string }) => void;
}) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("Optical power");
  const [result, setResult] = useState("");
  const [outcome, setOutcome] = useState<CheckOutcome>("HEALTHY");
  const [notes, setNotes] = useState("");

  return (
    <section className="rounded-lg border bg-card px-4 py-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-sm font-medium">Health checks</h2>
        <Button type="button" variant="outline" size="sm" onClick={() => setOpen((current) => !current)}>
          Record Health Check
        </Button>
      </div>
      {open ? (
        <form
          className="mt-3 grid gap-3 sm:grid-cols-2"
          onSubmit={(event) => {
            event.preventDefault();

            if (!name.trim() || !result.trim()) return;

            onRecord({ name: name.trim(), result: result.trim(), outcome, notes: notes.trim() });
            setResult("");
            setNotes("");
            setOpen(false);
          }}
        >
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="check-name">Check</Label>
            <Input id="check-name" value={name} onChange={(event) => setName(event.target.value)} />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="check-result">Result</Label>
            <Input id="check-result" value={result} onChange={(event) => setResult(event.target.value)} />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="check-outcome">Outcome</Label>
            <select id="check-outcome" className={fieldClass} value={outcome} onChange={(event) => setOutcome(event.target.value as CheckOutcome)}>
              {CHECK_OUTCOMES.map((item) => (
                <option key={item} value={item}>{HEALTH_LABEL[item]}</option>
              ))}
            </select>
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="check-notes">Notes</Label>
            <Input id="check-notes" value={notes} onChange={(event) => setNotes(event.target.value)} />
          </div>
          <div className="sm:col-span-2">
            <Button type="submit" size="sm">Save health check</Button>
          </div>
        </form>
      ) : null}
      <ul className="mt-3 flex flex-col gap-2">
        {service.checks.length === 0 ? <li className="text-sm text-muted-foreground">No health checks recorded.</li> : null}
        {service.checks.map((check) => (
          <li key={check.id} className="flex flex-wrap items-center justify-between gap-2 border-t pt-2 first:border-0 first:pt-0">
            <div>
              <p className="text-sm">{check.name}</p>
              <p className="text-xs text-muted-foreground">{check.result}{check.notes ? ` · ${check.notes}` : ""}</p>
            </div>
            <StatusBadge status={HEALTH_LABEL[check.outcome]} />
          </li>
        ))}
      </ul>
    </section>
  );
}
