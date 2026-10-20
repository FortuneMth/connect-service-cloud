import { StatusBadge } from "@/components/shell/status-badge";
import { READINESS_LABEL, type InstallationRecord } from "@/data/installations";

export function InstallationReadiness({ installation }: { installation: InstallationRecord }) {
  const rows = [
    ["Site Access", installation.siteAccess],
    ["Site Survey", installation.siteSurvey],
    ["Equipment / CPE", installation.cpe],
    ["Materials", installation.materials],
    ["Technician", installation.technician === "Unassigned" ? "Unassigned" : "Assigned"],
    ["Customer Contact", installation.customerContact],
    ["Work Permit", installation.workPermit],
  ];

  return (
    <section className="rounded-lg border bg-card p-4">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-sm font-medium">Readiness</h2>
        <StatusBadge status={READINESS_LABEL[installation.readiness]} />
      </div>
      <dl className="mt-3 flex flex-col gap-2 text-sm">
        {rows.map(([label, value]) => (
          <div key={label} className="flex items-center justify-between gap-3">
            <dt className="text-muted-foreground">{label}</dt>
            <dd><StatusBadge status={value} /></dd>
          </div>
        ))}
      </dl>
      {installation.risk ? <p className="mt-3 text-sm text-amber-700 dark:text-amber-400">{installation.risk}</p> : null}
    </section>
  );
}
