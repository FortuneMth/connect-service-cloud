import { cn } from "cn";

import { DashboardSection } from "@/components/dashboard/dashboard-section";
import type { PipelineStage } from "@/data/operations-dashboard";

export function OrderPipeline({ stages }: { stages: PipelineStage[] }) {
  return (
    <DashboardSection title="Order pipeline">
      <div className="overflow-x-auto">
        <div className="relative min-w-[52rem] px-2 py-4">
          <div aria-hidden className="absolute top-7 right-10 left-10 h-px bg-border" />
          <ol className="relative grid grid-cols-9" aria-label="Orders by delivery stage">
            {stages.map((stage) => (
              <li key={stage.key} className="flex flex-col items-center px-1 text-center">
                <span
                  className={cn(
                    "relative z-10 bg-card px-1.5 text-lg leading-none font-semibold tabular-nums",
                    stage.key === "COMPLETED" ? "text-muted-foreground" : "text-foreground",
                  )}
                >
                  {stage.count}
                </span>
                <span className="mt-2 text-xs text-muted-foreground">{stage.label}</span>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </DashboardSection>
  );
}
