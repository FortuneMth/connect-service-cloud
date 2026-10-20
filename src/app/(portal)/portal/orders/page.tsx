import type { Metadata } from "next";

import { SectionPlaceholder } from "@/components/shell/section-placeholder";

export const metadata: Metadata = {
  title: "My Orders",
};

export default function PortalOrdersPage() {
  return <SectionPlaceholder href="/portal/orders" />;
}
