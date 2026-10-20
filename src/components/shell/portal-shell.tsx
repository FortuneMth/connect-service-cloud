"use client";

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
    <ShellFrame config={portalShell} user={user}>
      {children}
    </ShellFrame>
  );
}
