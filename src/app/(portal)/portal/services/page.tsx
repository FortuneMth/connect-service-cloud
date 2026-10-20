import type { Metadata } from "next";

import { SectionPlaceholder } from "@/components/shell/section-placeholder";

export const metadata: Metadata = {
  title: "Services",
};

export default function PortalServicesPage() {
  return <SectionPlaceholder href="/portal/services" />;
}
