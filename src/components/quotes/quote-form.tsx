"use client";

import { useMemo, type ReactNode } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";
import { Plus, Trash2 } from "lucide-react";

import { emptyLine, type QuoteDraft, type QuoteLineDraft } from "@/components/quotes/quote-store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  QUOTE_TYPE_LABEL,
  formatRand,
  quoteCustomers,
  quoteOpportunities,
  summariseLines,
  type QuoteType,
} from "@/data/quotes";

const quoteTypes = Object.keys(QUOTE_TYPE_LABEL) as [QuoteType, ...QuoteType[]];

function amount(value: string) {
  const normalised = value.trim().replace(/[R\s,]/g, "");

  if (!/^\d+(\.\d+)?$/.test(normalised)) {
    return Number.NaN;
  }

  return Number(normalised);
}

const lineSchema = z.object({
  product: z.string().trim().min(2, "Enter the product or service."),
  description: z.string(),
  site: z.string().trim().min(2, "Enter the site."),
  quantity: z.string().trim().refine((value) => /^\d+$/.test(value) && Number(value) >= 1, "Enter a quantity."),
  unit: z.string().trim().min(1, "Enter the unit."),
  monthlyPrice: z.string().trim().refine((value) => amount(value) >= 0, "Enter the monthly price."),
  onceOffPrice: z.string().trim().refine((value) => amount(value) >= 0, "Enter the once-off price."),
});

const quoteSchema = z.object({
  customerId: z.string().trim().min(1, "Select a customer."),
  opportunityId: z.string().trim().min(1, "Select an opportunity."),
  primaryContactName: z.string().trim().min(2, "Enter the primary contact."),
  quoteType: z.enum(quoteTypes, { message: "Select a quote type." }),
  contractTerm: z
    .string()
    .trim()
    .refine((value) => /^\d+$/.test(value) && Number(value) >= 1 && Number(value) <= 120, "Enter a contract term in months."),
  paymentTerms: z.string().trim().min(2, "Enter the payment terms."),
  billingFrequency: z.string().trim().min(2, "Enter the billing frequency."),
  validUntil: z.string().trim().min(1, "Select a validity date."),
  installationLeadTime: z.string().trim().min(2, "Enter the installation lead time."),
  sla: z.string().trim().min(2, "Enter the SLA."),
  cancellationTerms: z.string().trim().min(2, "Enter the cancellation terms."),
  pricingNotes: z.string(),
  lineItems: z.array(lineSchema).min(1, "Add at least one line item."),
});

const fieldClass =
  "h-8 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50";

const areaClass =
  "min-h-20 w-full rounded-lg border border-input bg-transparent px-2.5 py-2 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50";

const blank: QuoteDraft = {
  customerId: "",
  opportunityId: "",
  primaryContactName: "",
  quoteType: "ENTERPRISE",
  contractTerm: "36",
  paymentTerms: "30 days",
  billingFrequency: "Monthly in advance",
  validUntil: "2026-11-14",
  installationLeadTime: "15 business days after order acceptance and site readiness",
  sla: "99.5% service availability",
  cancellationTerms: "Early cancellation is billed for the remaining committed months.",
  pricingNotes: "",
  lineItems: [emptyLine()],
};

export function QuoteForm({
  initial,
  submitLabel,
  onSubmit,
  onCancel,
}: {
  initial?: QuoteDraft;
  submitLabel: string;
  onSubmit: (values: QuoteDraft) => void;
  onCancel: () => void;
}) {
  const form = useForm<QuoteDraft>({
    resolver: zodResolver(quoteSchema),
    defaultValues: initial ?? blank,
  });
  const lines = useFieldArray({ control: form.control, name: "lineItems" });
  const customerId = form.watch("customerId");
  const watchedLines = form.watch("lineItems");
  const term = form.watch("contractTerm");
  const opportunities = quoteOpportunities.filter((opportunity) => opportunity.customerId === customerId);
  const totals = useMemo(() => {
    const items = (watchedLines ?? []).map((item) => ({
      quantity: /^\d+$/.test(item.quantity) ? Number(item.quantity) : 0,
      monthlyPrice: amount(item.monthlyPrice || "0"),
      onceOffPrice: amount(item.onceOffPrice || "0"),
    }));
    const months = /^\d+$/.test(term) ? Number(term) : 0;
    return summariseLines(
      items.map((item) => ({
        quantity: item.quantity,
        monthlyPrice: Number.isNaN(item.monthlyPrice) ? 0 : item.monthlyPrice,
        onceOffPrice: Number.isNaN(item.onceOffPrice) ? 0 : item.onceOffPrice,
      })),
      months,
    );
  }, [watchedLines, term]);

  return (
    <form className="grid gap-4" onSubmit={form.handleSubmit(onSubmit)} noValidate>
      <section className="grid gap-3 sm:grid-cols-2">
        <h3 className="text-sm font-medium sm:col-span-2">Customer</h3>
        <Field label="Customer" error={form.formState.errors.customerId?.message}>
          <select
            className={fieldClass}
            aria-invalid={Boolean(form.formState.errors.customerId)}
            {...form.register("customerId", {
              onChange: (event) => {
                const customer = quoteCustomers.find((item) => item.id === event.target.value);
                if (customer) {
                  form.setValue("primaryContactName", customer.primaryContactName);
                  form.setValue("quoteType", customer.type);
                }
                const current = form.getValues("opportunityId");
                const match = quoteOpportunities.find((item) => item.id === current);
                if (match && match.customerId !== event.target.value) {
                  form.setValue("opportunityId", "");
                }
              },
            })}
          >
            <option value="">Select a customer</option>
            {quoteCustomers.map((customer) => (
              <option key={customer.id} value={customer.id}>
                {customer.name}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Primary contact" error={form.formState.errors.primaryContactName?.message}>
          <Input aria-invalid={Boolean(form.formState.errors.primaryContactName)} {...form.register("primaryContactName")} />
        </Field>
        <Field label="Opportunity" error={form.formState.errors.opportunityId?.message} className="sm:col-span-2">
          <select className={fieldClass} aria-invalid={Boolean(form.formState.errors.opportunityId)} {...form.register("opportunityId")}>
            <option value="">{customerId ? "Select an opportunity" : "Select a customer first"}</option>
            {opportunities.map((opportunity) => (
              <option key={opportunity.id} value={opportunity.id}>
                {opportunity.opportunityNumber} · {opportunity.name}
              </option>
            ))}
          </select>
        </Field>
      </section>

      <section className="grid gap-3 sm:grid-cols-2">
        <h3 className="text-sm font-medium sm:col-span-2">Commercial</h3>
        <Field label="Quote type" error={form.formState.errors.quoteType?.message}>
          <select className={fieldClass} {...form.register("quoteType")}>
            {quoteTypes.map((type) => (
              <option key={type} value={type}>
                {QUOTE_TYPE_LABEL[type]}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Contract term (months)" error={form.formState.errors.contractTerm?.message}>
          <Input inputMode="numeric" aria-invalid={Boolean(form.formState.errors.contractTerm)} {...form.register("contractTerm")} />
        </Field>
        <Field label="Payment terms" error={form.formState.errors.paymentTerms?.message}>
          <select className={fieldClass} {...form.register("paymentTerms")}>
            <option>30 days</option>
            <option>45 days</option>
            <option>60 days</option>
          </select>
        </Field>
        <Field label="Billing frequency" error={form.formState.errors.billingFrequency?.message}>
          <select className={fieldClass} {...form.register("billingFrequency")}>
            <option>Monthly in advance</option>
            <option>Monthly in arrears</option>
            <option>Quarterly in advance</option>
          </select>
        </Field>
        <Field label="Valid until" error={form.formState.errors.validUntil?.message}>
          <Input type="date" aria-invalid={Boolean(form.formState.errors.validUntil)} {...form.register("validUntil")} />
        </Field>
      </section>

      <section className="grid gap-3">
        <div className="flex items-center justify-between gap-3">
          <h3 className="text-sm font-medium">Line items</h3>
          <Button type="button" variant="outline" size="sm" onClick={() => lines.append(emptyLine())}>
            <Plus />
            Add line item
          </Button>
        </div>
        {typeof form.formState.errors.lineItems?.message === "string" ? (
          <p className="text-xs text-destructive">{form.formState.errors.lineItems.message}</p>
        ) : null}
        <div className="grid gap-3">
          {lines.fields.map((field, index) => (
            <LineEditor
              key={field.id}
              index={index}
              register={form.register}
              errors={form.formState.errors.lineItems?.[index]}
              canRemove={lines.fields.length > 1}
              onRemove={() => lines.remove(index)}
            />
          ))}
        </div>
        <dl className="grid gap-2 rounded-lg border bg-muted/30 px-3 py-3 text-sm sm:grid-cols-2">
          <Total label="Monthly subtotal" value={formatRand(totals.mrr)} />
          <Total label="Once-off subtotal" value={formatRand(totals.nrc)} />
          <Total label="VAT (15%)" value={formatRand(totals.vat)} />
          <Total label="Total contract value" value={formatRand(totals.subtotal)} />
        </dl>
        <p className="text-xs text-muted-foreground">
          Contract value is the monthly subtotal × term, plus the once-off subtotal, before VAT.
        </p>
      </section>

      <section className="grid gap-3">
        <h3 className="text-sm font-medium">Terms</h3>
        <Field label="Installation lead time" error={form.formState.errors.installationLeadTime?.message}>
          <Input aria-invalid={Boolean(form.formState.errors.installationLeadTime)} {...form.register("installationLeadTime")} />
        </Field>
        <Field label="SLA" error={form.formState.errors.sla?.message}>
          <Input aria-invalid={Boolean(form.formState.errors.sla)} {...form.register("sla")} />
        </Field>
        <Field label="Cancellation terms" error={form.formState.errors.cancellationTerms?.message}>
          <textarea className={areaClass} aria-invalid={Boolean(form.formState.errors.cancellationTerms)} {...form.register("cancellationTerms")} />
        </Field>
        <Field label="Pricing notes" error={form.formState.errors.pricingNotes?.message}>
          <textarea className={areaClass} {...form.register("pricingNotes")} />
        </Field>
      </section>

      <div className="flex flex-wrap justify-end gap-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">{submitLabel}</Button>
      </div>
    </form>
  );
}

function LineEditor({
  index,
  register,
  errors,
  canRemove,
  onRemove,
}: {
  index: number;
  register: ReturnType<typeof useForm<QuoteDraft>>["register"];
  errors?: Partial<Record<keyof QuoteLineDraft, { message?: string }>>;
  canRemove: boolean;
  onRemove: () => void;
}) {
  return (
    <div className="grid gap-2 rounded-lg border p-3">
      <div className="flex items-center justify-between gap-2">
        <p className="text-xs font-medium text-muted-foreground">Line {index + 1}</p>
        <Button type="button" variant="outline" size="sm" disabled={!canRemove} onClick={onRemove}>
          <Trash2 />
          Remove
        </Button>
      </div>
      <div className="grid gap-2 sm:grid-cols-2">
        <Field label="Product" error={errors?.product?.message}>
          <Input aria-invalid={Boolean(errors?.product)} {...register(`lineItems.${index}.product`)} />
        </Field>
        <Field label="Site" error={errors?.site?.message}>
          <Input aria-invalid={Boolean(errors?.site)} {...register(`lineItems.${index}.site`)} />
        </Field>
        <Field label="Description" error={errors?.description?.message} className="sm:col-span-2">
          <Input {...register(`lineItems.${index}.description`)} />
        </Field>
        <Field label="Quantity" error={errors?.quantity?.message}>
          <Input inputMode="numeric" aria-invalid={Boolean(errors?.quantity)} {...register(`lineItems.${index}.quantity`)} />
        </Field>
        <Field label="Unit" error={errors?.unit?.message}>
          <Input aria-invalid={Boolean(errors?.unit)} {...register(`lineItems.${index}.unit`)} />
        </Field>
        <Field label="Monthly price" error={errors?.monthlyPrice?.message}>
          <Input inputMode="decimal" aria-invalid={Boolean(errors?.monthlyPrice)} {...register(`lineItems.${index}.monthlyPrice`)} />
        </Field>
        <Field label="Once-off price" error={errors?.onceOffPrice?.message}>
          <Input inputMode="decimal" aria-invalid={Boolean(errors?.onceOffPrice)} {...register(`lineItems.${index}.onceOffPrice`)} />
        </Field>
      </div>
    </div>
  );
}

function Field({
  label,
  error,
  children,
  className,
}: {
  label: string;
  error?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={className}>
      <Label className="mb-1 text-xs">{label}</Label>
      {children}
      {error ? <p className="mt-1 text-xs text-destructive">{error}</p> : null}
    </div>
  );
}

function Total({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between gap-3">
      <dt className="text-muted-foreground">{label}</dt>
      <dd className="font-medium tabular-nums">{value}</dd>
    </div>
  );
}
