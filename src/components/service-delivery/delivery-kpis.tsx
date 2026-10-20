import { CalendarClock, ClipboardList, SearchCheck, TriangleAlert } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { cn } from "cn";

import { deliveryKpis } from "@/data/service-delivery";

const icons: Record<string, LucideIcon> = {
  delivery: ClipboardList,
  feasibility: SearchCheck,
  installs: CalendarClock,
  risk: TriangleAlert,
};

const tones = {
  neutral: "text-muted-foreground",
  attention: "text-amber-700 dark:text-amber-400",
  positive: "text-emerald-700 dark:text-emerald-400",
} as const;

export function DeliveryKpis() {
  return (
    <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
      {deliveryKpis.map((kpi) => {
        const Icon = icons[kpi.id] ?? ClipboardList;

        return (
          <article key={kpi.id} className="rounded-lg border bg-card px-4 py-3">
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-xs font-medium text-muted-foreground">{kpi.label}</h2>
              <Icon className="size-3.5 text-muted-foreground" aria-hidden />
            </div>
            <p className="mt-2 text-2xl font-semibold tracking-tight tabular-nums">{kpi.value}</p>
            <p className={cn("mt-1 text-xs", tones[kpi.tone])}>{kpi.supporting}</p>
          </article>
        );
      })}
    </section>
  );
}
