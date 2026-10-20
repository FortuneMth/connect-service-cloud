"use client";

import type { InstallationRecord } from "@/data/installations";

const sections = ["Before Arrival", "On Site", "Testing", "Completion"] as const;

export function InstallationChecklist({
  installation,
  onToggle,
}: {
  installation: InstallationRecord;
  onToggle: (itemId: string) => void;
}) {
  return (
    <section className="rounded-lg border bg-card p-4">
      <h2 className="text-sm font-medium">Installation checklist</h2>
      <div className="mt-3 grid gap-4 lg:grid-cols-2">
        {sections.map((section) => (
          <div key={section}>
            <h3 className="text-xs font-medium text-muted-foreground">{section}</h3>
            <ul className="mt-2 flex flex-col gap-2">
              {installation.fieldChecklist.filter((item) => item.section === section).map((item) => (
                <li key={item.id}>
                  <label className="flex items-start gap-2 text-sm">
                    <input type="checkbox" className="mt-0.5" checked={item.done} onChange={() => onToggle(item.id)} />
                    <span>
                      <span className="block">{item.label}</span>
                      <span className="text-xs text-muted-foreground">{item.updatedLabel}</span>
                    </span>
                  </label>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}
