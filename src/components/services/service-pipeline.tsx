import { cn } from "cn";

import { SERVICE_STATUS_LABEL, servicePipeline, type ServiceStatus } from "@/data/services";

export function ServicePipeline({
  activeStatus,
  onSelect,
}: {
  activeStatus: ServiceStatus | "ALL";
  onSelect: (status: ServiceStatus | "ALL") => void;
}) {
  return (
    <section className="min-w-0">
      <div className="mb-2 flex items-baseline justify-between gap-3">
        <h2 className="text-sm font-medium">Service status</h2>
        <p className="text-xs text-muted-foreground">Portfolio snapshot</p>
      </div>
      <div className="flex min-w-0 flex-col gap-2 sm:flex-row sm:overflow-x-auto sm:pb-1">
        {servicePipeline.map((stage) => {
          const selected = activeStatus === stage.status;
          const quiet = stage.status === "CANCELLED";

          return (
            <button
              key={stage.status}
              type="button"
              aria-pressed={selected}
              onClick={() => onSelect(selected ? "ALL" : stage.status)}
              className={cn(
                "rounded-lg border px-3 py-2.5 text-left sm:w-36 sm:shrink-0",
                quiet ? "border-border bg-muted/40 text-muted-foreground" : "bg-card",
                selected ? "border-foreground" : "hover:bg-muted/40",
              )}
            >
              <p className="text-xs text-muted-foreground">{SERVICE_STATUS_LABEL[stage.status]}</p>
              <p className="mt-1 text-lg font-semibold tabular-nums">{stage.count}</p>
              <p className="text-xs text-muted-foreground">
                {stage.highPriority > 0
                  ? `${stage.highPriority} high priority`
                  : stage.count === 1
                    ? "service"
                    : "services"}
              </p>
            </button>
          );
        })}
      </div>
    </section>
  );
}
