import type { Metadata } from "next";

import { ServiceDetail } from "@/components/services/service-detail";
import { demoServices, getDemoService } from "@/data/services";

export function generateStaticParams() {
  return demoServices.map((service) => ({ id: service.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const service = getDemoService(id);

  return {
    title: service?.serviceNumber ?? "Service",
  };
}

export default async function ServiceDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return <ServiceDetail id={id} />;
}
