import { SalesPanel } from "@/components/sales/sales-panel";
import { formatRand } from "@/data/customers";
import { contractValue, type OpportunityRecord } from "@/data/sales";

export function OpportunityCommercialSummary({ opportunity }: { opportunity: OpportunityRecord }) {
  const items = [
    {
      label: "Estimated MRR",
      value: formatRand(opportunity.estimatedMrr),
      detail: "Monthly recurring",
    },
    {
      label: "Estimated NRC",
      value: formatRand(opportunity.estimatedNrc),
      detail: "Once-off charges",
    },
    {
      label: "Contract Term",
      value: `${opportunity.contractTermMonths} months`,
      detail: "Committed term",
    },
    {
      label: "Estimated Contract Value",
      value: formatRand(
        contractValue(opportunity.estimatedMrr, opportunity.estimatedNrc, opportunity.contractTermMonths),
      ),
      detail: "Recurring term plus once-off",
    },
  ];

  return (
    <SalesPanel title="Commercial summary" description="Recurring and once-off connectivity charges.">
      <dl className="grid gap-3 px-4 py-3 sm:grid-cols-2">
        {items.map((item) => (
          <div key={item.label} className="min-w-0">
            <dt className="text-xs text-muted-foreground">{item.label}</dt>
            <dd className="mt-0.5 text-sm font-medium tabular-nums">{item.value}</dd>
            <dd className="text-xs text-muted-foreground">{item.detail}</dd>
          </div>
        ))}
      </dl>
    </SalesPanel>
  );
}
