"use client";

import type { ReactNode } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import type { OpportunityDraft } from "@/components/sales/opportunity-store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  OPPORTUNITY_TYPE_LABEL,
  SALES_OWNERS,
  salesCustomers,
  type OpportunityType,
} from "@/data/sales";

const opportunityTypes = Object.keys(OPPORTUNITY_TYPE_LABEL) as [OpportunityType, ...OpportunityType[]];

function amount(value: string) {
  const normalised = value.trim().replace(/[R\s,]/g, "");

  if (!/^\d+(\.\d+)?$/.test(normalised)) {
    return Number.NaN;
  }

  return Number(normalised);
}

const opportunitySchema = z.object({
  name: z.string().trim().min(2, "Enter the opportunity name."),
  customerId: z.string().trim().min(1, "Select a customer."),
  type: z.enum(opportunityTypes, { message: "Select an opportunity type." }),
  solution: z.string().trim().min(2, "Enter the solution."),
  estimatedMrr: z.string().trim().refine((value) => amount(value) >= 0, "Enter the estimated MRR."),
  estimatedNrc: z.string().trim().refine((value) => amount(value) >= 0, "Enter the estimated NRC."),
  contractTermMonths: z
    .string()
    .trim()
    .refine((value) => /^\d+$/.test(value) && Number(value) >= 1 && Number(value) <= 120, "Enter a contract term in months."),
  probability: z
    .string()
    .trim()
    .refine(
      (value) => /^\d+$/.test(value) && Number(value) >= 0 && Number(value) <= 100,
      "Enter a probability from 0 to 100.",
    ),
  expectedClose: z.string().trim().min(1, "Select an expected close date."),
  ownerName: z.string().trim().min(2, "Select an owner."),
  notes: z.string(),
});

const fieldClass =
  "h-8 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50";

export function OpportunityForm({
  initial,
  submitLabel,
  onSubmit,
  onCancel,
}: {
  initial?: OpportunityDraft;
  submitLabel: string;
  onSubmit: (values: OpportunityDraft) => void;
  onCancel: () => void;
}) {
  const form = useForm<OpportunityDraft>({
    resolver: zodResolver(opportunitySchema),
    defaultValues: initial ?? {
      name: "",
      customerId: "",
      type: "ENTERPRISE",
      solution: "",
      estimatedMrr: "",
      estimatedNrc: "",
      contractTermMonths: "36",
      probability: "",
      expectedClose: "",
      ownerName: SALES_OWNERS[0].name,
      notes: "",
    },
  });

  return (
    <form className="grid gap-3 sm:grid-cols-2" onSubmit={form.handleSubmit(onSubmit)} noValidate>
      <Field label="Opportunity Name" error={form.formState.errors.name?.message} className="sm:col-span-2">
        <Input aria-invalid={Boolean(form.formState.errors.name)} {...form.register("name")} />
      </Field>
      <Field label="Customer" error={form.formState.errors.customerId?.message}>
        <select
          className={fieldClass}
          aria-invalid={Boolean(form.formState.errors.customerId)}
          {...form.register("customerId", {
            onChange: (event) => {
              const match = salesCustomers.find((customer) => customer.id === event.target.value);
              if (match) {
                form.setValue("type", match.type);
              }
            },
          })}
        >
          <option value="">Select a customer</option>
          {salesCustomers.map((customer) => (
            <option key={customer.id} value={customer.id}>
              {customer.name}
            </option>
          ))}
        </select>
      </Field>
      <Field label="Opportunity Type" error={form.formState.errors.type?.message}>
        <select className={fieldClass} aria-invalid={Boolean(form.formState.errors.type)} {...form.register("type")}>
          {opportunityTypes.map((type) => (
            <option key={type} value={type}>
              {OPPORTUNITY_TYPE_LABEL[type]}
            </option>
          ))}
        </select>
      </Field>
      <Field label="Solution" error={form.formState.errors.solution?.message} className="sm:col-span-2">
        <Input aria-invalid={Boolean(form.formState.errors.solution)} {...form.register("solution")} />
      </Field>
      <Field label="Estimated MRR" error={form.formState.errors.estimatedMrr?.message}>
        <Input
          inputMode="decimal"
          aria-invalid={Boolean(form.formState.errors.estimatedMrr)}
          {...form.register("estimatedMrr")}
        />
      </Field>
      <Field label="Estimated NRC" error={form.formState.errors.estimatedNrc?.message}>
        <Input
          inputMode="decimal"
          aria-invalid={Boolean(form.formState.errors.estimatedNrc)}
          {...form.register("estimatedNrc")}
        />
      </Field>
      <Field label="Contract Term" error={form.formState.errors.contractTermMonths?.message}>
        <Input
          inputMode="numeric"
          aria-invalid={Boolean(form.formState.errors.contractTermMonths)}
          {...form.register("contractTermMonths")}
        />
      </Field>
      <Field label="Probability" error={form.formState.errors.probability?.message}>
        <Input
          inputMode="numeric"
          aria-invalid={Boolean(form.formState.errors.probability)}
          {...form.register("probability")}
        />
      </Field>
      <Field label="Expected Close" error={form.formState.errors.expectedClose?.message}>
        <Input
          type="date"
          aria-invalid={Boolean(form.formState.errors.expectedClose)}
          {...form.register("expectedClose")}
        />
      </Field>
      <Field label="Owner" error={form.formState.errors.ownerName?.message}>
        <select
          className={fieldClass}
          aria-invalid={Boolean(form.formState.errors.ownerName)}
          {...form.register("ownerName")}
        >
          {SALES_OWNERS.map((owner) => (
            <option key={owner.id} value={owner.name}>
              {owner.name}
            </option>
          ))}
        </select>
      </Field>
      <Field label="Notes" error={form.formState.errors.notes?.message} className="sm:col-span-2">
        <textarea className={`${fieldClass} h-20 py-2`} {...form.register("notes")} />
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
