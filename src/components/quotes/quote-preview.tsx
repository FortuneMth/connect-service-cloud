"use client";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import {
  QUOTE_TYPE_LABEL,
  formatRand,
  lineMonthly,
  lineOnceOff,
  type QuoteRecord,
} from "@/data/quotes";

export function QuotePreview({
  quote,
  open,
  onOpenChange,
}: {
  quote: QuoteRecord | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[min(48rem,calc(100%-2rem))] w-[min(52rem,calc(100%-2rem))] overflow-y-auto">
        {quote ? <Document quote={quote} onClose={() => onOpenChange(false)} /> : null}
      </DialogContent>
    </Dialog>
  );
}

function Document({ quote, onClose }: { quote: QuoteRecord; onClose: () => void }) {
  const monthly = quote.lineItems.reduce((sum, item) => sum + lineMonthly(item), 0);
  const onceOff = quote.lineItems.reduce((sum, item) => sum + lineOnceOff(item), 0);

  return (
    <>
      <DialogHeader>
        <DialogTitle>Quote preview</DialogTitle>
        <DialogDescription>Visual preview only. A PDF is not generated from this screen.</DialogDescription>
      </DialogHeader>
      <article className="rounded-lg border bg-background px-4 py-4 text-sm sm:px-5">
        <header className="border-b pb-3">
          <p className="text-xs font-medium tracking-wide text-muted-foreground">Connect Service Cloud</p>
          <div className="mt-2 flex flex-wrap items-end justify-between gap-3">
            <div>
              <h3 className="font-heading text-lg font-semibold">{quote.quoteNumber}</h3>
              <p className="text-muted-foreground">{quote.customerName}</p>
            </div>
            <dl className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs">
              <dt className="text-muted-foreground">Date</dt>
              <dd>{quote.createdLabel}</dd>
              <dt className="text-muted-foreground">Valid until</dt>
              <dd>{quote.validUntilLabel}</dd>
              <dt className="text-muted-foreground">Type</dt>
              <dd>{QUOTE_TYPE_LABEL[quote.quoteType]}</dd>
            </dl>
          </div>
        </header>
        <section className="border-b py-3">
          <h4 className="text-xs font-medium text-muted-foreground">Executive summary</h4>
          <p className="mt-1">{quote.executiveSummary}</p>
        </section>
        <section className="border-b py-3">
          <h4 className="text-xs font-medium text-muted-foreground">Sites</h4>
          <ul className="mt-2 grid gap-2">
            {quote.sites.map((site) => (
              <li key={site.id} className="flex flex-wrap justify-between gap-2">
                <span>
                  {site.name}
                  <span className="text-muted-foreground"> · {site.address}</span>
                </span>
                <span className="text-muted-foreground">{site.service}</span>
              </li>
            ))}
          </ul>
        </section>
        <section className="border-b py-3">
          <h4 className="text-xs font-medium text-muted-foreground">Line items</h4>
          <div className="mt-2 overflow-x-auto">
            <table className="w-full min-w-[32rem] text-left text-xs">
              <thead className="text-muted-foreground">
                <tr>
                  <th className="py-1 font-medium">Service</th>
                  <th className="py-1 font-medium">Qty</th>
                  <th className="py-1 font-medium">Monthly</th>
                  <th className="py-1 font-medium">Once-off</th>
                </tr>
              </thead>
              <tbody>
                {quote.lineItems.map((item) => (
                  <tr key={item.id} className="border-t">
                    <td className="py-1.5">
                      <p>{item.product}</p>
                      <p className="text-muted-foreground">{item.site}</p>
                    </td>
                    <td className="py-1.5 tabular-nums">{item.quantity}</td>
                    <td className="py-1.5 tabular-nums">{formatRand(lineMonthly(item))}</td>
                    <td className="py-1.5 tabular-nums">{formatRand(lineOnceOff(item))}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
        <section className="grid gap-1 border-b py-3 sm:ml-auto sm:w-72">
          <Row label="Monthly recurring" value={formatRand(monthly)} />
          <Row label="Once-off charges" value={formatRand(onceOff)} />
          <Row label="Contract value" value={formatRand(quote.subtotal)} />
          <Row label="VAT" value={formatRand(quote.vat)} />
        </section>
        <section className="grid gap-2 py-3 sm:grid-cols-2">
          <div>
            <h4 className="text-xs font-medium text-muted-foreground">Terms</h4>
            <p className="mt-1">{quote.contractTerm} months · {quote.paymentTerms}</p>
            <p>{quote.billingFrequency}</p>
            <p>{quote.terms.sla}</p>
            <p>{quote.terms.installationLeadTime}</p>
          </div>
          <div>
            <h4 className="text-xs font-medium text-muted-foreground">Contact</h4>
            <p className="mt-1">{quote.owner.name}</p>
            <p>Connect Service Cloud</p>
            <p className="text-muted-foreground">{quote.customer.primaryContact.name}</p>
            <p className="text-muted-foreground">{quote.customer.primaryContact.email}</p>
            <p className="text-muted-foreground">{quote.customer.primaryContact.phone}</p>
          </div>
        </section>
      </article>
      <div className="flex justify-end">
        <Button type="button" variant="outline" onClick={onClose}>
          Close
        </Button>
      </div>
    </>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between gap-3">
      <dt className="text-muted-foreground">{label}</dt>
      <dd className="tabular-nums">{value}</dd>
    </div>
  );
}
