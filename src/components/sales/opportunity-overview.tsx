import { SalesPanel } from "@/components/sales/sales-panel";
import { formatRand } from "@/data/customers";
import { OPPORTUNITY_TYPE_LABEL, contractValue, type OpportunityRecord } from "@/data/sales";

export function OpportunityOverview({ opportunity }: { opportunity: OpportunityRecord }) {
  return (
    <SalesPanel title="Opportunity">
      <dl className="grid gap-3 px-4 py-3 text-sm sm:grid-cols-2">
        <Fact label="Customer" value={opportunity.customer.name} />
        <Fact label="Opportunity type" value={OPPORTUNITY_TYPE_LABEL[opportunity.type]} />
        <Fact label="Solution" value={opportunity.solution} />
        <Fact label="Pipeline value" value={formatRand(opportunity.value)} />
        <Fact
          label="Estimated contract value"
          value={formatRand(
            contractValue(opportunity.estimatedMrr, opportunity.estimatedNrc, opportunity.contractTermMonths),
          )}
        />
        <Fact label="Monthly recurring revenue" value={formatRand(opportunity.estimatedMrr)} />
        <Fact label="One-time charges" value={formatRand(opportunity.estimatedNrc)} />
        <Fact label="Probability" value={`${opportunity.probability}%`} />
        <Fact label="Expected close" value={opportunity.expectedCloseLabel} />
        <Fact label="Account owner" value={opportunity.owner.name} />
        <Fact label="Created" value={opportunity.createdLabel} />
        <Fact label="Last activity" value={opportunity.lastActivityLabel} />
        <Fact label="Source" value={opportunity.source} />
        <Fact label="Notes" value={opportunity.notes || "No notes"} className="sm:col-span-2" />
      </dl>
    </SalesPanel>
  );
}

function Fact({ label, value, className }: { label: string; value: string; className?: string }) {
  return (
    <div className={className ? `min-w-0 ${className}` : "min-w-0"}>
      <dt className="text-xs text-muted-foreground">{label}</dt>
      <dd className="mt-0.5 break-words">{value}</dd>
    </div>
  );
}
