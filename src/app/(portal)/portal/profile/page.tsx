import type { Metadata } from "next";

import { SectionPlaceholder } from "@/components/shell/section-placeholder";

export const metadata: Metadata = {
  title: "Company Profile",
};

export default function PortalProfilePage() {
  return <SectionPlaceholder href="/portal/profile" />;
}
