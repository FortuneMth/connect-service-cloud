import type { Metadata } from "next";

import { SalesWorkspace } from "@/components/sales/sales-workspace";

export const metadata: Metadata = {
  title: "Sales",
};

export default function SalesPage() {
  return <SalesWorkspace />;
}
