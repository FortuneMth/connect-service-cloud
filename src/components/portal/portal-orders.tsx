"use client";

import Link from "next/link";

import { DeliveryHealthBadge } from "@/components/portal/delivery-health";
import { usePortalDelivery } from "@/components/portal/portal-delivery-store";
import { deliveryProgress, STAGE_SHORT_LABEL } from "@/data/portal";

export function PortalOrders() {
  const { deliveries } = usePortalDelivery();
  const active = deliveries.filter((item) => item.health !== "COMPLETED" && item.currentStage !== "SERVICE_LIVE");
  const completed = deliveries.filter((item) => item.health === "COMPLETED" || item.currentStage === "SERVICE_LIVE");

  return (
    <div className="flex min-w-0 flex-col gap-6">
      <header>
        <h1 className="font-heading text-xl font-semibold tracking-tight">My Orders</h1>
        <p className="mt-1 text-sm text-muted-foreground">Track connectivity orders from placement through activation.</p>
      </header>

      <OrderGroup title="Active orders" items={active} empty="No active orders." />
      <OrderGroup title="Completed orders" items={completed} empty="No completed orders yet." />
    </div>
  );
}

function OrderGroup({
  title,
  items,
  empty,
}: {
  title: string;
  items: ReturnType<typeof usePortalDelivery>["deliveries"];
  empty: string;
}) {
  return (
    <section className="min-w-0">
      <h2 className="mb-2 text-sm font-medium">{title}</h2>
      {items.length === 0 ? (
        <p className="rounded-lg border bg-card px-4 py-6 text-sm text-muted-foreground">{empty}</p>
      ) : (
        <>
          <div className="hidden min-w-0 overflow-x-auto md:block">
            <table className="w-full min-w-[48rem] text-left text-sm">
              <thead className="text-xs text-muted-foreground">
                <tr className="border-b">
                  <th className="px-3 py-2 font-medium">Order</th>
                  <th className="px-3 py-2 font-medium">Stage</th>
                  <th className="px-3 py-2 font-medium">Progress</th>
                  <th className="px-3 py-2 font-medium">Estimated completion</th>
                  <th className="px-3 py-2 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <tr key={item.id} className="border-b last:border-0 hover:bg-muted/40">
                    <td className="px-3 py-3">
                      <Link href={`/portal/orders/${item.orderId}`} className="font-medium underline-offset-4 hover:underline">
                        {item.title}
                      </Link>
                      <p className="font-mono text-xs text-muted-foreground">{item.orderNumber}</p>
                    </td>
                    <td className="px-3 py-3">{STAGE_SHORT_LABEL[item.currentStage]}</td>
                    <td className="px-3 py-3 tabular-nums">{deliveryProgress(item)}%</td>
                    <td className="px-3 py-3">{item.estimatedCompletionLabel}</td>
                    <td className="px-3 py-3"><DeliveryHealthBadge health={item.health} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <ul className="flex flex-col gap-2 md:hidden">
            {items.map((item) => (
              <li key={item.id}>
                <Link href={`/portal/orders/${item.orderId}`} className="block rounded-lg border bg-card px-3 py-3">
                  <p className="text-sm font-medium">{item.title}</p>
                  <p className="font-mono text-xs text-muted-foreground">{item.orderNumber}</p>
                  <p className="mt-2 text-xs text-muted-foreground">
                    {STAGE_SHORT_LABEL[item.currentStage]} · {deliveryProgress(item)}% · {item.estimatedCompletionLabel}
                  </p>
                  <div className="mt-2"><DeliveryHealthBadge health={item.health} /></div>
                </Link>
              </li>
            ))}
          </ul>
        </>
      )}
    </section>
  );
}
