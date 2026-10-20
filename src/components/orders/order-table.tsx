"use client";

import { useRouter } from "next/navigation";
import { Pencil } from "lucide-react";

import { OrderProgress } from "@/components/orders/order-progress";
import { StatusBadge } from "@/components/shell/status-badge";
import { Button } from "@/components/ui/button";
import {
  ORDER_PRIORITY_LABEL,
  ORDER_STATUS_LABEL,
  ORDER_TYPE_LABEL,
  formatRand,
  type OrderRecord,
} from "@/data/orders";

export function OrderTable({
  orders,
  onEdit,
}: {
  orders: OrderRecord[];
  onEdit: (order: OrderRecord) => void;
}) {
  const router = useRouter();

  if (orders.length === 0) {
    return (
      <div className="rounded-lg border bg-card px-4 py-8 text-sm text-muted-foreground">
        No orders match these filters.
      </div>
    );
  }

  return (
    <div className="min-w-0">
      <div className="hidden overflow-x-auto rounded-lg border md:block">
        <table className="w-full min-w-[76rem] text-left text-sm">
          <thead className="border-b bg-muted/40 text-xs text-muted-foreground">
            <tr>
              <th className="px-3 py-2 font-medium">Order</th>
              <th className="px-3 py-2 font-medium">Customer</th>
              <th className="hidden px-3 py-2 font-medium xl:table-cell">Type</th>
              <th className="px-3 py-2 font-medium">Product / Solution</th>
              <th className="px-3 py-2 font-medium">Status</th>
              <th className="hidden px-3 py-2 font-medium lg:table-cell">Priority</th>
              <th className="px-3 py-2 font-medium">Value</th>
              <th className="hidden px-3 py-2 font-medium lg:table-cell">Delivery Progress</th>
              <th className="hidden px-3 py-2 font-medium xl:table-cell">Owner</th>
              <th className="hidden px-3 py-2 font-medium lg:table-cell">Target Activation</th>
              <th className="hidden px-3 py-2 font-medium xl:table-cell">Last Activity</th>
              <th className="px-3 py-2 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr
                key={order.id}
                className="cursor-pointer border-b last:border-0 hover:bg-muted/30"
                onClick={() => router.push(`/orders/${order.id}`)}
              >
                <td className="px-3 py-2.5 font-medium">{order.orderNumber}</td>
                <td className="px-3 py-2.5">{order.customer.name}</td>
                <td className="hidden px-3 py-2.5 xl:table-cell">{ORDER_TYPE_LABEL[order.orderType]}</td>
                <td className="max-w-56 px-3 py-2.5">{order.product}</td>
                <td className="px-3 py-2.5">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <StatusBadge status={ORDER_STATUS_LABEL[order.status]} />
                    {order.atRisk ? <StatusBadge status="At Risk" /> : null}
                  </div>
                </td>
                <td className="hidden px-3 py-2.5 lg:table-cell">
                  <StatusBadge status={ORDER_PRIORITY_LABEL[order.priority]} />
                </td>
                <td className="px-3 py-2.5 tabular-nums">{formatRand(order.value)}</td>
                <td className="hidden px-3 py-2.5 lg:table-cell">
                  <OrderProgress value={order.progress} />
                </td>
                <td className="hidden px-3 py-2.5 xl:table-cell">{order.ownerName}</td>
                <td className="hidden px-3 py-2.5 lg:table-cell">{order.targetActivationLabel}</td>
                <td className="hidden px-3 py-2.5 xl:table-cell">{order.lastActivityLabel}</td>
                <td className="px-3 py-2.5">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={(event) => {
                      event.stopPropagation();
                      onEdit(order);
                    }}
                  >
                    <Pencil />
                    Edit
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <ul className="flex flex-col gap-2 md:hidden">
        {orders.map((order) => (
          <li key={order.id}>
            <button
              type="button"
              onClick={() => router.push(`/orders/${order.id}`)}
              className="flex w-full flex-col gap-2 rounded-lg border bg-card px-3 py-3 text-left"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="font-medium">{order.orderNumber}</p>
                  <p className="text-sm text-muted-foreground">{order.customer.name}</p>
                </div>
                <StatusBadge status={ORDER_STATUS_LABEL[order.status]} />
              </div>
              <p className="text-sm">{order.product}</p>
              <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                <span>{ORDER_TYPE_LABEL[order.orderType]}</span>
                <span>{ORDER_PRIORITY_LABEL[order.priority]}</span>
                <span className="tabular-nums">{formatRand(order.value)}</span>
                {order.atRisk ? <StatusBadge status="At Risk" /> : null}
              </div>
              <OrderProgress value={order.progress} />
              <p className="text-xs text-muted-foreground">
                {order.ownerName} · Target {order.targetActivationLabel} · {order.lastActivityLabel}
              </p>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
