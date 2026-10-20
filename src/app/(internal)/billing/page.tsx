import type { Metadata } from "next";

import { SectionPlaceholder } from "@/components/shell/section-placeholder";

export const metadata: Metadata = {
  title: "Billing",
};

export default function BillingPage() {
  return <SectionPlaceholder href="/billing" />;
}
