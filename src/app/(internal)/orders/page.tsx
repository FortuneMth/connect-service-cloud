import type { Metadata } from "next";

import { OrderWorkspace } from "@/components/orders/order-workspace";

export const metadata: Metadata = {
  title: "Orders",
};

export default function OrdersPage() {
  return <OrderWorkspace />;
}
