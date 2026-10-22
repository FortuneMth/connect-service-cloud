"use client";

import Link from "next/link";

import { DeliveryHealthCard } from "@/components/portal/delivery-health";
import { DeliveryTiming } from "@/components/portal/delivery-timing";
import { DeliveryTracker } from "@/components/portal/delivery-tracker";
import { DeliveryUpdates } from "@/components/portal/delivery-updates";
import { EscalationPanel } from "@/components/portal/escalation-panel";
import { usePortalOrder } from "@/components/portal/portal-delivery-store";
import { Button } from "@/components/ui/button";
import { deliveryProgress, STAGE_SHORT_LABEL } from "@/data/portal";

export function PortalOrderDetail({ id }: { id: string }) {
  const delivery = usePortalOrder(id);

  if (!delivery) {
    return (
      <div className="rounded-lg border bg-card px-4 py-8">
        <h1 className="text-lg font-semibold">Order not found</h1>
        <p className="mt-1 text-sm text-muted-foreground">This delivery is not available on your account.</p>
        <Button className="mt-4" size="sm" render={<Link href="/portal/orders" />}>
          Back to my orders
        </Button>
      </div>
    );
  }

  const progress = deliveryProgress(delivery);
  const current = delivery.stages.find((stage) => stage.key === delivery.currentStage);

  return (
    <div className="flex min-w-0 flex-col gap-4">
      <div>
        <Button variant="outline" size="sm" render={<Link href="/portal/orders" />}>
          Back to my orders
        </Button>
      </div>

      <header className="min-w-0 rounded-lg border bg-card px-4 py-4">
        <h1 className="font-heading text-xl font-semibold tracking-tight">{delivery.title}</h1>
        <p className="mt-1 font-mono text-xs text-muted-foreground">{delivery.orderNumber}</p>
        <p className="mt-1 text-sm text-muted-foreground">
          {delivery.customerName} · {delivery.siteName}
        </p>
        <div className="mt-4 max-w-xl">
          <DeliveryHealthCard health={delivery.health} />
        </div>
        <div className="mt-4">
          <div className="flex items-center justify-between gap-3 text-sm">
            <span className="font-medium tabular-nums">{progress}% complete</span>
            <span className="text-muted-foreground">{STAGE_SHORT_LABEL[delivery.currentStage]}</span>
          </div>
          <div className="mt-2 h-2 overflow-hidden rounded-full bg-muted">
            <div className="h-full rounded-full bg-[#2563EB]" style={{ width: `${progress}%` }} />
          </div>
        </div>
        <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
          <div>
            <dt className="text-xs text-muted-foreground">Estimated completion</dt>
            <dd>{delivery.estimatedCompletionLabel}</dd>
          </div>
          <div>
            <dt className="text-xs text-muted-foreground">Last updated</dt>
            <dd>{delivery.lastUpdatedLabel}</dd>
          </div>
          <div>
            <dt className="text-xs text-muted-foreground">Next expected update</dt>
            <dd>{delivery.nextUpdateLabel}</dd>
          </div>
          <div>
            <dt className="text-xs text-muted-foreground">Current owner</dt>
            <dd>{delivery.ownerName} · {delivery.ownerTeam}</dd>
          </div>
        </dl>
      </header>

      <DeliveryTracker delivery={delivery} />
      <DeliveryTiming delivery={delivery} />

      <section className="rounded-lg border bg-card px-4 py-4">
        <h2 className="text-sm font-medium">Current stage</h2>
        <p className="mt-2 text-lg font-medium">{STAGE_SHORT_LABEL[delivery.currentStage]}</p>
        <dl className="mt-3 grid gap-3 text-sm sm:grid-cols-2 xl:grid-cols-4">
          <div>
            <dt className="text-xs text-muted-foreground">Started</dt>
            <dd>{current?.startLabel || "—"}</dd>
          </div>
          <div>
            <dt className="text-xs text-muted-foreground">Expected</dt>
            <dd>{current?.expectedDuration || "—"}</dd>
          </div>
          <div>
            <dt className="text-xs text-muted-foreground">Owner</dt>
            <dd>{delivery.ownerName}</dd>
          </div>
          <div>
            <dt className="text-xs text-muted-foreground">Team</dt>
            <dd>{delivery.ownerTeam}</dd>
          </div>
        </dl>
        {current?.explanation ? <p className="mt-3 text-sm text-muted-foreground">{current.explanation}</p> : null}
      </section>

      <DeliveryUpdates delivery={delivery} />
      <EscalationPanel orderId={delivery.orderId} />

      <section className="rounded-lg border bg-card px-4 py-4">
        <h2 className="text-sm font-medium">Order details</h2>
        <dl className="mt-3 grid gap-3 text-sm sm:grid-cols-2">
          <div>
            <dt className="text-xs text-muted-foreground">Order</dt>
            <dd className="font-mono">{delivery.orderNumber}</dd>
          </div>
          <div>
            <dt className="text-xs text-muted-foreground">Service</dt>
            <dd>{delivery.product}</dd>
          </div>
          <div>
            <dt className="text-xs text-muted-foreground">Site</dt>
            <dd>{delivery.siteName}</dd>
          </div>
          <div>
            <dt className="text-xs text-muted-foreground">Customer</dt>
            <dd>{delivery.customerName}</dd>
          </div>
          <div>
            <dt className="text-xs text-muted-foreground">Target activation</dt>
            <dd>{delivery.estimatedCompletionLabel}</dd>
          </div>
        </dl>
      </section>
    </div>
  );
}
