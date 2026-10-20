"use client";

import Link from "next/link";
import { useState, type ReactNode } from "react";

import { OrderEditForm } from "@/components/orders/order-form";
import { OrderProgress } from "@/components/orders/order-progress";
import { StatusBadge } from "@/components/shell/status-badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useOrders } from "@/components/orders/order-store";
import {
  ORDER_PRIORITY_LABEL,
  ORDER_STAGE_DETAIL,
  ORDER_STAGES,
  ORDER_STATUS_LABEL,
  ORDER_TYPE_LABEL,
  formatRand,
  isOrderStage,
  lifecycleStage,
  nextOrderStage,
  type OrderRecord,
  type OrderStage,
} from "@/data/orders";

const fieldClass =
  "h-20 w-full rounded-lg border border-input bg-transparent px-2.5 py-2 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50";

export function OrderDetail({ id }: { id: string }) {
  const store = useOrders();
  const order = store.orders.find((item) => item.id === id);
  const [editing, setEditing] = useState(false);
  const [saved, setSaved] = useState(false);
  const [reason, setReason] = useState<"hold" | "block" | "cancel" | "risk" | null>(null);
  const [note, setNote] = useState("");

  if (!order) {
    return (
      <div className="rounded-lg border bg-card px-4 py-8">
        <h1 className="text-lg font-semibold">Order not found</h1>
        <p className="mt-1 text-sm text-muted-foreground">This order is not in the current order book.</p>
        <Button className="mt-4" render={<Link href="/orders" />}>
          Back to Orders
        </Button>
      </div>
    );
  }

  const stage = lifecycleStage(order);
  const next = isOrderStage(order.status) ? nextOrderStage(order.status) : null;
  const closed = order.status === "COMPLETED" || order.status === "CANCELLED";

  return (
    <div className="flex min-w-0 flex-col gap-4">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0">
          <p className="text-xs text-muted-foreground">Order 360</p>
          <h1 className="font-heading text-xl font-semibold tracking-tight">{order.orderNumber}</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {order.customer.name} · {order.product}
          </p>
          <div className="mt-2 flex flex-wrap items-center gap-1.5">
            <StatusBadge status={ORDER_STATUS_LABEL[order.status]} />
            <StatusBadge status={ORDER_PRIORITY_LABEL[order.priority]} />
            <StatusBadge status={ORDER_TYPE_LABEL[order.orderType]} />
            {order.atRisk ? <StatusBadge status="At Risk" /> : null}
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button
            type="button"
            size="sm"
            variant="outline"
            disabled={order.status === "CANCELLED"}
            onClick={() => {
              setSaved(false);
              setEditing(true);
            }}
          >
            Edit
          </Button>
          {order.status === "ON_HOLD" ? (
            <Button type="button" size="sm" onClick={() => store.resumeOrder(order.id)}>
              Resume
            </Button>
          ) : (
            <Button type="button" size="sm" variant="outline" disabled={!next} onClick={() => store.advanceOrder(order.id)}>
              {next ? `Move to ${ORDER_STATUS_LABEL[next]}` : "Advance"}
            </Button>
          )}
          {order.status === "BLOCKED" ? (
            <Button type="button" size="sm" variant="outline" onClick={() => store.unblockOrder(order.id)}>
              Unblock
            </Button>
          ) : (
            <Button type="button" size="sm" variant="outline" disabled={!isOrderStage(order.status) || order.status === "COMPLETED"} onClick={() => openReason("block")}>
              Block
            </Button>
          )}
          <Button type="button" size="sm" variant="outline" disabled={!isOrderStage(order.status) || order.status === "COMPLETED"} onClick={() => openReason("hold")}>
            Hold
          </Button>
          <Button
            type="button"
            size="sm"
            variant="outline"
            disabled={closed}
            onClick={() => {
              if (order.atRisk) {
                store.setOrderRisk(order.id, false, "");
                return;
              }
              openReason("risk");
            }}
          >
            {order.atRisk ? "Clear risk" : "Mark at risk"}
          </Button>
          <Button type="button" size="sm" variant="outline" disabled={closed} onClick={() => openReason("cancel")}>
            Cancel
          </Button>
        </div>
      </div>
      {closed ? (
        <p className="text-xs text-muted-foreground">
          {order.status === "COMPLETED"
            ? "This order is completed. Delivery, installation, and billing records can be opened from it later."
            : "This order is cancelled. Stage changes stay closed on this record."}
        </p>
      ) : null}

      <Lifecycle order={order} stage={stage} />

      <div className="grid min-w-0 gap-4 xl:grid-cols-[minmax(0,1.4fr)_minmax(18rem,0.8fr)]">
        <div className="flex min-w-0 flex-col gap-4">
          <section className="rounded-lg border bg-card">
            <header className="border-b px-4 py-2.5">
              <h2 className="text-sm font-medium">Order summary</h2>
            </header>
            <dl className="grid gap-3 px-4 py-3 sm:grid-cols-2">
              <Fact label="Order value" value={formatRand(order.value)} />
              <Fact label="Delivery progress" value={<OrderProgress value={order.progress} />} />
              <Fact label="Target activation" value={order.targetActivationLabel} />
              <Fact label="Owner" value={order.ownerName} />
              <Fact label="Created" value={order.createdLabel} />
              <Fact label="Last activity" value={order.lastActivityLabel} />
              <div className="sm:col-span-2">
                <Fact label="Notes" value={order.notes || "No operational notes yet."} />
              </div>
            </dl>
          </section>

          <section className="rounded-lg border bg-card">
            <header className="border-b px-4 py-2.5">
              <h2 className="text-sm font-medium">Delivery milestones</h2>
              <p className="mt-0.5 text-xs text-muted-foreground">
                The operational stages later delivery, installation, and billing work will read from this order.
              </p>
            </header>
            <ol className="divide-y">
              {ORDER_STAGES.map((item) => {
                const state = milestoneState(order, stage, item);

                return (
                  <li key={item} className="flex items-center justify-between gap-3 px-4 py-2.5 text-sm">
                    <div className="min-w-0">
                      <p className={state === "pending" ? "text-muted-foreground" : "font-medium"}>{ORDER_STAGE_DETAIL[item]}</p>
                      <p className="text-xs text-muted-foreground">{ORDER_STATUS_LABEL[item]}</p>
                    </div>
                    <span className="text-xs text-muted-foreground">{stateLabel(state, order)}</span>
                  </li>
                );
              })}
            </ol>
          </section>

          <section className="rounded-lg border bg-card">
            <header className="border-b px-4 py-2.5">
              <h2 className="text-sm font-medium">Sites</h2>
            </header>
            <ul className="divide-y">
              {order.sites.map((site) => (
                <li key={site.id} className="grid gap-1 px-4 py-3 text-sm sm:grid-cols-[minmax(0,1fr)_10rem_8rem]">
                  <div className="min-w-0">
                    <p className="font-medium">{site.name}</p>
                    <p className="text-xs text-muted-foreground">{site.address}</p>
                  </div>
                  <p>{site.service}</p>
                  <p className="text-muted-foreground">
                    {site.accessStatus}
                    <span className="block text-xs">{site.targetLabel}</span>
                  </p>
                </li>
              ))}
            </ul>
          </section>

          <section className="rounded-lg border bg-card">
            <header className="border-b px-4 py-2.5">
              <h2 className="text-sm font-medium">Activity</h2>
            </header>
            <ol className="divide-y">
              {order.activity.map((item) => (
                <li key={item.id} className="px-4 py-2.5 text-sm">
                  <p>{item.summary}</p>
                  <p className="text-xs text-muted-foreground">
                    {item.actorName} · {item.occurredLabel}
                  </p>
                </li>
              ))}
            </ol>
          </section>
        </div>

        <div className="flex min-w-0 flex-col gap-4">
          <section className="rounded-lg border bg-card">
            <header className="border-b px-4 py-2.5">
              <h2 className="text-sm font-medium">Customer</h2>
            </header>
            <div className="flex flex-col gap-2 px-4 py-3 text-sm">
              <Link href={`/customers/${order.customer.id}`} className="font-medium underline-offset-4 hover:underline">
                {order.customer.name}
              </Link>
              <p className="text-muted-foreground">{order.customer.customerNumber}</p>
              <p>{order.customer.primaryContactName}</p>
              <p className="text-muted-foreground">{order.customer.primaryContactEmail}</p>
              <p className="text-muted-foreground">{order.customer.primaryContactPhone}</p>
            </div>
          </section>

          <section className="rounded-lg border bg-card">
            <header className="border-b px-4 py-2.5">
              <h2 className="text-sm font-medium">Source quote</h2>
            </header>
            <div className="px-4 py-3 text-sm">
              {order.quoteId && order.quoteNumber ? (
                <Link href={`/quotes/${order.quoteId}`} className="font-medium underline-offset-4 hover:underline">
                  {order.quoteNumber}
                </Link>
              ) : (
                <p className="text-muted-foreground">This order was opened without a linked quote.</p>
              )}
              <p className="mt-2 text-muted-foreground">{order.product}</p>
            </div>
          </section>

          <section className="rounded-lg border bg-card">
            <header className="border-b px-4 py-2.5">
              <h2 className="text-sm font-medium">Exceptions</h2>
            </header>
            <div className="flex flex-col gap-3 px-4 py-3 text-sm">
              <Exception label="At risk" value={order.atRisk ? order.riskNote || "Flagged for operational attention." : "Not flagged."} />
              <Exception label="On hold" value={order.status === "ON_HOLD" ? order.holdReason : "Not on hold."} />
              <Exception label="Blocked" value={order.status === "BLOCKED" ? order.blockReason : "Not blocked."} />
              <Exception label="Cancelled" value={order.status === "CANCELLED" ? order.cancelReason : "Not cancelled."} />
            </div>
          </section>
        </div>
      </div>

      <Dialog open={editing} onOpenChange={setEditing}>
        <DialogContent className="max-h-[min(44rem,calc(100%-2rem))] w-[min(42rem,calc(100%-2rem))] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Order</DialogTitle>
            <DialogDescription>
              {saved
                ? `${order.orderNumber} was updated in this browser session.`
                : `Update ${order.orderNumber}. Changes stay in this browser session.`}
            </DialogDescription>
          </DialogHeader>
          {saved ? (
            <div className="flex justify-end">
              <Button type="button" onClick={() => setEditing(false)}>
                Close
              </Button>
            </div>
          ) : (
            <OrderEditForm
              order={order}
              onSubmit={(values) => {
                store.updateOrder(order.id, values);
                setSaved(true);
              }}
            />
          )}
        </DialogContent>
      </Dialog>

      <Dialog
        open={reason !== null}
        onOpenChange={(open) => {
          if (!open) {
            setReason(null);
            setNote("");
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{reasonTitle(reason)}</DialogTitle>
            <DialogDescription>{reasonCopy(reason, order.orderNumber)}</DialogDescription>
          </DialogHeader>
          <textarea
            className={fieldClass}
            value={note}
            onChange={(event) => setNote(event.target.value)}
            aria-label="Reason"
          />
          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setReason(null);
                setNote("");
              }}
            >
              Close
            </Button>
            <Button type="button" disabled={note.trim().length === 0} onClick={() => submitReason(order)}>
              Save
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );

  function openReason(nextReason: "hold" | "block" | "cancel" | "risk") {
    setNote("");
    setReason(nextReason);
  }

  function submitReason(current: OrderRecord) {
    const text = note.trim();

    if (!text || !reason) {
      return;
    }

    if (reason === "hold") {
      store.holdOrder(current.id, text);
    }

    if (reason === "block") {
      store.blockOrder(current.id, text);
    }

    if (reason === "cancel") {
      store.cancelOrder(current.id, text);
    }

    if (reason === "risk") {
      store.setOrderRisk(current.id, true, text);
    }

    setReason(null);
    setNote("");
  }
}

function Lifecycle({ order, stage }: { order: OrderRecord; stage: OrderStage }) {
  const currentIndex = ORDER_STAGES.indexOf(stage);

  return (
    <section className="min-w-0">
      <div className="mb-2 flex items-baseline justify-between gap-3">
        <h2 className="text-sm font-medium">Lifecycle</h2>
        <p className="text-xs text-muted-foreground">{ORDER_STAGE_DETAIL[stage]}</p>
      </div>
      <ol className="flex min-w-0 gap-2 overflow-x-auto pb-1">
        {ORDER_STAGES.map((item, index) => {
          const current = index === currentIndex && order.status !== "CANCELLED";
          const done = index < currentIndex || order.status === "COMPLETED";

          return (
            <li
              key={item}
              className={`min-w-28 shrink-0 rounded-lg border px-2.5 py-2 text-xs ${
                current ? "border-foreground bg-card" : done ? "bg-muted/40 text-muted-foreground" : "bg-card text-muted-foreground"
              }`}
            >
              {ORDER_STATUS_LABEL[item]}
            </li>
          );
        })}
      </ol>
    </section>
  );
}

function Fact({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div>
      <dt className="text-xs text-muted-foreground">{label}</dt>
      <dd className="mt-1 text-sm">{value}</dd>
    </div>
  );
}

function Exception({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="mt-1">{value}</p>
    </div>
  );
}

function milestoneState(order: OrderRecord, stage: OrderStage, item: OrderStage) {
  if (order.status === "COMPLETED") {
    return "done" as const;
  }

  const current = ORDER_STAGES.indexOf(stage);
  const index = ORDER_STAGES.indexOf(item);

  if (index < current) {
    return "done" as const;
  }

  if (index === current) {
    if (order.status === "ON_HOLD") {
      return "hold" as const;
    }

    if (order.status === "BLOCKED") {
      return "blocked" as const;
    }

    if (order.status === "CANCELLED") {
      return "cancelled" as const;
    }

    return "current" as const;
  }

  return "pending" as const;
}

function stateLabel(state: "done" | "current" | "pending" | "hold" | "blocked" | "cancelled", order: OrderRecord) {
  if (state === "done") {
    return "Done";
  }

  if (state === "current") {
    return "Current";
  }

  if (state === "hold") {
    return "On hold";
  }

  if (state === "blocked") {
    return "Blocked";
  }

  if (state === "cancelled") {
    return "Cancelled";
  }

  return order.status === "CANCELLED" ? "Not reached" : "Pending";
}

function reasonTitle(reason: "hold" | "block" | "cancel" | "risk" | null) {
  if (reason === "hold") {
    return "Place on hold";
  }

  if (reason === "block") {
    return "Block order";
  }

  if (reason === "cancel") {
    return "Cancel order";
  }

  return "Mark at risk";
}

function reasonCopy(reason: "hold" | "block" | "cancel" | "risk" | null, orderNumber: string) {
  if (reason === "hold") {
    return `Record why ${orderNumber} is paused. The order stays in this browser session.`;
  }

  if (reason === "block") {
    return `Record what is stopping ${orderNumber}. The order stays in this browser session.`;
  }

  if (reason === "cancel") {
    return `Record why ${orderNumber} is cancelled. The order stays in this browser session.`;
  }

  return `Record why ${orderNumber} needs operational attention.`;
}
