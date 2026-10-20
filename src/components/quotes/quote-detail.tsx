"use client";

import Link from "next/link";

import { QuoteActivity } from "@/components/quotes/quote-activity";
import { QuoteApprovals } from "@/components/quotes/quote-approvals";
import { QuoteCommercialTerms } from "@/components/quotes/quote-commercial-terms";
import { QuoteCustomerCard } from "@/components/quotes/quote-customer-card";
import { QuoteDetailHeader } from "@/components/quotes/quote-detail-header";
import { QuoteLineItems } from "@/components/quotes/quote-line-items";
import { QuoteOpportunityCard } from "@/components/quotes/quote-opportunity-card";
import { QuoteSites } from "@/components/quotes/quote-sites";
import { QuoteSummary } from "@/components/quotes/quote-summary";
import { useQuotes } from "@/components/quotes/quote-store";
import { Button } from "@/components/ui/button";

export function QuoteDetail({ id }: { id: string }) {
  const { quotes } = useQuotes();
  const quote = quotes.find((item) => item.id === id);

  if (!quote) {
    return (
      <div className="rounded-lg border bg-card px-4 py-8">
        <h1 className="text-lg font-semibold">Quote not found</h1>
        <p className="mt-1 text-sm text-muted-foreground">This quote is not in the current session.</p>
        <Button className="mt-4" render={<Link href="/quotes" />}>
          Back to quotes
        </Button>
      </div>
    );
  }

  return (
    <div className="flex min-w-0 flex-col gap-4">
      <QuoteDetailHeader quote={quote} />
      <div className="grid min-w-0 gap-4 lg:grid-cols-2">
        <QuoteSummary quote={quote} />
        <QuoteCommercialTerms quote={quote} />
      </div>
      <QuoteLineItems quote={quote} />
      <div className="grid min-w-0 gap-4 lg:grid-cols-2">
        <QuoteCustomerCard quote={quote} />
        <QuoteOpportunityCard quote={quote} />
      </div>
      <QuoteSites quote={quote} />
      <div className="grid min-w-0 gap-4 lg:grid-cols-2">
        <QuoteApprovals quote={quote} />
        <QuoteActivity quote={quote} />
      </div>
    </div>
  );
}
