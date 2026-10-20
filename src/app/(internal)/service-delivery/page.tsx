import type { Metadata } from "next";

import { ServiceDeliveryWorkspace } from "@/components/service-delivery/service-delivery-workspace";

export const metadata: Metadata = {
  title: "Service Delivery",
};

export default function ServiceDeliveryPage() {
  return <ServiceDeliveryWorkspace />;
}
