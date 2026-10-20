"use client";

import { useState } from "react";

import { StatusBadge } from "@/components/shell/status-badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { InstallationRecord, InstallationTest } from "@/data/installations";

const fieldClass =
  "h-8 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50";

export function TestResults({
  installation,
  onRecord,
}: {
  installation: InstallationRecord;
  onRecord: (test: Omit<InstallationTest, "id">) => void;
}) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("Optical Power");
  const [result, setResult] = useState("");
  const [unit, setUnit] = useState("dBm");
  const [outcome, setOutcome] = useState<"Pass" | "Fail">("Pass");
  const [notes, setNotes] = useState("");
  const [saved, setSaved] = useState(false);

  return (
    <section className="rounded-lg border bg-card p-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-sm font-medium">Test results</h2>
        <Button type="button" variant="outline" size="sm" onClick={() => setOpen((current) => !current)}>
          Record Test Result
        </Button>
      </div>
      {installation.tests.length === 0 ? (
        <p className="mt-3 text-sm text-muted-foreground">No test results recorded.</p>
      ) : (
        <ul className="mt-3 flex flex-col gap-2">
          {installation.tests.map((test) => (
            <li key={test.id} className="flex flex-wrap items-center justify-between gap-2 rounded-lg border px-3 py-2 text-sm">
              <div>
                <p className="font-medium">{test.name}</p>
                <p className="text-muted-foreground">{test.result} {test.unit}</p>
                {test.notes ? <p className="text-xs text-muted-foreground">{test.notes}</p> : null}
              </div>
              <StatusBadge status={test.outcome} />
            </li>
          ))}
        </ul>
      )}
      {open ? (
        <form
          className="mt-3 flex flex-col gap-3 border-t pt-3"
          onSubmit={(event) => {
            event.preventDefault();
            if (!result.trim()) return;
            onRecord({ name, result: result.trim(), unit, outcome, notes: notes.trim() });
            setResult("");
            setNotes("");
            setSaved(true);
          }}
        >
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="flex flex-col gap-1.5">
              <Label>Test</Label>
              <Input value={name} onChange={(event) => setName(event.target.value)} />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label>Result</Label>
              <Input value={result} onChange={(event) => setResult(event.target.value)} />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label>Unit</Label>
              <Input value={unit} onChange={(event) => setUnit(event.target.value)} />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label>Pass/Fail</Label>
              <select className={fieldClass} value={outcome} onChange={(event) => setOutcome(event.target.value as "Pass" | "Fail")}>
                <option value="Pass">Pass</option>
                <option value="Fail">Fail</option>
              </select>
            </div>
          </div>
          <div className="flex flex-col gap-1.5">
            <Label>Notes</Label>
            <textarea className={`${fieldClass} h-16 py-2`} value={notes} onChange={(event) => setNotes(event.target.value)} />
          </div>
          {saved ? <p className="text-sm text-emerald-700 dark:text-emerald-400">Test result recorded.</p> : null}
          <div className="flex justify-end">
            <Button type="submit" size="sm">Save result</Button>
          </div>
        </form>
      ) : null}
    </section>
  );
}
