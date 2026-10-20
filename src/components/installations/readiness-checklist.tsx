"use client";

import { StatusBadge } from "@/components/shell/status-badge";
import { READINESS_LABEL, type InstallationRecord } from "@/data/installations";

export function ReadinessChecklist({
  installation,
  onToggle,
}: {
  installation: InstallationRecord;
  onToggle: (itemId: string) => void;
}) {
  return (
    <section className="rounded-lg border bg-card p-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-sm font-medium">Readiness checklist</h2>
        <StatusBadge status={READINESS_LABEL[installation.readiness]} />
      </div>
      <ul className="mt-3 flex flex-col gap-2">
        {installation.checklist.map((item) => {
          const locked = item.id === "permit" && installation.workPermit === "Not Required";
          const status = locked ? "Not Required" : item.done ? "Complete" : "Pending";

          return (
            <li key={item.id} className="grid gap-2 rounded-lg border px-3 py-2 sm:grid-cols-[1fr_auto] sm:items-center">
              <label className="flex items-start gap-2 text-sm">
                <input
                  type="checkbox"
                  className="mt-0.5"
                  checked={item.done}
                  disabled={locked}
                  onChange={() => onToggle(item.id)}
                />
                <span>
                  <span className="block">{item.label}</span>
                  <span className="text-xs text-muted-foreground">{item.ownerName} · {item.updatedLabel}</span>
                </span>
              </label>
              <StatusBadge status={status} />
            </li>
          );
        })}
      </ul>
    </section>
  );
}
