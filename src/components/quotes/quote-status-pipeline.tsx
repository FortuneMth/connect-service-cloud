import { cn } from "cn";

import { QUOTE_STATUS_LABEL, formatRand, quotePipeline, type QuoteStatus } from "@/data/quotes";

export function QuoteStatusPipeline({
  activeStatus,
  onSelect,
}: {
  activeStatus: QuoteStatus | "ALL";
  onSelect: (status: QuoteStatus | "ALL") => void;
}) {
  return (
    <section className="min-w-0">
      <div className="mb-2 flex items-baseline justify-between gap-3">
        <h2 className="text-sm font-medium">Quote status</h2>
        <p className="text-xs text-muted-foreground">Portfolio snapshot</p>
      </div>
      <div className="flex min-w-0 flex-col gap-2 sm:flex-row sm:overflow-x-auto sm:pb-1">
        {quotePipeline.map((stage) => {
          const selected = activeStatus === stage.status;

          return (
            <button
              key={stage.status}
              type="button"
              aria-pressed={selected}
              onClick={() => onSelect(selected ? "ALL" : stage.status)}
              className={cn(
                "rounded-lg border bg-card px-3 py-2.5 text-left sm:w-40 sm:shrink-0",
                selected ? "border-foreground" : "hover:bg-muted/40",
              )}
            >
              <p className="text-xs text-muted-foreground">{QUOTE_STATUS_LABEL[stage.status]}</p>
              <p className="mt-1 text-lg font-semibold tabular-nums">{stage.count}</p>
              <p className="text-xs text-muted-foreground tabular-nums">{formatRand(stage.value)}</p>
            </button>
          );
        })}
      </div>
    </section>
  );
}
