import { cn } from "cn";

import {
  DELIVERY_HEALTH_COPY,
  DELIVERY_HEALTH_LABEL,
  deliveryHealthTone,
  type DeliveryHealth,
} from "@/data/portal";

const toneClass = {
  success: "border-emerald-200 bg-emerald-50 text-emerald-900 dark:border-emerald-900/50 dark:bg-emerald-950/40 dark:text-emerald-100",
  warning: "border-amber-200 bg-amber-50 text-amber-950 dark:border-amber-900/50 dark:bg-amber-950/40 dark:text-amber-100",
  danger: "border-red-200 bg-red-50 text-red-950 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-100",
  neutral: "border-border bg-muted/40 text-foreground",
} as const;

const dotClass = {
  success: "bg-emerald-600",
  warning: "bg-amber-500",
  danger: "bg-red-600",
  neutral: "bg-zinc-400",
} as const;

export function DeliveryHealthCard({
  health,
  compact = false,
}: {
  health: DeliveryHealth;
  compact?: boolean;
}) {
  const tone = deliveryHealthTone(health);

  return (
    <div className={cn("rounded-lg border px-4 py-3", toneClass[tone])}>
      <div className="flex items-center gap-2">
        <span className={cn("size-2 rounded-full", dotClass[tone])} aria-hidden />
        <p className="text-sm font-semibold tracking-wide uppercase">{DELIVERY_HEALTH_LABEL[health]}</p>
      </div>
      {compact ? null : <p className="mt-1.5 text-sm opacity-90">{DELIVERY_HEALTH_COPY[health]}</p>}
    </div>
  );
}

export function DeliveryHealthBadge({ health }: { health: DeliveryHealth }) {
  const tone = deliveryHealthTone(health);

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-md border px-2 py-0.5 text-xs font-medium",
        toneClass[tone],
      )}
    >
      <span className={cn("size-1.5 rounded-full", dotClass[tone])} aria-hidden />
      {DELIVERY_HEALTH_LABEL[health]}
    </span>
  );
}
