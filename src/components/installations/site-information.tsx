import type { InstallationRecord } from "@/data/installations";

export function SiteInformation({ installation }: { installation: InstallationRecord }) {
  const rows = [
    ["Site", installation.siteName],
    ["Address", installation.address],
    ["City", installation.city],
    ["Site contact", installation.siteContactName],
    ["Phone", installation.siteContactPhone],
    ["Access hours", installation.accessHours],
    ["Access requirements", installation.accessRequirements],
    ["Parking", installation.parking],
    ["Technical room", installation.technicalRoom],
  ];

  return (
    <section className="rounded-lg border bg-card p-4">
      <h2 className="text-sm font-medium">Site information</h2>
      <dl className="mt-3 flex flex-col gap-2 text-sm">
        {rows.map(([label, value]) => (
          <div key={label} className="grid gap-1 sm:grid-cols-[9rem_1fr]">
            <dt className="text-muted-foreground">{label}</dt>
            <dd>{value}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
