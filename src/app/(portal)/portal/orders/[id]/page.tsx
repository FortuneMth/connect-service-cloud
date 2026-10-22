import type { Metadata } from "next";

import { PortalOrderDetail } from "@/components/portal/portal-order-detail";
import { demoPortalDeliveries, getDemoPortalDelivery } from "@/data/portal";

export function generateStaticParams() {
  return demoPortalDeliveries.map((delivery) => ({ id: delivery.orderId }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const delivery = getDemoPortalDelivery(id);

  return {
    title: delivery?.orderNumber ?? "Order delivery",
  };
}

export default async function PortalOrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return <PortalOrderDetail id={id} />;
}
