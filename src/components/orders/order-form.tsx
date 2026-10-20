"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMemo, type ReactNode } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { demoCustomers } from "@/data/customers";
import {
  ORDER_PRIORITIES,
  ORDER_PRIORITY_LABEL,
  ORDER_TYPES,
  ORDER_TYPE_LABEL,
  type OrderPriority,
  type OrderRecord,
  type OrderType,
} from "@/data/orders";
import { demoQuotes } from "@/data/quotes";

const fieldClass =
  "h-8 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50";

const createSchema = z.object({
  customerId: z.string().min(1, "Select a customer"),
  quoteId: z.string(),
  orderType: z.enum(ORDER_TYPES, { message: "Select an order type" }),
  product: z.string().trim().min(1, "Enter a product or solution"),
  priority: z.enum(ORDER_PRIORITIES, { message: "Select a priority" }),
  value: z.string().regex(/^\d+(\.\d+)?$/, "Enter an order value"),
  targetActivation: z.string().min(1, "Enter a target activation date"),
  notes: z.string(),
});

const editSchema = z.object({
  product: z.string().trim().min(1, "Enter a product or solution"),
  priority: z.enum(ORDER_PRIORITIES, { message: "Select a priority" }),
  value: z.string().regex(/^\d+(\.\d+)?$/, "Enter an order value"),
  targetActivation: z.string().min(1, "Enter a target activation date"),
  notes: z.string(),
});

type CreateValues = z.infer<typeof createSchema>;
type EditValues = z.infer<typeof editSchema>;

export function OrderForm({
  onSubmit,
}: {
  onSubmit: (values: CreateValues & { quoteNumber: string }) => void;
}) {
  const form = useForm<CreateValues>({
    resolver: zodResolver(createSchema),
    defaultValues: {
      customerId: "",
      quoteId: "",
      orderType: "ENTERPRISE",
      product: "",
      priority: "MEDIUM",
      value: "",
      targetActivation: "",
      notes: "",
    },
  });
  const customerId = form.watch("customerId");
  const quotes = useMemo(
    () => demoQuotes.filter((quote) => quote.customerId === customerId),
    [customerId],
  );

  return (
    <form
      className="flex flex-col gap-3"
      onSubmit={form.handleSubmit((values) => {
        const quote = demoQuotes.find((item) => item.id === values.quoteId);

        onSubmit({ ...values, quoteNumber: quote?.quoteNumber ?? "" });
      })}
    >
      <Field label="Customer" error={form.formState.errors.customerId?.message}>
        <select
          className={fieldClass}
          {...form.register("customerId", {
            onChange: (event) => {
              const customer = demoCustomers.find((item) => item.id === event.target.value);

              form.setValue("quoteId", "");
              if (customer) {
                form.setValue("orderType", customer.type);
              }
            },
          })}
        >
          <option value="">Select a customer</option>
          {demoCustomers.map((customer) => (
            <option key={customer.id} value={customer.id}>
              {customer.name}
            </option>
          ))}
        </select>
      </Field>
      <Field label="Source quote" error={form.formState.errors.quoteId?.message}>
        <select
          className={fieldClass}
          {...form.register("quoteId", {
            onChange: (event) => {
              const quote = demoQuotes.find((item) => item.id === event.target.value);

              if (!quote) {
                return;
              }

              form.setValue("orderType", quote.quoteType);
              form.setValue("product", quote.lineItems[0]?.product ?? quote.opportunityName);
              form.setValue("value", String(quote.total));
            },
          })}
        >
          <option value="">No linked quote</option>
          {quotes.map((quote) => (
            <option key={quote.id} value={quote.id}>
              {quote.quoteNumber} · {quote.opportunityName}
            </option>
          ))}
        </select>
      </Field>
      <div className="grid gap-3 sm:grid-cols-2">
        <Field label="Order type" error={form.formState.errors.orderType?.message}>
          <select className={fieldClass} {...form.register("orderType")}>
            {ORDER_TYPES.map((type) => (
              <option key={type} value={type}>
                {ORDER_TYPE_LABEL[type]}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Priority" error={form.formState.errors.priority?.message}>
          <select className={fieldClass} {...form.register("priority")}>
            {ORDER_PRIORITIES.map((priority) => (
              <option key={priority} value={priority}>
                {ORDER_PRIORITY_LABEL[priority]}
              </option>
            ))}
          </select>
        </Field>
      </div>
      <Field label="Product / solution" error={form.formState.errors.product?.message}>
        <Input {...form.register("product")} />
      </Field>
      <div className="grid gap-3 sm:grid-cols-2">
        <Field label="Order value (R)" error={form.formState.errors.value?.message}>
          <Input inputMode="decimal" {...form.register("value")} />
        </Field>
        <Field label="Target activation" error={form.formState.errors.targetActivation?.message}>
          <Input type="date" {...form.register("targetActivation")} />
        </Field>
      </div>
      <Field label="Notes">
        <textarea className={`${fieldClass} h-20 py-2`} {...form.register("notes")} />
      </Field>
      <div className="flex justify-end">
        <Button type="submit">Create Order</Button>
      </div>
    </form>
  );
}

export function OrderEditForm({
  order,
  onSubmit,
}: {
  order: OrderRecord;
  onSubmit: (values: EditValues) => void;
}) {
  const form = useForm<EditValues>({
    resolver: zodResolver(editSchema),
    defaultValues: {
      product: order.product,
      priority: order.priority,
      value: String(order.value),
      targetActivation: order.targetActivation,
      notes: order.notes,
    },
  });

  return (
    <form className="flex flex-col gap-3" onSubmit={form.handleSubmit(onSubmit)}>
      <Field label="Product / solution" error={form.formState.errors.product?.message}>
        <Input {...form.register("product")} />
      </Field>
      <div className="grid gap-3 sm:grid-cols-2">
        <Field label="Priority" error={form.formState.errors.priority?.message}>
          <select className={fieldClass} {...form.register("priority")}>
            {ORDER_PRIORITIES.map((priority) => (
              <option key={priority} value={priority}>
                {ORDER_PRIORITY_LABEL[priority]}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Order value (R)" error={form.formState.errors.value?.message}>
          <Input inputMode="decimal" {...form.register("value")} />
        </Field>
      </div>
      <Field label="Target activation" error={form.formState.errors.targetActivation?.message}>
        <Input type="date" {...form.register("targetActivation")} />
      </Field>
      <Field label="Notes">
        <textarea className={`${fieldClass} h-20 py-2`} {...form.register("notes")} />
      </Field>
      <div className="flex justify-end">
        <Button type="submit">Save Order</Button>
      </div>
    </form>
  );
}

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <Label>{label}</Label>
      {children}
      {error ? <p className="text-xs text-destructive">{error}</p> : null}
    </div>
  );
}

export type { CreateValues, EditValues, OrderPriority, OrderType };
