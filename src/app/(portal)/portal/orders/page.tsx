import type { Metadata } from "next";

import { PortalOrders } from "@/components/portal/portal-orders";

export const metadata: Metadata = {
  title: "My Orders",
};

export default function PortalOrdersPage() {
  return <PortalOrders />;
}
