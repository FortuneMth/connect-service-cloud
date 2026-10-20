import { cn } from "cn";

import { DashboardSection } from "@/components/dashboard/dashboard-section";
import { StatusBadge } from "@/components/shell/status-badge";
import {
  ORDER_STATUS_LABEL,
  ORDER_TYPE_LABEL,
  PRIORITY_LABEL,
  type AttentionOrder,
  type DemoPriority,
} from "@/data/operations-dashboard";

const priorityTone: Record<DemoPriority, string> = {
  URGENT: "bg-red-600",
  HIGH: "bg-amber-500",
  NORMAL: "bg-zinc-400",
  LOW: "bg-zinc-300",
};

function PriorityMark({ priority }: { priority: DemoPriority }) {
  return (
    <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
      <span className={cn("size-1.5 rounded-full", priorityTone[priority])} aria-hidden />
      {PRIORITY_LABEL[priority]}
    </span>
  );
}

export function AttentionOrders({ orders }: { orders: AttentionOrder[] }) {
  return (
    <DashboardSection title="Orders Requiring Attention">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[720px] text-sm">
          <thead>
            <tr className="border-b text-left text-xs text-muted-foreground">
              <th scope="col" className="px-4 py-2 font-medium">Order</th>
              <th scope="col" className="px-4 py-2 font-medium">Customer</th>
              <th scope="col" className="px-4 py-2 font-medium">Type</th>
              <th scope="col" className="px-4 py-2 font-medium">Stage</th>
              <th scope="col" className="px-4 py-2 font-medium">Issue</th>
              <th scope="col" className="px-4 py-2 font-medium">Owner</th>
              <th scope="col" className="px-4 py-2 font-medium">Due</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.orderNumber} className="border-b last:border-b-0">
                <td className="px-4 py-2.5 font-medium whitespace-nowrap tabular-nums">
                  {order.orderNumber}
                </td>
                <td className="px-4 py-2.5 whitespace-nowrap">{order.customerName}</td>
                <td className="px-4 py-2.5 whitespace-nowrap text-muted-foreground">
                  {ORDER_TYPE_LABEL[order.orderType]}
                </td>
                <td className="px-4 py-2.5">
                  <StatusBadge status={ORDER_STATUS_LABEL[order.status]} />
                </td>
                <td className="px-4 py-2.5">
                  <span className="block">{order.issue}</span>
                  <PriorityMark priority={order.priority} />
                </td>
                <td className="px-4 py-2.5 whitespace-nowrap">{order.ownerName}</td>
                <td
                  className={cn(
                    "px-4 py-2.5 whitespace-nowrap",
                    order.dueLabel === "Today" ? "font-medium" : "text-muted-foreground",
                  )}
                >
                  {order.dueLabel}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </DashboardSection>
  );
}
