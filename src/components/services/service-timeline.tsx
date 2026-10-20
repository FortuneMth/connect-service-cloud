import type { ServiceRecord } from "@/data/services";

export function ServiceTimeline({ service }: { service: ServiceRecord }) {
  return (
    <section className="rounded-lg border bg-card px-4 py-3">
      <h2 className="text-sm font-medium">Service timeline</h2>
      <ul className="mt-3 flex flex-col gap-3">
        {service.timeline.map((event) => (
          <li key={event.id}>
            <p className="text-sm">{event.summary}</p>
            <p className="text-xs text-muted-foreground">
              {event.actorName} · {event.occurredLabel} · {event.category}
            </p>
          </li>
        ))}
      </ul>
    </section>
  );
}
