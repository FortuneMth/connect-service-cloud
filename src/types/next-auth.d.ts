import type { DefaultSession } from "next-auth";

import type { Role, UserType } from "@/auth/roles";

declare module "next-auth" {
  interface User {
    role: Role;
    userType: UserType;
    tenantId: string | null;
    organisationId: string | null;
    customerId: string | null;
  }

  interface Session {
    user: {
      id: string;
      role: Role;
      userType: UserType;
      tenantId: string | null;
      organisationId: string | null;
      customerId: string | null;
    } & DefaultSession["user"];
  }
}

declare module "@auth/core/jwt" {
  interface JWT {
    id?: string;
    role?: Role;
    userType?: UserType;
    tenantId?: string | null;
    organisationId?: string | null;
    customerId?: string | null;
  }
}
