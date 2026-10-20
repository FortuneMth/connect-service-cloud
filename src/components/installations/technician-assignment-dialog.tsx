"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { INSTALLATION_TECHNICIANS } from "@/data/installations";

const fieldClass =
  "h-8 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50";

export function TechnicianAssignmentDialog({
  technician,
  onSubmit,
}: {
  technician: string;
  onSubmit: (technician: string) => void;
}) {
  const [value, setValue] = useState(
    INSTALLATION_TECHNICIANS.includes(technician as (typeof INSTALLATION_TECHNICIANS)[number]) ? technician : "Installation Team",
  );
  const [saved, setSaved] = useState(false);

  return (
    <form
      className="flex flex-col gap-3"
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit(value);
        setSaved(true);
      }}
    >
      <div className="flex flex-col gap-1.5">
        <Label>Technician</Label>
        <select className={fieldClass} value={value} onChange={(event) => setValue(event.target.value)}>
          {INSTALLATION_TECHNICIANS.map((name) => (
            <option key={name} value={name}>{name}</option>
          ))}
        </select>
      </div>
      {saved ? <p className="text-sm text-emerald-700 dark:text-emerald-400">Technician assigned.</p> : null}
      <div className="flex flex-wrap justify-end gap-2">
        <Button type="submit" size="sm">Assign Technician</Button>
      </div>
    </form>
  );
}
