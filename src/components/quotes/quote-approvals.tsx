import { QuotePanel } from "@/components/quotes/quote-panel";
import { StatusBadge } from "@/components/shell/status-badge";
import { APPROVAL_AREA_LABEL, APPROVAL_STATUS_LABEL, type QuoteRecord } from "@/data/quotes";

export function QuoteApprovals({ quote }: { quote: QuoteRecord }) {
  return (
    <QuotePanel
      title="Internal review"
      description="Commercial, technical, and finance approval. This panel is internal and is not part of the customer quote."
      className="bg-muted/20"
    >
      <ul className="grid gap-2 px-4 py-3">
        {quote.approvals.map((approval) => (
          <li key={approval.id} className="flex flex-wrap items-center justify-between gap-2 rounded-lg border bg-card px-3 py-2">
            <div className="min-w-0">
              <p className="text-sm font-medium">{APPROVAL_AREA_LABEL[approval.area]}</p>
              <p className="text-xs text-muted-foreground">{approval.actorName}</p>
            </div>
            <StatusBadge status={APPROVAL_STATUS_LABEL[approval.status]} />
          </li>
        ))}
      </ul>
    </QuotePanel>
  );
}
