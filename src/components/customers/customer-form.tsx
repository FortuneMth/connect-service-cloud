"use client";

import type { ReactNode } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ACCOUNT_OWNERS, CUSTOMER_TYPE_LABEL, PAYMENT_TERMS, type CustomerType } from "@/data/customers";
import type { CustomerDraft } from "@/components/customers/customer-store";

const customerTypes = Object.keys(CUSTOMER_TYPE_LABEL) as [CustomerType, ...CustomerType[]];

const customerSchema = z.object({
  name: z.string().trim().min(2, "Enter the company name."),
  type: z.enum(customerTypes, { message: "Select a customer type." }),
  industry: z.string().trim().min(2, "Enter the industry."),
  primaryContactName: z.string().trim().min(2, "Enter the primary contact."),
  email: z.string().trim().email("Enter a valid email address."),
  phone: z.string().trim().min(7, "Enter a phone number."),
  billingContactName: z.string().trim().min(2, "Enter the billing contact."),
  paymentTerms: z.string().trim().min(2, "Select payment terms."),
  accountOwnerName: z.string().trim().min(2, "Select an account owner."),
});

const fieldClass =
  "h-8 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50";

export function CustomerForm({
  initial,
  submitLabel,
  onSubmit,
  onCancel,
}: {
  initial?: CustomerDraft;
  submitLabel: string;
  onSubmit: (values: CustomerDraft) => void;
  onCancel: () => void;
}) {
  const form = useForm<CustomerDraft>({
    resolver: zodResolver(customerSchema),
    defaultValues: initial ?? {
      name: "",
      type: "ENTERPRISE",
      industry: "",
      primaryContactName: "",
      email: "",
      phone: "",
      billingContactName: "",
      paymentTerms: "Net 30",
      accountOwnerName: ACCOUNT_OWNERS[0].name,
    },
  });

  return (
    <form className="grid gap-3 sm:grid-cols-2" onSubmit={form.handleSubmit(onSubmit)} noValidate>
      <Field label="Company Name" error={form.formState.errors.name?.message} className="sm:col-span-2">
        <Input aria-invalid={Boolean(form.formState.errors.name)} {...form.register("name")} />
      </Field>
      <Field label="Customer Type" error={form.formState.errors.type?.message}>
        <select className={fieldClass} aria-invalid={Boolean(form.formState.errors.type)} {...form.register("type")}>
          {customerTypes.map((type) => (
            <option key={type} value={type}>
              {CUSTOMER_TYPE_LABEL[type]}
            </option>
          ))}
        </select>
      </Field>
      <Field label="Industry" error={form.formState.errors.industry?.message}>
        <Input aria-invalid={Boolean(form.formState.errors.industry)} {...form.register("industry")} />
      </Field>
      <Field label="Primary Contact" error={form.formState.errors.primaryContactName?.message}>
        <Input
          aria-invalid={Boolean(form.formState.errors.primaryContactName)}
          {...form.register("primaryContactName")}
        />
      </Field>
      <Field label="Email" error={form.formState.errors.email?.message}>
        <Input type="email" aria-invalid={Boolean(form.formState.errors.email)} {...form.register("email")} />
      </Field>
      <Field label="Phone" error={form.formState.errors.phone?.message}>
        <Input aria-invalid={Boolean(form.formState.errors.phone)} {...form.register("phone")} />
      </Field>
      <Field label="Billing Contact" error={form.formState.errors.billingContactName?.message}>
        <Input
          aria-invalid={Boolean(form.formState.errors.billingContactName)}
          {...form.register("billingContactName")}
        />
      </Field>
      <Field label="Payment Terms" error={form.formState.errors.paymentTerms?.message}>
        <select
          className={fieldClass}
          aria-invalid={Boolean(form.formState.errors.paymentTerms)}
          {...form.register("paymentTerms")}
        >
          {PAYMENT_TERMS.map((terms) => (
            <option key={terms} value={terms}>
              {terms}
            </option>
          ))}
        </select>
      </Field>
      <Field label="Account Owner" error={form.formState.errors.accountOwnerName?.message}>
        <select
          className={fieldClass}
          aria-invalid={Boolean(form.formState.errors.accountOwnerName)}
          {...form.register("accountOwnerName")}
        >
          {ACCOUNT_OWNERS.map((owner) => (
            <option key={owner.id} value={owner.name}>
              {owner.name}
            </option>
          ))}
        </select>
      </Field>
      <div className="flex justify-end gap-2 sm:col-span-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">{submitLabel}</Button>
      </div>
    </form>
  );
}

function Field({
  label,
  error,
  className,
  children,
}: {
  label: string;
  error?: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <div className={className}>
      <Label className="mb-1.5">{label}</Label>
      {children}
      {error ? <p className="mt-1 text-xs text-destructive">{error}</p> : null}
    </div>
  );
}
