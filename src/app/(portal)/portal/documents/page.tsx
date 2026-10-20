import type { Metadata } from "next";

import { SectionPlaceholder } from "@/components/shell/section-placeholder";

export const metadata: Metadata = {
  title: "Documents",
};

export default function PortalDocumentsPage() {
  return <SectionPlaceholder href="/portal/documents" />;
}
