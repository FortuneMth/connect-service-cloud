import { ACTIVITY_ICON, type ActivityItem } from "@/data/operations-dashboard";
import { DashboardSection } from "@/components/dashboard/dashboard-section";

export function ActivityFeed({ items }: { items: ActivityItem[] }) {
  return (
    <DashboardSection title="Recent Activity">
      <ol>
        {items.map((item) => {
          const Icon = ACTIVITY_ICON[item.action];

          return (
            <li key={item.id} className="flex gap-3 border-b px-4 py-3 last:border-b-0">
              <span className="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-md border bg-muted/50">
                <Icon className="size-3.5 text-muted-foreground" aria-hidden />
              </span>
              <div className="min-w-0">
                <p className="text-sm">{item.summary}</p>
                <p className="mt-0.5 text-xs text-muted-foreground">{item.occurredLabel}</p>
              </div>
            </li>
          );
        })}
      </ol>
    </DashboardSection>
  );
}
