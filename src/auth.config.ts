import type { NextAuthConfig } from "next-auth";
import { NextResponse } from "next/server";

import { decideAccess, homePathFor } from "@/auth/permissions";
import { readSessionUser } from "@/auth/roles";

export const authConfig = {
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
  },
  providers: [],
  callbacks: {
    authorized({ auth, request }) {
      const user = readSessionUser(auth?.user);
      const decision = decideAccess(user, request.nextUrl.pathname);

      if (decision === "allow") {
        return true;
      }

      if (decision === "home" && user) {
        return NextResponse.redirect(new URL(homePathFor(user.userType), request.nextUrl));
      }

      if (decision === "deny") {
        return NextResponse.redirect(new URL("/access-denied", request.nextUrl));
      }

      return NextResponse.redirect(new URL("/login", request.nextUrl));
    },
    jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.userType = user.userType;
        token.tenantId = user.tenantId ?? null;
        token.organisationId = user.organisationId ?? null;
        token.customerId = user.customerId ?? null;
      }

      return token;
    },
    session({ session, token }) {
      if (token.id && token.role && token.userType) {
        session.user.id = token.id;
        session.user.role = token.role;
        session.user.userType = token.userType;
        session.user.tenantId = token.tenantId ?? null;
        session.user.organisationId = token.organisationId ?? null;
        session.user.customerId = token.customerId ?? null;
      }

      return session;
    },
  },
} satisfies NextAuthConfig;
