import type { Metadata } from "next";
import { ShieldX } from "lucide-react";
import Link from "next/link";

import { homePathFor } from "@/auth/permissions";
import { requireAuth } from "@/auth/session";
import { EmptyState } from "@/components/shell/empty-state";
import { InternalShell } from "@/components/shell/internal-shell";
import { PortalShell } from "@/components/shell/portal-shell";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Access denied",
};

export const instant = false;

export default async function AccessDeniedPage() {
  const user = await requireAuth();
  const Shell = user.userType === "INTERNAL" ? InternalShell : PortalShell;

  return (
    <Shell user={user}>
      <div className="flex flex-col gap-4">
        <EmptyState
          icon={ShieldX}
          title="Access denied"
          description="Your role does not include this area."
        />
        <div className="flex justify-center">
          <Button render={<Link href={homePathFor(user.userType)} />}>
            Back to workspace
          </Button>
        </div>
      </div>
    </Shell>
  );
}
