import type { InstallationRecord } from "@/data/installations";

export function InstallationTimeline({ installation }: { installation: InstallationRecord }) {
  return (
    <section className="rounded-lg border bg-card p-4">
      <h2 className="text-sm font-medium">Installation timeline</h2>
      <ol className="mt-3 flex flex-col gap-3">
        {installation.timeline.map((event) => (
          <li key={event.id} className="border-l-2 border-border pl-3">
            <p className="text-sm">{event.summary}</p>
            <p className="text-xs text-muted-foreground">
              {event.actorName} · {event.occurredLabel} · {event.category}
            </p>
          </li>
        ))}
      </ol>
    </section>
  );
}
