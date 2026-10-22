import type { Metadata } from "next";

import { EscalationDetail } from "@/components/service-delivery/escalation-detail";
import { demoPortalEscalations } from "@/data/portal";

export function generateStaticParams() {
  return demoPortalEscalations.map((escalation) => ({ id: escalation.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const escalation = demoPortalEscalations.find((item) => item.id === id);

  return {
    title: escalation?.reference ?? "Escalation",
  };
}

export default async function EscalationDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return <EscalationDetail id={id} />;
}
