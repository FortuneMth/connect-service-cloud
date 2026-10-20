import type { ServiceRecord } from "@/data/services";

const rows = [
  ["Circuit", "circuitId"],
  ["POP", "pop"],
  ["VLAN", "vlan"],
  ["IP address", "ipAddress"],
  ["CPE", "cpe"],
  ["Address", "address"],
] as const;

export function ServiceCircuit({ service }: { service: ServiceRecord }) {
  return (
    <section className="rounded-lg border bg-card px-4 py-3">
      <h2 className="text-sm font-medium">Circuit</h2>
      <dl className="mt-3 grid gap-3 sm:grid-cols-2">
        {rows.map(([label, key]) => (
          <div key={key}>
            <dt className="text-xs text-muted-foreground">{label}</dt>
            <dd className="text-sm">{service[key]}</dd>
          </div>
        ))}
      </dl>
      {service.risk ? <p className="mt-3 text-sm text-muted-foreground">{service.risk}</p> : null}
    </section>
  );
}
