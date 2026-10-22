import { cn } from "cn";
import { Check } from "lucide-react";

import { STAGE_CUSTOMER_LABEL, STAGE_SHORT_LABEL, type DeliveryStage, type PortalDelivery } from "@/data/portal";

export function DeliveryTracker({ delivery }: { delivery: PortalDelivery }) {
  return (
    <section className="min-w-0 rounded-lg border bg-card px-4 py-4">
      <h2 className="text-sm font-medium">Delivery journey</h2>
      <p className="mt-0.5 text-xs text-muted-foreground">Follow each step from order confirmation to go-live.</p>
      <ol className="relative mt-5 space-y-0">
        {delivery.stages.map((stage, index) => (
          <StageRow
            key={stage.key}
            stage={stage}
            isLast={index === delivery.stages.length - 1}
            isCurrent={stage.key === delivery.currentStage}
          />
        ))}
      </ol>
    </section>
  );
}

function StageRow({
  stage,
  isLast,
  isCurrent,
}: {
  stage: DeliveryStage;
  isLast: boolean;
  isCurrent: boolean;
}) {
  const completed = stage.state === "COMPLETED";
  const upcoming = stage.state === "UPCOMING";

  return (
    <li className={cn("relative flex gap-3 pb-5", isLast && "pb-0")}>
      {!isLast ? (
        <span
          className={cn(
            "absolute top-6 left-[0.6875rem] h-[calc(100%-0.75rem)] w-px",
            completed ? "bg-emerald-600" : "bg-border",
          )}
          aria-hidden
        />
      ) : null}
      <div className="relative z-10 mt-0.5 shrink-0">
        {completed ? (
          <span className="flex size-6 items-center justify-center rounded-full bg-emerald-600 text-white">
            <Check className="size-3.5" aria-hidden />
            <span className="sr-only">Completed</span>
          </span>
        ) : isCurrent ? (
          <span className="flex size-6 items-center justify-center rounded-full border-2 border-[#2563EB] bg-[#2563EB]/10">
            <span className="size-2.5 rounded-full bg-[#2563EB]" />
            <span className="sr-only">Current stage</span>
          </span>
        ) : (
          <span className="flex size-6 items-center justify-center rounded-full border border-border bg-background">
            <span className="size-2 rounded-full bg-zinc-300 dark:bg-zinc-600" />
            <span className="sr-only">Upcoming</span>
          </span>
        )}
      </div>
      <div
        className={cn(
          "min-w-0 flex-1 rounded-lg border px-3 py-2.5",
          isCurrent ? "border-[#2563EB]/40 bg-[#2563EB]/5" : "border-transparent bg-transparent",
          upcoming && "opacity-70",
        )}
      >
        <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
          <h3 className={cn("text-sm font-medium", isCurrent && "text-[#2563EB]")}>
            {STAGE_SHORT_LABEL[stage.key]}
          </h3>
          <p className="text-xs text-muted-foreground">
            {completed ? "Completed" : isCurrent ? "In progress" : "Upcoming"}
          </p>
        </div>
        <p className="mt-1 text-xs text-muted-foreground">{STAGE_CUSTOMER_LABEL[stage.key]}</p>
        {stage.explanation ? <p className="mt-1.5 text-sm">{stage.explanation}</p> : null}
        <dl className="mt-2 grid gap-1 text-xs text-muted-foreground sm:grid-cols-2">
          {stage.startLabel ? (
            <div>
              <dt className="inline text-muted-foreground">Started: </dt>
              <dd className="inline text-foreground">{stage.startLabel}</dd>
            </div>
          ) : null}
          {stage.completedLabel ? (
            <div>
              <dt className="inline text-muted-foreground">Completed: </dt>
              <dd className="inline text-foreground">{stage.completedLabel}</dd>
            </div>
          ) : null}
          {stage.expectedDuration ? (
            <div>
              <dt className="inline text-muted-foreground">Expected: </dt>
              <dd className="inline text-foreground">{stage.expectedDuration}</dd>
            </div>
          ) : null}
          {stage.actualDuration ? (
            <div>
              <dt className="inline text-muted-foreground">Actual: </dt>
              <dd className="inline text-foreground">{stage.actualDuration}</dd>
            </div>
          ) : null}
        </dl>
      </div>
    </li>
  );
}
