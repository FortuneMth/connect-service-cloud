import { deliveryProgress, type PortalDelivery } from "@/data/portal";

export function DeliveryTiming({ delivery }: { delivery: PortalDelivery }) {
  const progress = deliveryProgress(delivery);

  return (
    <section className="min-w-0 rounded-lg border bg-card px-4 py-4">
      <h2 className="text-sm font-medium">Delivery timeline</h2>
      <p className="mt-0.5 text-xs text-muted-foreground">Expected versus elapsed delivery time.</p>
      <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <Metric label="Estimated total" value={delivery.estimatedTotalLabel} />
        <Metric label="Elapsed" value={`${delivery.elapsedBusinessDays} business days`} />
        <Metric label="Estimated remaining" value={delivery.remainingLabel} />
        <Metric label="Current position" value={`${progress}%`} />
      </div>
      <div className="mt-4">
        <div className="h-2 overflow-hidden rounded-full bg-muted">
          <div className="h-full rounded-full bg-[#2563EB]" style={{ width: `${progress}%` }} />
        </div>
      </div>
      <ul className="mt-4 divide-y rounded-lg border">
        {delivery.durationGuide.map((item) => (
          <li key={item.key} className="flex items-center justify-between gap-3 px-3 py-2 text-sm">
            <span>{item.label}</span>
            <span className="text-muted-foreground">{item.expected}</span>
          </li>
        ))}
      </ul>
      <p className="mt-3 text-xs text-muted-foreground">
        Expected durations are guide values for this delivery. Actual durations appear on each completed stage.
      </p>
    </section>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border bg-muted/30 px-3 py-2.5">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="mt-1 text-sm font-medium">{value}</p>
    </div>
  );
}
