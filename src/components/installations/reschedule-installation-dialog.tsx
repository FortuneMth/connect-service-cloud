"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RESCHEDULE_REASONS } from "@/data/installations";

const fieldClass =
  "h-8 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50";

const schema = z.object({
  scheduledDate: z.string().min(1, "Enter a date"),
  scheduledTime: z.string().min(1, "Enter a time"),
  reason: z.enum(RESCHEDULE_REASONS, { message: "Select a reason" }),
});

type RescheduleValues = z.infer<typeof schema>;

export function RescheduleInstallationDialog({
  date,
  time,
  onSubmit,
}: {
  date: string;
  time: string;
  onSubmit: (values: RescheduleValues) => void;
}) {
  const [saved, setSaved] = useState(false);
  const form = useForm<RescheduleValues>({
    resolver: zodResolver(schema),
    defaultValues: { scheduledDate: date, scheduledTime: time, reason: "Customer unavailable" },
  });

  return (
    <form
      className="flex flex-col gap-3"
      onSubmit={form.handleSubmit((values) => {
        onSubmit(values);
        setSaved(true);
      })}
    >
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <Label>New Date</Label>
          <Input type="date" {...form.register("scheduledDate")} />
          {form.formState.errors.scheduledDate ? <p className="text-xs text-destructive">{form.formState.errors.scheduledDate.message}</p> : null}
        </div>
        <div className="flex flex-col gap-1.5">
          <Label>New Time</Label>
          <Input type="time" {...form.register("scheduledTime")} />
          {form.formState.errors.scheduledTime ? <p className="text-xs text-destructive">{form.formState.errors.scheduledTime.message}</p> : null}
        </div>
      </div>
      <div className="flex flex-col gap-1.5">
        <Label>Reason</Label>
        <select className={fieldClass} {...form.register("reason")}>
          {RESCHEDULE_REASONS.map((reason) => (
            <option key={reason} value={reason}>{reason}</option>
          ))}
        </select>
      </div>
      {saved ? <p className="text-sm text-emerald-700 dark:text-emerald-400">Installation rescheduled.</p> : null}
      <div className="flex flex-wrap justify-end gap-2">
        <Button type="submit" size="sm">Save schedule</Button>
      </div>
    </form>
  );
}
