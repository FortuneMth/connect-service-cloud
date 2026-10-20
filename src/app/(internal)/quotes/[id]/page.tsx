import type { Metadata } from "next";

import { QuoteDetail } from "@/components/quotes/quote-detail";
import { demoQuotes, getDemoQuote } from "@/data/quotes";

export function generateStaticParams() {
  return demoQuotes.map((quote) => ({ id: quote.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const quote = getDemoQuote(id);

  return {
    title: quote?.quoteNumber ?? "Quote",
  };
}

export default async function QuoteDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return <QuoteDetail id={id} />;
}
