import type { LucideIcon } from "lucide-react";
import {
  Cable,
  ClipboardList,
  Receipt,
  Route,
  Wrench,
} from "lucide-react";
import { cn } from "cn";

import type { DashboardKpi as DashboardKpiData } from "@/data/operations-dashboard";

const kpiIcons: Record<string, LucideIcon> = {
  "active-orders": ClipboardList,
  "orders-in-delivery": Route,
  "installations-this-week": Wrench,
  "services-activated": Cable,
  mrr: Receipt,
};

const contextToneClass = {
  neutral: "text-muted-foreground",
  positive: "text-emerald-700 dark:text-emerald-400",
  attention: "text-amber-700 dark:text-amber-400",
} as const;

export function DashboardKpi({ kpi }: { kpi: DashboardKpiData }) {
  const Icon = kpiIcons[kpi.id] ?? ClipboardList;

  return (
    <article className="rounded-lg border bg-card px-4 py-3">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-xs font-medium text-muted-foreground">{kpi.label}</h2>
        <Icon className="size-3.5 text-muted-foreground" aria-hidden />
      </div>
      <p className="mt-2 text-2xl font-semibold tracking-tight tabular-nums">{kpi.value}</p>
      <p className={cn("mt-1 text-xs", contextToneClass[kpi.contextTone])}>{kpi.context}</p>
    </article>
  );
}
