import { cache } from "react";
import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { homePathFor } from "@/auth/permissions";
import { readSessionUser, type Role, type SessionUser } from "@/auth/roles";

export const getCurrentUser = cache(async (): Promise<SessionUser | null> => {
  const session = await auth();
  return readSessionUser(session?.user);
});

export async function requireAuth() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  return user;
}

export async function requireInternalUser() {
  const user = await requireAuth();

  if (user.userType !== "INTERNAL") {
    redirect(homePathFor("CUSTOMER"));
  }

  return user;
}

export async function requireCustomerUser() {
  const user = await requireAuth();

  if (user.userType !== "CUSTOMER") {
    redirect(homePathFor("INTERNAL"));
  }

  return user;
}

export async function requireRole(roles: readonly Role[]) {
  const user = await requireAuth();

  if (!roles.includes(user.role)) {
    redirect("/access-denied");
  }

  return user;
}
