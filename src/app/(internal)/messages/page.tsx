import type { Metadata } from "next";

import { SectionPlaceholder } from "@/components/shell/section-placeholder";

export const metadata: Metadata = {
  title: "Messages",
};

export default function MessagesPage() {
  return <SectionPlaceholder href="/messages" />;
}
