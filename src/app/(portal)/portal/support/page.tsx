import type { Metadata } from "next";

import { SectionPlaceholder } from "@/components/shell/section-placeholder";

export const metadata: Metadata = {
  title: "Support",
};

export default function PortalSupportPage() {
  return <SectionPlaceholder href="/portal/support" />;
}
