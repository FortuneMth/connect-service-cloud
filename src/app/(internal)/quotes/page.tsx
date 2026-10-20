import type { Metadata } from "next";

import { QuoteWorkspace } from "@/components/quotes/quote-workspace";

export const metadata: Metadata = {
  title: "Quotes",
};

export default function QuotesPage() {
  return <QuoteWorkspace />;
}
