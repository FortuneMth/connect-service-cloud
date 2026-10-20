import { QuoteProvider } from "@/components/quotes/quote-store";

export default function QuotesLayout({ children }: { children: React.ReactNode }) {
  return <QuoteProvider>{children}</QuoteProvider>;
}
