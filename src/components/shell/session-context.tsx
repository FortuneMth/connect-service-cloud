"use client";

import { createContext, useContext, type ReactNode } from "react";

import type { SessionUser } from "@/auth/roles";

const SessionContext = createContext<SessionUser | null>(null);

export function SessionProvider({
  user,
  children,
}: {
  user: SessionUser;
  children: ReactNode;
}) {
  return <SessionContext.Provider value={user}>{children}</SessionContext.Provider>;
}

export function useSessionUser() {
  const user = useContext(SessionContext);

  if (!user) {
    throw new Error("Session is only available inside the application shell.");
  }

  return user;
}
