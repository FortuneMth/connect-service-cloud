"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { type ReactNode } from "react";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ACCESS_TYPES, SERVICE_TERMS } from "@/data/services";
import { demoOrders } from "@/data/orders";
import type { CreateServiceInput } from "@/components/services/service-store";

const fieldClass =
  "h-8 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50";

const schema = z.object({
  orderId: z.string().min(1, "Select an order"),
  bandwidth: z.string().min(1, "Enter the bandwidth"),
  accessType: z.enum(ACCESS_TYPES, { message: "Select an access type" }),
  monthly: z.string().refine((value) => Number(value) > 0, "Enter a monthly charge"),
  termMonths: z.enum(SERVICE_TERMS, { message: "Select a term" }),
});

type ProvisionValues = z.infer<typeof schema>;

const openOrders = demoOrders.filter((order) => order.status !== "CANCELLED");

export function ProvisionServiceDialog({
  mode,
  onSubmit,
}: {
  mode: "provision" | "create";
  onSubmit: (input: CreateServiceInput) => void;
}) {
  const form = useForm<ProvisionValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      orderId: "",
      bandwidth: "",
      accessType: "Fibre",
      monthly: "",
      termMonths: "24",
    },
  });

  return (
    <form
      className="flex flex-col gap-3"
      onSubmit={form.handleSubmit((values) => {
        const order = openOrders.find((item) => item.id === values.orderId);

        if (!order) return;

        const site = order.sites[0];

        onSubmit({
          orderId: order.id,
          orderNumber: order.orderNumber,
          customerId: order.customer.id,
          customerName: order.customer.name,
          siteId: site?.id ?? `site-${order.id}`,
          siteName: site?.name ?? order.customer.name,
          address: site?.address ?? "",
          product: order.product,
          bandwidth: values.bandwidth,
          accessType: values.accessType,
          monthly: Number(values.monthly),
          termMonths: Number(values.termMonths),
          status: mode === "provision" ? "PROVISIONING" : "PENDING",
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
        <Field label="Bandwidth" error={form.formState.errors.bandwidth?.message}>
          <Input {...form.register("bandwidth")} placeholder="200 Mbps" />
        </Field>
        <Field label="Access" error={form.formState.errors.accessType?.message}>
          <select className={fieldClass} {...form.register("accessType")}>
            {ACCESS_TYPES.map((access) => (
              <option key={access} value={access}>{access}</option>
            ))}
          </select>
        </Field>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <Field label="Monthly charge" error={form.formState.errors.monthly?.message}>
          <Input type="number" min={1} {...form.register("monthly")} />
        </Field>
        <Field label="Term" error={form.formState.errors.termMonths?.message}>
          <select className={fieldClass} {...form.register("termMonths")}>
            {SERVICE_TERMS.map((term) => (
              <option key={term} value={term}>{term} months</option>
            ))}
          </select>
        </Field>
      </div>
      <div className="flex flex-wrap justify-end gap-2">
        <Button type="submit" size="sm">
          {mode === "provision" ? "Provision Service" : "Create Service"}
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
