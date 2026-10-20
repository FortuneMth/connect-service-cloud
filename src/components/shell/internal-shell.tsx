"use client";

import { SessionProvider } from "@/components/shell/session-context";
import { ShellFrame } from "@/components/shell/shell-frame";
import { internalShell } from "@/config/navigation";
import type { SessionUser } from "@/auth/roles";

export function InternalShell({
  user,
  children,
}: {
  user: SessionUser;
  children: React.ReactNode;
}) {
  return (
    <SessionProvider user={user}>
      <ShellFrame config={internalShell} user={user}>
        {children}
      </ShellFrame>
    </SessionProvider>
  );
}
