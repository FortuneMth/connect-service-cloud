import type { PortalDelivery } from "@/data/portal";

export function DeliveryUpdates({ delivery }: { delivery: PortalDelivery }) {
  const updates = delivery.updates.filter((item) => item.customerVisible);

  return (
    <section className="min-w-0 rounded-lg border bg-card px-4 py-4">
      <h2 className="text-sm font-medium">Latest updates</h2>
      <p className="mt-0.5 text-xs text-muted-foreground">What has happened on your delivery recently.</p>
      <ul className="mt-4 flex flex-col gap-3">
        {updates.length === 0 ? (
          <li className="text-sm text-muted-foreground">No updates yet.</li>
        ) : (
          updates.map((update) => (
            <li key={update.id} className="border-t pt-3 first:border-0 first:pt-0">
              <p className="text-xs text-muted-foreground">{update.occurredLabel}</p>
              <p className="mt-1 text-sm">{update.summary}</p>
            </li>
          ))
        )}
      </ul>
    </section>
  );
}
