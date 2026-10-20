import Link from "next/link";

import { StatusBadge } from "@/components/shell/status-badge";
import { Button } from "@/components/ui/button";
import {
  DELIVERY_STAGE_LABEL,
  TASK_PRIORITY_LABEL,
  type DeliveryTask,
} from "@/data/service-delivery";

export function DeliveryAttention({ tasks }: { tasks: DeliveryTask[] }) {
  const attention = tasks
    .filter((task) => task.needsAttention && task.status !== "DONE")
    .sort((a, b) => priorityRank(a.priority) - priorityRank(b.priority) || a.dueDate.localeCompare(b.dueDate));

  return (
    <section className="min-w-0 rounded-lg border bg-card">
      <header className="border-b px-4 py-2.5">
        <h2 className="text-sm font-medium">Delivery Attention Required</h2>
        <p className="mt-0.5 text-xs text-muted-foreground">What needs to happen next to get these orders activated.</p>
      </header>
      <ul className="divide-y">
        {attention.map((task) => (
          <li key={task.id} className="grid gap-3 px-4 py-3 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <Link href={`/orders/${task.orderId}`} className="text-sm font-medium underline-offset-4 hover:underline">
                  {task.orderNumber}
                </Link>
                <StatusBadge status={DELIVERY_STAGE_LABEL[task.stage]} />
                <StatusBadge status={TASK_PRIORITY_LABEL[task.priority]} />
                {task.atRisk ? <StatusBadge status="At Risk" /> : null}
              </div>
              <p className="mt-1 text-sm text-muted-foreground">{task.customerName}</p>
              <p className="mt-1 text-sm font-medium">{task.issue}</p>
              <p className="mt-1 text-xs text-muted-foreground">
                {task.ownerName} · Due {task.dueLabel}
              </p>
            </div>
            <Button type="button" size="sm" variant="outline" render={<Link href={`/orders/${task.orderId}`} />}>
              Open Order
            </Button>
          </li>
        ))}
      </ul>
    </section>
  );
}

function priorityRank(priority: DeliveryTask["priority"]) {
  if (priority === "HIGH") {
    return 0;
  }

  if (priority === "MEDIUM") {
    return 1;
  }

  return 2;
}
