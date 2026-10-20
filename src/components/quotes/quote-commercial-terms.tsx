import { QuotePanel } from "@/components/quotes/quote-panel";
import type { QuoteRecord } from "@/data/quotes";

export function QuoteCommercialTerms({ quote }: { quote: QuoteRecord }) {
  return (
    <QuotePanel title="Commercial terms">
      <dl className="grid gap-3 px-4 py-3 text-sm">
        <Fact label="Contract term" value={`${quote.contractTerm} months`} />
        <Fact label="Payment terms" value={quote.paymentTerms} />
        <Fact label="Billing frequency" value={quote.billingFrequency} />
        <Fact label="Quote validity" value={quote.validUntilLabel} />
        <Fact label="Installation lead time" value={quote.terms.installationLeadTime} />
        <Fact label="SLA" value={quote.terms.sla} />
        <Fact label="Cancellation terms" value={quote.terms.cancellationTerms} />
        <Fact label="Pricing notes" value={quote.terms.pricingNotes || "None recorded."} />
      </dl>
    </QuotePanel>
  );
}

function Fact({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-0">
      <dt className="text-xs text-muted-foreground">{label}</dt>
      <dd className="mt-0.5 break-words">{value}</dd>
    </div>
  );
}
