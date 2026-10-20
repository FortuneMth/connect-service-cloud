"use client";

import Link from "next/link";
import type { ReactNode } from "react";

import { StatusBadge } from "@/components/shell/status-badge";
import { Button } from "@/components/ui/button";
import { useDelivery } from "@/components/service-delivery/delivery-store";
import {
  DELIVERY_OWNERS,
  DELIVERY_STAGE_LABEL,
  TASK_PRIORITIES,
  TASK_PRIORITY_LABEL,
  TASK_STATUSES,
  TASK_STATUS_LABEL,
  type TaskPriority,
  type TaskStatus,
} from "@/data/service-delivery";

const selectClass =
  "h-8 rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50";

export function DeliveryTaskDetail({ id }: { id: string }) {
  const store = useDelivery();
  const task = store.book.tasks.find((item) => item.id === id);

  if (!task) {
    return (
      <div className="rounded-lg border bg-card px-4 py-8">
        <h1 className="text-lg font-semibold">Delivery task not found</h1>
        <p className="mt-1 text-sm text-muted-foreground">This task is not in the current delivery book.</p>
        <Button className="mt-4" render={<Link href="/service-delivery" />}>
          Back to Service Delivery
        </Button>
      </div>
    );
  }

  const done = task.status === "DONE";

  return (
    <div className="flex min-w-0 flex-col gap-4">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0">
          <p className="text-xs text-muted-foreground">Delivery task</p>
          <h1 className="font-heading text-xl font-semibold tracking-tight">{task.title}</h1>
          <p className="mt-1 text-sm text-muted-foreground">{task.orderNumber} · {task.customerName}</p>
          <div className="mt-2 flex flex-wrap items-center gap-1.5">
            <StatusBadge status={DELIVERY_STAGE_LABEL[task.stage]} />
            <StatusBadge status={TASK_STATUS_LABEL[task.status]} />
            <StatusBadge status={TASK_PRIORITY_LABEL[task.priority]} />
            {task.atRisk ? <StatusBadge status="At Risk" /> : null}
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button type="button" size="sm" disabled={done} onClick={() => store.completeTask(task.id)}>
            Mark Done
          </Button>
          <Button type="button" size="sm" variant="outline" render={<Link href={`/orders/${task.orderId}`} />}>
            Open Order
          </Button>
        </div>
      </div>

      <section className="rounded-lg border bg-card">
        <header className="border-b px-4 py-2.5">
          <h2 className="text-sm font-medium">Task</h2>
        </header>
        <dl className="grid gap-3 px-4 py-3 sm:grid-cols-2">
          <Fact label="Order" value={<Link className="underline-offset-4 hover:underline" href={`/orders/${task.orderId}`}>{task.orderNumber}</Link>} />
          <Fact label="Customer" value={<Link className="underline-offset-4 hover:underline" href={`/customers/${task.customerId}`}>{task.customerName}</Link>} />
          <Fact label="Delivery stage" value={DELIVERY_STAGE_LABEL[task.stage]} />
          <Fact label="Dependency" value={task.dependency} />
          <Fact label="Due date" value={task.dueLabel} />
          <Fact label="Created" value={task.createdLabel} />
          <Fact label="Last updated" value={task.updatedLabel} />
          <div className="sm:col-span-2">
            <Fact label="Description" value={task.description} />
          </div>
        </dl>
      </section>

      <section className="rounded-lg border bg-card">
        <header className="border-b px-4 py-2.5">
          <h2 className="text-sm font-medium">Update task</h2>
          <p className="mt-0.5 text-xs text-muted-foreground">Changes stay in this browser session.</p>
        </header>
        <div className="grid gap-3 px-4 py-3 sm:grid-cols-3">
          <label className="flex flex-col gap-1.5 text-sm">
            Change status
            <select
              className={selectClass}
              value={task.status}
              disabled={done}
              onChange={(event) => store.setTaskStatus(task.id, event.target.value as TaskStatus)}
            >
              {TASK_STATUSES.map((status) => (
                <option key={status} value={status}>{TASK_STATUS_LABEL[status]}</option>
              ))}
            </select>
          </label>
          <label className="flex flex-col gap-1.5 text-sm">
            Reassign
            <select
              className={selectClass}
              value={task.assignedUserId}
              disabled={done}
              onChange={(event) => store.reassignTask(task.id, event.target.value)}
            >
              {DELIVERY_OWNERS.map((owner) => (
                <option key={owner.id} value={owner.id}>{owner.name}</option>
              ))}
            </select>
          </label>
          <label className="flex flex-col gap-1.5 text-sm">
            Change priority
            <select
              className={selectClass}
              value={task.priority}
              disabled={done}
              onChange={(event) => store.setTaskPriority(task.id, event.target.value as TaskPriority)}
            >
              {TASK_PRIORITIES.map((priority) => (
                <option key={priority} value={priority}>{TASK_PRIORITY_LABEL[priority]}</option>
              ))}
            </select>
          </label>
        </div>
      </section>
    </div>
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
