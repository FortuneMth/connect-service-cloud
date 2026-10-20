"use client";

import { CustomerLink, OrderLink } from "@/components/service-delivery/feasibility-workspace";
import { useDelivery } from "@/components/service-delivery/delivery-store";
import { StatusBadge } from "@/components/shell/status-badge";
import { Button } from "@/components/ui/button";
import {
  BLOCKER_STATUS_LABEL,
  DELIVERY_OWNERS,
  type DeliveryBlocker,
} from "@/data/service-delivery";

const selectClass =
  "h-8 rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50";

export function DeliveryBlockers({ blockers }: { blockers: DeliveryBlocker[] }) {
  const { resolveBlocker, assignBlocker } = useDelivery();

  return (
    <section className="min-w-0 rounded-lg border bg-card">
      <header className="border-b px-4 py-2.5">
        <h2 className="text-sm font-medium">Delivery Blockers</h2>
        <p className="mt-0.5 text-xs text-muted-foreground">Items stopping an order from moving toward activation.</p>
      </header>
      <div className="hidden overflow-x-auto md:block">
        <table className="w-full min-w-[68rem] text-left text-sm">
          <thead className="border-b bg-muted/40 text-xs text-muted-foreground">
            <tr>
              <th className="px-3 py-2 font-medium">Order</th>
              <th className="px-3 py-2 font-medium">Blocker</th>
              <th className="px-3 py-2 font-medium">Owner</th>
              <th className="px-3 py-2 font-medium">Identified</th>
              <th className="px-3 py-2 font-medium">Impact</th>
              <th className="px-3 py-2 font-medium">Target Resolution</th>
              <th className="px-3 py-2 font-medium">Status</th>
              <th className="px-3 py-2 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {blockers.map((blocker) => (
              <tr key={blocker.id} className="border-b last:border-0">
                <td className="px-3 py-2.5">
                  <OrderLink id={blocker.orderId} number={blocker.orderNumber} />
                  <p className="text-xs text-muted-foreground">{blocker.customerName}</p>
                </td>
                <td className="px-3 py-2.5">{blocker.blocker}</td>
                <td className="px-3 py-2.5">{blocker.ownerName}</td>
                <td className="px-3 py-2.5">{blocker.identifiedLabel}</td>
                <td className="px-3 py-2.5">{blocker.impact}</td>
                <td className="px-3 py-2.5">{blocker.targetLabel}</td>
                <td className="px-3 py-2.5"><StatusBadge status={BLOCKER_STATUS_LABEL[blocker.status]} /></td>
                <td className="px-3 py-2.5">
                  <BlockerActions
                    blocker={blocker}
                    onResolve={() => resolveBlocker(blocker.id)}
                    onAssign={(ownerId) => assignBlocker(blocker.id, ownerId)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <ul className="divide-y md:hidden">
        {blockers.map((blocker) => (
          <li key={blocker.id} className="flex flex-col gap-2 px-4 py-3 text-sm">
            <div className="flex items-start justify-between gap-3">
              <div>
                <OrderLink id={blocker.orderId} number={blocker.orderNumber} />
                <p className="text-muted-foreground"><CustomerLink id={blocker.customerId} name={blocker.customerName} /></p>
              </div>
              <StatusBadge status={BLOCKER_STATUS_LABEL[blocker.status]} />
            </div>
            <p className="font-medium">{blocker.blocker}</p>
            <p className="text-xs text-muted-foreground">
              {blocker.ownerName} · Identified {blocker.identifiedLabel} · Target {blocker.targetLabel}
            </p>
            <p className="text-xs text-muted-foreground">{blocker.impact}</p>
            <BlockerActions
              blocker={blocker}
              onResolve={() => resolveBlocker(blocker.id)}
              onAssign={(ownerId) => assignBlocker(blocker.id, ownerId)}
            />
          </li>
        ))}
      </ul>
    </section>
  );
}

function BlockerActions({
  blocker,
  onResolve,
  onAssign,
}: {
  blocker: DeliveryBlocker;
  onResolve: () => void;
  onAssign: (ownerId: string) => void;
}) {
  const closed = blocker.status === "RESOLVED";

  return (
    <div className="flex min-w-0 flex-wrap items-center gap-2">
      <select
        aria-label={`Assign owner for ${blocker.blocker}`}
        className={selectClass}
        value={blocker.assignedUserId}
        disabled={closed}
        onChange={(event) => onAssign(event.target.value)}
      >
        {DELIVERY_OWNERS.map((owner) => (
          <option key={owner.id} value={owner.id}>{owner.name}</option>
        ))}
      </select>
      <Button type="button" size="sm" variant="outline" disabled={closed} onClick={onResolve}>
        Resolve Blocker
      </Button>
    </div>
  );
}
