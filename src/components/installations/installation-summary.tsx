import { READINESS_LABEL, type InstallationRecord } from "@/data/installations";

const items = (installation: InstallationRecord) => [
  { label: "Scheduled", value: `${installation.scheduledLabel} ${installation.scheduledTime}` },
  { label: "Estimated Duration", value: `${installation.durationHours} hours` },
  { label: "Technician", value: installation.technician },
  { label: "Contact", value: installation.siteContactName },
  { label: "Site", value: installation.city },
  { label: "Service", value: installation.serviceName },
  { label: "Readiness", value: READINESS_LABEL[installation.readiness] },
];

export function InstallationSummary({ installation }: { installation: InstallationRecord }) {
  return (
    <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
      {items(installation).map((item) => (
        <article key={item.label} className="rounded-lg border bg-card px-4 py-3">
          <h2 className="text-xs font-medium text-muted-foreground">{item.label}</h2>
          <p className="mt-1 text-sm font-medium">{item.value}</p>
        </article>
      ))}
    </section>
  );
}
