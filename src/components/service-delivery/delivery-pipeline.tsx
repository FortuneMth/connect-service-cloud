import { cn } from "cn";

import { DELIVERY_STAGE_LABEL, deliveryPipeline, type DeliveryStage } from "@/data/service-delivery";

export function DeliveryPipeline({
  activeStage,
  onSelect,
}: {
  activeStage: DeliveryStage | "ALL";
  onSelect: (stage: DeliveryStage | "ALL") => void;
}) {
  return (
    <section className="min-w-0">
      <div className="mb-2 flex items-baseline justify-between gap-3">
        <h2 className="text-sm font-medium">Delivery lifecycle</h2>
        <p className="text-xs text-muted-foreground">Portfolio snapshot</p>
      </div>
      <div className="flex min-w-0 flex-col gap-2 sm:flex-row sm:overflow-x-auto sm:pb-1">
        {deliveryPipeline.map((stage) => {
          const selected = activeStage === stage.stage;

          return (
            <button
              key={stage.stage}
              type="button"
              aria-pressed={selected}
              onClick={() => onSelect(selected ? "ALL" : stage.stage)}
              className={cn(
                "rounded-lg border bg-card px-3 py-2.5 text-left sm:w-36 sm:shrink-0",
                selected ? "border-foreground" : "hover:bg-muted/40",
              )}
            >
              <p className="text-xs text-muted-foreground">{DELIVERY_STAGE_LABEL[stage.stage]}</p>
              <p className="mt-1 text-lg font-semibold tabular-nums">{stage.orders}</p>
              <p className="text-xs text-muted-foreground">
                {stage.attention > 0
                  ? `${stage.attention} blocked / at risk`
                  : `${stage.orders === 1 ? "order" : "orders"}`}
              </p>
            </button>
          );
        })}
      </div>
    </section>
  );
}
