import { cn } from "cn";

import { ORDER_STATUS_LABEL, formatRand, orderPipeline, type OrderStatus } from "@/data/orders";

export function OrderPipeline({
  activeStatus,
  onSelect,
}: {
  activeStatus: OrderStatus | "ALL";
  onSelect: (status: OrderStatus | "ALL") => void;
}) {
  return (
    <section className="min-w-0">
      <div className="mb-2 flex items-baseline justify-between gap-3">
        <h2 className="text-sm font-medium">Order lifecycle</h2>
        <p className="text-xs text-muted-foreground">Portfolio snapshot</p>
      </div>
      <div className="flex min-w-0 flex-col gap-2 sm:flex-row sm:overflow-x-auto sm:pb-1">
        {orderPipeline.map((stage) => {
          const selected = activeStatus === stage.status;
          const completed = stage.status === "COMPLETED";

          return (
            <button
              key={stage.status}
              type="button"
              aria-pressed={selected}
              onClick={() => onSelect(selected ? "ALL" : stage.status)}
              className={cn(
                "rounded-lg border px-3 py-2.5 text-left sm:w-36 sm:shrink-0",
                completed ? "bg-muted/40 text-muted-foreground" : "bg-card",
                selected ? "border-foreground" : "hover:bg-muted/60",
              )}
            >
              <p className="text-xs text-muted-foreground">{ORDER_STATUS_LABEL[stage.status]}</p>
              <p className={cn("mt-1 text-lg font-semibold tabular-nums", completed && "font-medium")}>
                {stage.count}
              </p>
              <p className="text-xs text-muted-foreground tabular-nums">{formatRand(stage.value)}</p>
            </button>
          );
        })}
      </div>
    </section>
  );
}
