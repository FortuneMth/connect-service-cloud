"use client";

import Link from "next/link";

import { ActiveDeliveryCard } from "@/components/portal/active-delivery-card";
import { DeliveryHealthBadge } from "@/components/portal/delivery-health";
import { usePortalDelivery } from "@/components/portal/portal-delivery-store";
import { StatusBadge } from "@/components/shell/status-badge";
import { Button } from "@/components/ui/button";
import { deliveryProgress, portalLiveServices, STAGE_SHORT_LABEL } from "@/data/portal";

export function PortalHome() {
  const { deliveries, escalations } = usePortalDelivery();
  const primary = deliveries.find((item) => item.orderNumber === "ORD-2026-0142") ?? deliveries[0];
  const openEscalations = escalations.filter(
    (item) => item.customerId === primary?.customerId && item.status !== "RESOLVED",
  );
  const recentUpdates = (primary?.updates.filter((item) => item.customerVisible) ?? []).slice(0, 3);

  if (!primary) {
    return <p className="text-sm text-muted-foreground">No active deliveries on this account.</p>;
  }

  return (
    <div className="flex min-w-0 flex-col gap-6">
      <header className="min-w-0">
        <p className="text-sm text-muted-foreground">{primary.customerName}</p>
        <h1 className="mt-1 font-heading text-2xl font-semibold tracking-tight">Connectivity Delivery Portal</h1>
        <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
          Track your connectivity delivery from order to activation.
        </p>
      </header>

      <ActiveDeliveryCard delivery={primary} />

      <div className="grid min-w-0 gap-4 xl:grid-cols-2">
        <section className="rounded-lg border bg-card px-4 py-4">
          <h2 className="text-sm font-medium">Recent updates</h2>
          <ul className="mt-3 flex flex-col gap-3">
            {recentUpdates.map((update) => (
              <li key={update.id} className="border-t pt-3 first:border-0 first:pt-0">
                <p className="text-xs text-muted-foreground">{update.occurredLabel}</p>
                <p className="mt-1 text-sm">{update.summary}</p>
              </li>
            ))}
          </ul>
        </section>

        <section className="rounded-lg border bg-card px-4 py-4">
          <h2 className="text-sm font-medium">Attention</h2>
          {openEscalations.length > 0 ? (
            <ul className="mt-3 flex flex-col gap-2">
              {openEscalations.map((item) => (
                <li key={item.id} className="rounded-lg border px-3 py-2.5 text-sm">
                  <p>
                    Your escalation <span className="font-mono font-medium">{item.reference}</span> is being handled.
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {item.assignedTo} · {item.expectedResponse}
                  </p>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="mt-2"
                    render={<Link href={`/portal/orders/${item.orderId}#escalation`} />}
                  >
                    View Escalation
                  </Button>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-3 text-sm text-muted-foreground">Nothing requires your attention.</p>
          )}
        </section>
      </div>

      <section className="rounded-lg border bg-card px-4 py-4">
        <div className="flex items-baseline justify-between gap-3">
          <h2 className="text-sm font-medium">My services</h2>
          <Button variant="outline" size="sm" render={<Link href="/portal/services" />}>View all</Button>
        </div>
        <ul className="mt-3 grid gap-2 sm:grid-cols-2">
          {portalLiveServices.map((service) => (
            <li key={service.id} className="rounded-lg border px-3 py-2.5">
              <p className="text-sm font-medium">{service.name}</p>
              <p className="text-xs text-muted-foreground">{service.product}</p>
              <div className="mt-2 flex flex-wrap items-center gap-2">
                <StatusBadge status={service.status} />
                <span className="text-xs text-muted-foreground">{service.site}</span>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section className="rounded-lg border bg-card px-4 py-4">
        <div className="flex items-baseline justify-between gap-3">
          <h2 className="text-sm font-medium">All deliveries</h2>
          <Button variant="outline" size="sm" render={<Link href="/portal/orders" />}>My Orders</Button>
        </div>
        <ul className="mt-3 flex flex-col gap-2">
          {deliveries.map((item) => (
            <li key={item.id}>
              <Link
                href={`/portal/orders/${item.orderId}`}
                className="flex flex-col gap-2 rounded-lg border px-3 py-2.5 hover:bg-muted/40 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="min-w-0">
                  <p className="text-sm font-medium">{item.title}</p>
                  <p className="font-mono text-xs text-muted-foreground">{item.orderNumber}</p>
                </div>
                <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                  <span>{STAGE_SHORT_LABEL[item.currentStage]}</span>
                  <span className="tabular-nums">{deliveryProgress(item)}%</span>
                  <span>{item.estimatedCompletionLabel}</span>
                  <DeliveryHealthBadge health={item.health} />
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
