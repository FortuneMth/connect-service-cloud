import type { Metadata } from "next";

import { SectionPlaceholder } from "@/components/shell/section-placeholder";

export const metadata: Metadata = {
  title: "Documents",
};

export default function DocumentsPage() {
  return <SectionPlaceholder href="/documents" />;
}
