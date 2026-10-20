import { CalendarRange, CircleCheck, Scale, Waypoints } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { cn } from "cn";

import { salesKpis } from "@/data/sales";

const icons: Record<string, LucideIcon> = {
  pipeline: Waypoints,
  weighted: Scale,
  quarter: CalendarRange,
  won: CircleCheck,
};

const tones = {
  neutral: "text-muted-foreground",
  positive: "text-emerald-700 dark:text-emerald-400",
} as const;

export function SalesKpis() {
  return (
    <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
      {salesKpis.map((kpi) => {
        const Icon = icons[kpi.id] ?? Waypoints;

        return (
          <article key={kpi.id} className="rounded-lg border bg-card px-4 py-3">
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-xs font-medium text-muted-foreground">{kpi.label}</h2>
              <Icon className="size-3.5 text-muted-foreground" aria-hidden />
            </div>
            <p className="mt-2 text-2xl font-semibold tracking-tight tabular-nums">{kpi.value}</p>
            <p className={cn("mt-1 text-xs", tones[kpi.tone])}>{kpi.context}</p>
          </article>
        );
      })}
    </section>
  );
}
