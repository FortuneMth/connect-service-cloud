import type { Metadata } from "next";

import { SectionPlaceholder } from "@/components/shell/section-placeholder";

export const metadata: Metadata = {
  title: "Messages",
};

export default function PortalMessagesPage() {
  return <SectionPlaceholder href="/portal/messages" />;
}
