import { ArrowRight, CalendarClock, CircleCheck, MessageSquare, Radio } from "lucide-react";
import type { LucideIcon } from "lucide-react";

import { CustomerPanel } from "@/components/customers/customer-panel";
import type { CustomerActivity as ActivityItem, CustomerRecord } from "@/data/customers";

const icons: Record<ActivityItem["action"], LucideIcon> = {
  ORDER_CREATED: ArrowRight,
  QUOTE_ACCEPTED: CircleCheck,
  INSTALLATION_SCHEDULED: CalendarClock,
  MESSAGE_RECEIVED: MessageSquare,
  SERVICE_ACTIVATED: Radio,
};

export function CustomerActivity({ customer }: { customer: CustomerRecord }) {
  return (
    <CustomerPanel title="Activity">
      {customer.activity.length === 0 ? (
        <p className="px-4 py-6 text-sm text-muted-foreground">No activity recorded yet.</p>
      ) : (
        <ol>
          {customer.activity.map((item) => {
            const Icon = icons[item.action];

            return (
              <li key={item.id} className="flex gap-3 border-b px-4 py-3 last:border-b-0">
                <span className="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-md border bg-muted/50">
                  <Icon className="size-3.5 text-muted-foreground" aria-hidden />
                </span>
                <div className="min-w-0">
                  <p className="text-sm">{item.summary}</p>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {item.actorName} · {item.occurredLabel}
                  </p>
                </div>
              </li>
            );
          })}
        </ol>
      )}
    </CustomerPanel>
  );
}
