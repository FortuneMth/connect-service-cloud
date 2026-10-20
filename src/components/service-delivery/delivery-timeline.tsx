import Link from "next/link";

import { StatusBadge } from "@/components/shell/status-badge";
import { ACTIVITY_CATEGORY_LABEL, type DeliveryActivity } from "@/data/service-delivery";

export function DeliveryTimeline({ activity }: { activity: DeliveryActivity[] }) {
  return (
    <section className="min-w-0 rounded-lg border bg-card">
      <header className="border-b px-4 py-2.5">
        <h2 className="text-sm font-medium">Delivery timeline</h2>
        <p className="mt-0.5 text-xs text-muted-foreground">Recent operational activity across the delivery book.</p>
      </header>
      <ol className="divide-y">
        {activity.map((item) => (
          <li key={item.id} className="grid grid-cols-[3.5rem_minmax(0,1fr)] gap-3 px-4 py-2.5 text-sm">
            <p className="pt-0.5 text-xs tabular-nums text-muted-foreground">{item.timeLabel}</p>
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <StatusBadge status={ACTIVITY_CATEGORY_LABEL[item.category]} />
                <span className="text-xs text-muted-foreground">{item.occurredLabel}</span>
              </div>
              <p className="mt-1">
                <ActivitySummary item={item} />
              </p>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}

function ActivitySummary({ item }: { item: DeliveryActivity }) {
  if (!item.orderId || !item.orderNumber || !item.summary.includes(item.orderNumber)) {
    return item.summary;
  }

  const [before, after] = item.summary.split(item.orderNumber);

  return (
    <>
      {before}
      <Link href={`/orders/${item.orderId}`} className="underline-offset-4 hover:underline">
        {item.orderNumber}
      </Link>
      {after}
    </>
  );
}
