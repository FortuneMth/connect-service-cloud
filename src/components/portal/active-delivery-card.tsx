import Link from "next/link";

import { DeliveryHealthBadge } from "@/components/portal/delivery-health";
import { Button } from "@/components/ui/button";
import { deliveryProgress, STAGE_SHORT_LABEL, type PortalDelivery } from "@/data/portal";

export function ActiveDeliveryCard({
  delivery,
  actionHref,
  actionLabel = "Track Delivery",
}: {
  delivery: PortalDelivery;
  actionHref?: string;
  actionLabel?: string;
}) {
  const progress = deliveryProgress(delivery);
  const href = actionHref ?? `/portal/orders/${delivery.orderId}`;

  return (
    <article className="min-w-0 rounded-lg border bg-card px-4 py-4">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0">
          <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">Active delivery</p>
          <h2 className="mt-1 font-heading text-xl font-semibold tracking-tight">{delivery.title}</h2>
          <p className="mt-1 font-mono text-xs text-muted-foreground">{delivery.orderNumber}</p>
          <p className="mt-1 text-sm text-muted-foreground">{delivery.product}</p>
        </div>
        <DeliveryHealthBadge health={delivery.health} />
      </div>
      <div className="mt-4">
        <div className="flex items-center justify-between gap-3 text-sm">
          <span>{STAGE_SHORT_LABEL[delivery.currentStage]} in progress</span>
          <span className="font-medium tabular-nums">{progress}% complete</span>
        </div>
        <div className="mt-2 h-2 overflow-hidden rounded-full bg-muted">
          <div className="h-full rounded-full bg-[#2563EB]" style={{ width: `${progress}%` }} />
        </div>
      </div>
      <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-2 xl:grid-cols-4">
        <Item label="Estimated completion" value={delivery.estimatedCompletionLabel} />
        <Item label="Last updated" value={delivery.lastUpdatedLabel} />
        <Item label="Next expected update" value={delivery.nextUpdateLabel} />
        <Item label="Current owner" value={`${delivery.ownerName} · ${delivery.ownerTeam}`} />
      </dl>
      <div className="mt-4">
        <Button size="sm" render={<Link href={href} />}>{actionLabel}</Button>
      </div>
    </article>
  );
}

function Item({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs text-muted-foreground">{label}</dt>
      <dd className="mt-0.5">{value}</dd>
    </div>
  );
}
