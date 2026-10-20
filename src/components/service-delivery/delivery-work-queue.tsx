"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

import { StatusBadge } from "@/components/shell/status-badge";
import { Button } from "@/components/ui/button";
import {
  DELIVERY_STAGE_LABEL,
  TASK_PRIORITY_LABEL,
  TASK_STATUS_LABEL,
  type DeliveryTask,
} from "@/data/service-delivery";

export function DeliveryWorkQueue({ tasks }: { tasks: DeliveryTask[] }) {
  const router = useRouter();

  if (tasks.length === 0) {
    return (
      <div className="rounded-lg border bg-card px-4 py-8 text-sm text-muted-foreground">
        No delivery work matches these filters.
      </div>
    );
  }

  return (
    <div className="min-w-0">
      <div className="hidden overflow-x-auto rounded-lg border md:block">
        <table className="w-full min-w-[72rem] text-left text-sm">
          <thead className="border-b bg-muted/40 text-xs text-muted-foreground">
            <tr>
              <th className="px-3 py-2 font-medium">Order</th>
              <th className="px-3 py-2 font-medium">Customer</th>
              <th className="px-3 py-2 font-medium">Stage</th>
              <th className="px-3 py-2 font-medium">Work Item</th>
              <th className="hidden px-3 py-2 font-medium lg:table-cell">Owner</th>
              <th className="hidden px-3 py-2 font-medium xl:table-cell">Priority</th>
              <th className="px-3 py-2 font-medium">Status</th>
              <th className="px-3 py-2 font-medium">Due</th>
              <th className="hidden px-3 py-2 font-medium lg:table-cell">Dependency</th>
              <th className="hidden px-3 py-2 font-medium xl:table-cell">Last Updated</th>
              <th className="px-3 py-2 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {tasks.map((task) => (
              <tr
                key={task.id}
                className="cursor-pointer border-b last:border-0 hover:bg-muted/30"
                onClick={() => router.push(`/service-delivery/tasks/${task.id}`)}
              >
                <td className="px-3 py-2.5">
                  <Link href={`/orders/${task.orderId}`} className="font-medium underline-offset-4 hover:underline" onClick={(event) => event.stopPropagation()}>
                    {task.orderNumber}
                  </Link>
                </td>
                <td className="px-3 py-2.5">
                  <Link href={`/customers/${task.customerId}`} className="underline-offset-4 hover:underline" onClick={(event) => event.stopPropagation()}>
                    {task.customerName}
                  </Link>
                </td>
                <td className="px-3 py-2.5"><StatusBadge status={DELIVERY_STAGE_LABEL[task.stage]} /></td>
                <td className="max-w-56 px-3 py-2.5">{task.title}</td>
                <td className="hidden px-3 py-2.5 lg:table-cell">{task.ownerName}</td>
                <td className="hidden px-3 py-2.5 xl:table-cell"><StatusBadge status={TASK_PRIORITY_LABEL[task.priority]} /></td>
                <td className="px-3 py-2.5">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <StatusBadge status={TASK_STATUS_LABEL[task.status]} />
                    {task.atRisk ? <StatusBadge status="At Risk" /> : null}
                  </div>
                </td>
                <td className="px-3 py-2.5">{task.dueLabel}</td>
                <td className="hidden px-3 py-2.5 lg:table-cell">{task.dependency}</td>
                <td className="hidden px-3 py-2.5 xl:table-cell">{task.updatedLabel}</td>
                <td className="px-3 py-2.5">
                  <Button type="button" variant="outline" size="sm" render={<Link href={`/orders/${task.orderId}`} />} onClick={(event) => event.stopPropagation()}>
                    Open Order
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <ul className="flex flex-col gap-2 md:hidden">
        {tasks.map((task) => (
          <li key={task.id}>
            <button
              type="button"
              onClick={() => router.push(`/service-delivery/tasks/${task.id}`)}
              className="flex w-full flex-col gap-2 rounded-lg border bg-card px-3 py-3 text-left"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="font-medium">{task.orderNumber}</p>
                  <p className="text-sm text-muted-foreground">{task.customerName}</p>
                </div>
                <StatusBadge status={TASK_STATUS_LABEL[task.status]} />
              </div>
              <p className="text-sm">{task.title}</p>
              <div className="flex flex-wrap items-center gap-1.5">
                <StatusBadge status={DELIVERY_STAGE_LABEL[task.stage]} />
                <StatusBadge status={TASK_PRIORITY_LABEL[task.priority]} />
                {task.atRisk ? <StatusBadge status="At Risk" /> : null}
              </div>
              <p className="text-xs text-muted-foreground">
                {task.ownerName} · Due {task.dueLabel} · {task.dependency}
              </p>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
