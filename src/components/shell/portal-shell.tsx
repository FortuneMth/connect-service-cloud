"use client";

import { PortalDeliveryProvider } from "@/components/portal/portal-delivery-store";
import { SessionProvider } from "@/components/shell/session-context";
import { ShellFrame } from "@/components/shell/shell-frame";
import { portalShell } from "@/config/navigation";
import type { SessionUser } from "@/auth/roles";

export function PortalShell({
  user,
  children,
}: {
  user: SessionUser;
  children: React.ReactNode;
}) {
  return (
    <SessionProvider user={user}>
      <PortalDeliveryProvider>
        <ShellFrame config={portalShell} user={user}>
          {children}
        </ShellFrame>
      </PortalDeliveryProvider>
    </SessionProvider>
  );
}
