"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import type { ReactNode } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { demoOrders } from "@/data/orders";
import {
  DELIVERY_OWNERS,
  DELIVERY_STAGES,
  DELIVERY_STAGE_LABEL,
  TASK_PRIORITIES,
  TASK_PRIORITY_LABEL,
  type DeliveryStage,
  type TaskPriority,
} from "@/data/service-delivery";

const fieldClass =
  "h-8 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50";

const schema = z.object({
  orderId: z.string().min(1, "Select an order"),
  stage: z.enum(DELIVERY_STAGES, { message: "Select a stage" }),
  title: z.string().trim().min(1, "Enter a task"),
  description: z.string().trim().min(1, "Enter a description"),
  ownerId: z.string().min(1, "Select an owner"),
  priority: z.enum(TASK_PRIORITIES, { message: "Select a priority" }),
  dueDate: z.string().min(1, "Enter a due date"),
  dependency: z.string().trim().min(1, "Enter a dependency"),
});

type TaskValues = z.infer<typeof schema>;

const openOrders = demoOrders.filter((order) => order.status !== "CANCELLED" && order.status !== "COMPLETED");

export function DeliveryTaskDialog({
  onSubmit,
}: {
  onSubmit: (values: TaskValues) => void;
}) {
  const form = useForm<TaskValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      orderId: "",
      stage: "FEASIBILITY",
      title: "",
      description: "",
      ownerId: "",
      priority: "MEDIUM",
      dueDate: "",
      dependency: "",
    },
  });

  return (
    <form className="flex flex-col gap-3" onSubmit={form.handleSubmit(onSubmit)}>
      <Field label="Order" error={form.formState.errors.orderId?.message}>
        <select className={fieldClass} {...form.register("orderId")}>
          <option value="">Select an order</option>
          {openOrders.map((order) => (
            <option key={order.id} value={order.id}>
              {order.orderNumber} · {order.customer.name}
            </option>
          ))}
        </select>
      </Field>
      <div className="grid gap-3 sm:grid-cols-2">
        <Field label="Stage" error={form.formState.errors.stage?.message}>
          <select className={fieldClass} {...form.register("stage")}>
            {DELIVERY_STAGES.map((stage) => (
              <option key={stage} value={stage}>{DELIVERY_STAGE_LABEL[stage]}</option>
            ))}
          </select>
        </Field>
        <Field label="Priority" error={form.formState.errors.priority?.message}>
          <select className={fieldClass} {...form.register("priority")}>
            {TASK_PRIORITIES.map((priority) => (
              <option key={priority} value={priority}>{TASK_PRIORITY_LABEL[priority]}</option>
            ))}
          </select>
        </Field>
      </div>
      <Field label="Task" error={form.formState.errors.title?.message}>
        <Input {...form.register("title")} />
      </Field>
      <Field label="Description" error={form.formState.errors.description?.message}>
        <textarea className={`${fieldClass} h-20 py-2`} {...form.register("description")} />
      </Field>
      <div className="grid gap-3 sm:grid-cols-2">
        <Field label="Owner" error={form.formState.errors.ownerId?.message}>
          <select className={fieldClass} {...form.register("ownerId")}>
            <option value="">Select an owner</option>
            {DELIVERY_OWNERS.map((owner) => (
              <option key={owner.id} value={owner.id}>{owner.name}</option>
            ))}
          </select>
        </Field>
        <Field label="Due date" error={form.formState.errors.dueDate?.message}>
          <Input type="date" {...form.register("dueDate")} />
        </Field>
      </div>
      <Field label="Dependency" error={form.formState.errors.dependency?.message}>
        <Input {...form.register("dependency")} />
      </Field>
      <div className="flex justify-end">
        <Button type="submit">Create Delivery Task</Button>
      </div>
    </form>
  );
}

function Field({ label, error, children }: { label: string; error?: string; children: ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <Label>{label}</Label>
      {children}
      {error ? <p className="text-xs text-destructive">{error}</p> : null}
    </div>
  );
}

export type { TaskValues, DeliveryStage, TaskPriority };
