import { formatRand } from "@/data/customers";
import { HEALTH_LABEL, type ServiceRecord } from "@/data/services";

export function ServiceSummary({ service }: { service: ServiceRecord }) {
  const items = [
    ["Bandwidth", service.bandwidth],
    ["Monthly", formatRand(service.monthly)],
    ["Term", `${service.termMonths} months`],
    ["Activated", service.activatedLabel],
    ["Owner", service.ownerName],
    ["Health", HEALTH_LABEL[service.health]],
    ["Access", service.accessType],
    ["Site", service.siteName],
  ];

  return (
    <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
      {items.map(([label, value]) => (
        <article key={label} className="rounded-lg border bg-card px-4 py-3">
          <h2 className="text-xs font-medium text-muted-foreground">{label}</h2>
          <p className="mt-1 text-sm font-medium">{value}</p>
        </article>
      ))}
    </section>
  );
}
