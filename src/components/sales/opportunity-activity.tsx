import {
  ArrowRightLeft,
  Calculator,
  FileText,
  Handshake,
  Lightbulb,
  MessageSquare,
  PenLine,
  Search,
  Users,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

import { SalesPanel } from "@/components/sales/sales-panel";
import type { OpportunityActivity as ActivityItem, OpportunityRecord } from "@/data/sales";

const icons: Record<ActivityItem["action"], LucideIcon> = {
  CREATED: PenLine,
  DISCOVERY: Search,
  REQUIREMENTS: FileText,
  SOLUTION: Lightbulb,
  PROPOSAL: FileText,
  MEETING: Users,
  PRICING: Calculator,
  NEGOTIATION: Handshake,
  STAGE: ArrowRightLeft,
  NOTE: MessageSquare,
};

export function OpportunityActivity({ opportunity }: { opportunity: OpportunityRecord }) {
  return (
    <SalesPanel title="Activity">
      {opportunity.activities.length === 0 ? (
        <p className="px-4 py-6 text-sm text-muted-foreground">No activity recorded yet.</p>
      ) : (
        <ol>
          {opportunity.activities.map((item) => {
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
    </SalesPanel>
  );
}
