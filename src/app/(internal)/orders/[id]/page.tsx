import type { Metadata } from "next";

import { OrderDetail } from "@/components/orders/order-detail";
import { demoOrders, getDemoOrder } from "@/data/orders";

export function generateStaticParams() {
  return demoOrders.map((order) => ({ id: order.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const order = getDemoOrder(id);

  return {
    title: order?.orderNumber ?? "Order",
  };
}

export default async function OrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return <OrderDetail id={id} />;
}
