"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { type ReactNode } from "react";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  INSTALLATION_PRIORITIES,
  INSTALLATION_PRIORITY_LABEL,
  INSTALLATION_TECHNICIANS,
} from "@/data/installations";
import { demoOrders } from "@/data/orders";

const fieldClass =
  "h-8 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50";

const schema = z.object({
  orderId: z.string().min(1, "Select an order"),
  scheduledDate: z.string().min(1, "Enter a date"),
  scheduledTime: z.string().min(1, "Enter a time"),
  technician: z.enum(INSTALLATION_TECHNICIANS, { message: "Select a technician" }),
  priority: z.enum(INSTALLATION_PRIORITIES, { message: "Select a priority" }),
});

type ScheduleValues = z.infer<typeof schema>;

const openOrders = demoOrders.filter((order) => order.status !== "CANCELLED");

export function ScheduleInstallationDialog({
  mode,
  onSubmit,
}: {
  mode: "schedule" | "create";
  onSubmit: (values: {
    orderId: string;
    orderNumber: string;
    customerId: string;
    customerName: string;
    siteName: string;
    serviceId: string;
    serviceNumber: string;
    serviceName: string;
    scheduledDate: string;
    scheduledTime: string;
    technician: string;
    priority: ScheduleValues["priority"];
    status: "SCHEDULED" | "PREPARATION";
  }) => void;
}) {
  const form = useForm<ScheduleValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      orderId: "",
      scheduledDate: "2026-10-22",
      scheduledTime: "08:00",
      technician: "Installation Team",
      priority: "MEDIUM",
    },
  });

  return (
    <form
      className="flex flex-col gap-3"
      onSubmit={form.handleSubmit((values) => {
        const order = openOrders.find((item) => item.id === values.orderId);

        if (!order) return;

        onSubmit({
          orderId: order.id,
          orderNumber: order.orderNumber,
          customerId: order.customer.id,
          customerName: order.customer.name,
          siteName: order.sites[0]?.name ?? order.customer.name,
          serviceId: `srv-${order.id}`,
          serviceNumber: order.orderNumber.replace("ORD", "SRV"),
          serviceName: order.product,
          scheduledDate: values.scheduledDate,
          scheduledTime: values.scheduledTime,
          technician: values.technician,
          priority: values.priority,
          status: mode === "schedule" ? "SCHEDULED" : "PREPARATION",
        });
      })}
    >
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
        <Field label="Date" error={form.formState.errors.scheduledDate?.message}>
          <Input type="date" {...form.register("scheduledDate")} />
        </Field>
        <Field label="Time" error={form.formState.errors.scheduledTime?.message}>
          <Input type="time" {...form.register("scheduledTime")} />
        </Field>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <Field label="Technician" error={form.formState.errors.technician?.message}>
          <select className={fieldClass} {...form.register("technician")}>
            {INSTALLATION_TECHNICIANS.map((technician) => (
              <option key={technician} value={technician}>{technician}</option>
            ))}
          </select>
        </Field>
        <Field label="Priority" error={form.formState.errors.priority?.message}>
          <select className={fieldClass} {...form.register("priority")}>
            {INSTALLATION_PRIORITIES.map((priority) => (
              <option key={priority} value={priority}>{INSTALLATION_PRIORITY_LABEL[priority]}</option>
            ))}
          </select>
        </Field>
      </div>
      <div className="flex flex-wrap justify-end gap-2">
        <Button type="submit" size="sm">
          {mode === "schedule" ? "Schedule Installation" : "Create Installation"}
        </Button>
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
