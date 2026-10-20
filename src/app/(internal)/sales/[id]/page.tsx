import type { Metadata } from "next";

import { OpportunityDetail } from "@/components/sales/opportunity-detail";
import { demoOpportunities, getDemoOpportunity } from "@/data/sales";

export function generateStaticParams() {
  return demoOpportunities.map((opportunity) => ({ id: opportunity.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const opportunity = getDemoOpportunity(id);

  return {
    title: opportunity?.name ?? "Opportunity",
  };
}

export default async function OpportunityDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return <OpportunityDetail id={id} />;
}
