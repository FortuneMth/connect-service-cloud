"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState, type ReactNode } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { usePortalDelivery } from "@/components/portal/portal-delivery-store";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  CONTACT_PREFERENCES,
  ESCALATION_REASONS,
  type PortalEscalation,
} from "@/data/portal";

const fieldClass =
  "h-8 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50";

const areaClass =
  "h-24 w-full rounded-lg border border-input bg-transparent px-2.5 py-2 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50";

const schema = z.object({
  reason: z.enum(ESCALATION_REASONS, { message: "Select a reason" }),
  message: z.string().min(8, "Please describe the issue"),
  contactPreference: z.enum(CONTACT_PREFERENCES, { message: "Select a preference" }),
});

type FormValues = z.infer<typeof schema>;

export function EscalationDialog({
  open,
  orderId,
  onOpenChange,
  onSubmitted,
}: {
  open: boolean;
  orderId: string;
  onOpenChange: (open: boolean) => void;
  onSubmitted: (escalation: PortalEscalation) => void;
}) {
  const { submitEscalation } = usePortalDelivery();
  const [submitted, setSubmitted] = useState<PortalEscalation | null>(null);
  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      reason: "No progress / no update",
      message: "",
      contactPreference: "Either",
    },
  });

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        if (!next) {
          setSubmitted(null);
          form.reset();
        }
        onOpenChange(next);
      }}
    >
      <DialogContent className="max-h-[min(44rem,calc(100%-2rem))] w-[min(42rem,calc(100%-2rem))] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{submitted ? "Escalation submitted" : "Request Escalation"}</DialogTitle>
          <DialogDescription>
            {submitted
              ? "Our delivery team has been notified and will respond within the expected window."
              : "Tell us what has stopped progressing and we will prioritise a response."}
          </DialogDescription>
        </DialogHeader>
        {submitted ? (
          <div className="flex flex-col gap-3">
            <dl className="grid gap-2 rounded-lg border px-3 py-3 text-sm sm:grid-cols-2">
              <div>
                <dt className="text-xs text-muted-foreground">Reference</dt>
                <dd className="font-mono font-medium">{submitted.reference}</dd>
              </div>
              <div>
                <dt className="text-xs text-muted-foreground">Priority</dt>
                <dd>High</dd>
              </div>
              <div>
                <dt className="text-xs text-muted-foreground">Assigned to</dt>
                <dd>{submitted.assignedTo}</dd>
              </div>
              <div>
                <dt className="text-xs text-muted-foreground">Expected response</dt>
                <dd>{submitted.expectedResponse}</dd>
              </div>
              <div>
                <dt className="text-xs text-muted-foreground">Status</dt>
                <dd>Open</dd>
              </div>
            </dl>
            <div className="flex flex-wrap justify-end gap-2">
              <Button
                type="button"
                size="sm"
                onClick={() => {
                  onSubmitted(submitted);
                  onOpenChange(false);
                  setSubmitted(null);
                  form.reset();
                }}
              >
                View Escalation
              </Button>
            </div>
          </div>
        ) : (
          <form
            className="flex flex-col gap-3"
            onSubmit={form.handleSubmit((values) => {
              const created = submitEscalation({
                orderId,
                reason: values.reason,
                message: values.message,
                contactPreference: values.contactPreference,
              });
              setSubmitted(created);
            })}
          >
            <Field label="Reason" error={form.formState.errors.reason?.message}>
              <select className={fieldClass} {...form.register("reason")}>
                {ESCALATION_REASONS.map((reason) => (
                  <option key={reason} value={reason}>{reason}</option>
                ))}
              </select>
            </Field>
            <Field label="Message" error={form.formState.errors.message?.message}>
              <textarea className={areaClass} {...form.register("message")} placeholder="Describe what has stopped progressing" />
            </Field>
            <Field label="Contact preference" error={form.formState.errors.contactPreference?.message}>
              <select className={fieldClass} {...form.register("contactPreference")}>
                {CONTACT_PREFERENCES.map((preference) => (
                  <option key={preference} value={preference}>{preference}</option>
                ))}
              </select>
            </Field>
            <div className="flex justify-end">
              <Button type="submit" size="sm">Submit Escalation</Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
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
