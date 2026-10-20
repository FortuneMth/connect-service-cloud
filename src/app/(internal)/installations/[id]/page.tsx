import type { Metadata } from "next";

import { InstallationDetail } from "@/components/installations/installation-detail";
import { demoInstallations, getDemoInstallation } from "@/data/installations";

export function generateStaticParams() {
  return demoInstallations.map((installation) => ({ id: installation.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const installation = getDemoInstallation(id);

  return {
    title: installation?.installationNumber ?? "Installation",
  };
}

export default async function InstallationDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return <InstallationDetail id={id} />;
}
