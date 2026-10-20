import { QuotePanel } from "@/components/quotes/quote-panel";
import { formatRand, type QuoteRecord } from "@/data/quotes";

export function QuoteSummary({ quote }: { quote: QuoteRecord }) {
  return (
    <QuotePanel title="Quote summary" description={`${quote.currency} commercial totals for this proposal.`}>
      <div className="grid gap-4 px-4 py-3 sm:grid-cols-2">
        <Figure label="Total Contract Value" value={formatRand(quote.subtotal)} />
        <Figure label="Monthly Recurring Revenue" value={formatRand(quote.mrr)} />
        <Figure label="Once-off Charges" value={formatRand(quote.nrc)} />
        <Figure label="Contract Term" value={`${quote.contractTerm} months`} />
      </div>
      <dl className="grid gap-3 border-t px-4 py-3 text-sm sm:grid-cols-2">
        <Fact label="Currency" value={quote.currency} />
        <Fact label="Payment terms" value={quote.paymentTerms} />
        <Fact label="Quote validity" value={quote.validUntilLabel} />
        <Fact label="Tax/VAT" value={`15% · ${formatRand(quote.vat)}`} />
        <Fact label="Billing frequency" value={quote.billingFrequency} />
        {quote.total !== quote.subtotal ? <Fact label="Quoted value" value={formatRand(quote.total)} /> : null}
      </dl>
    </QuotePanel>
  );
}

function Figure({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-0">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="mt-1 text-xl font-semibold tracking-tight tabular-nums">{value}</p>
    </div>
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
