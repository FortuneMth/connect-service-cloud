import { cn } from "cn";

import { OPPORTUNITY_STAGE_LABEL, salesPipeline, type OpportunityStage } from "@/data/sales";

export function SalesPipeline({
  activeStage,
  onSelect,
}: {
  activeStage: OpportunityStage | "ALL";
  onSelect: (stage: OpportunityStage | "ALL") => void;
}) {
  return (
    <section className="min-w-0">
      <div className="mb-2 flex items-baseline justify-between gap-3">
        <h2 className="text-sm font-medium">Pipeline</h2>
        <p className="text-xs text-muted-foreground">Portfolio snapshot</p>
      </div>
      <div className="flex min-w-0 flex-col gap-2 sm:flex-row sm:overflow-x-auto sm:pb-1">
        {salesPipeline.map((stage) => {
          const selected = activeStage === stage.stage;

          return (
            <button
              key={stage.stage}
              type="button"
              aria-pressed={selected}
              onClick={() => onSelect(selected ? "ALL" : stage.stage)}
              className={cn(
                "rounded-lg border bg-card px-3 py-2.5 text-left sm:w-40 sm:shrink-0",
                selected ? "border-foreground" : "hover:bg-muted/40",
              )}
            >
              <p className="text-xs text-muted-foreground">{OPPORTUNITY_STAGE_LABEL[stage.stage]}</p>
              <p className="mt-1 text-lg font-semibold tabular-nums">{stage.count}</p>
              <p className="text-xs text-muted-foreground tabular-nums">{stage.value}</p>
            </button>
          );
        })}
      </div>
    </section>
  );
}
