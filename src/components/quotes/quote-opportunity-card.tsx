import Link from "next/link";

import { QuotePanel } from "@/components/quotes/quote-panel";
import { StatusBadge } from "@/components/shell/status-badge";
import type { QuoteRecord } from "@/data/quotes";

export function QuoteOpportunityCard({ quote }: { quote: QuoteRecord }) {
  const opportunity = quote.opportunity;

  return (
    <QuotePanel title="Opportunity">
      <dl className="grid gap-3 px-4 py-3 text-sm sm:grid-cols-2">
        <Fact label="Opportunity number" value={opportunity.opportunityNumber} />
        <div className="min-w-0">
          <dt className="text-xs text-muted-foreground">Opportunity name</dt>
          <dd className="mt-0.5">
            <Link href={`/sales/${opportunity.id}`} className="font-medium underline-offset-4 hover:underline">
              {opportunity.name}
            </Link>
          </dd>
        </div>
        <div>
          <dt className="text-xs text-muted-foreground">Stage</dt>
          <dd className="mt-1">
            <StatusBadge status={opportunity.stageLabel} />
          </dd>
        </div>
        <Fact label="Owner" value={opportunity.ownerName} />
        <Fact label="Probability" value={`${opportunity.probability}%`} />
        <Fact label="Expected close" value={opportunity.expectedCloseLabel} />
      </dl>
    </QuotePanel>
  );
}

function Fact({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-0">
      <dt className="text-xs text-muted-foreground">{label}</dt>
      <dd className="mt-0.5 break-words tabular-nums">{value}</dd>
    </div>
  );
}
