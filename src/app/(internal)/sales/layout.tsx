import { OpportunityProvider } from "@/components/sales/opportunity-store";

export default function SalesLayout({ children }: { children: React.ReactNode }) {
  return <OpportunityProvider>{children}</OpportunityProvider>;
}
