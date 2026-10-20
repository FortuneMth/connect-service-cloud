import type { Metadata } from "next";

import { InstallationsWorkspace } from "@/components/installations/installations-workspace";

export const metadata: Metadata = {
  title: "Installations",
};

export default function InstallationsPage() {
  return <InstallationsWorkspace />;
}
