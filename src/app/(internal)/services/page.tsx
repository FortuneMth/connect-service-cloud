import type { Metadata } from "next";

import { ServicesWorkspace } from "@/components/services/services-workspace";

export const metadata: Metadata = {
  title: "Services",
};

export default function ServicesPage() {
  return <ServicesWorkspace />;
}
