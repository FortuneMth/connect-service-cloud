import { timingSafeEqual } from "node:crypto";

import { DEMO_PASSWORD } from "@/auth/demo-password";
import { ROLE_USER_TYPE, type Role, type SessionUser } from "@/auth/roles";

type DemoAccount = {
  id: string;
  name: string;
  email: string;
  role: Role;
};

/**
 * Temporary development directory.
 * Replace this lookup with the User model via sessionUserFromRecord.
 * passwordHash on User is the column that lookup will compare. It stays unused
 * while these development accounts are the only credentials.
 */
const DEMO_ACCOUNTS: DemoAccount[] = [
  {
    id: "demo-admin",
    name: "Connect Service Admin",
    email: "admin@connectservicecloud.demo",
    role: "ADMIN",
  },
  {
    id: "demo-operations",
    name: "Connect Service Operations",
    email: "operations@connectservicecloud.demo",
    role: "OPERATIONS",
  },
  {
    id: "demo-sales",
    name: "Connect Service Sales",
    email: "sales@connectservicecloud.demo",
    role: "SALES",
  },
  {
    id: "demo-finance",
    name: "Connect Service Finance",
    email: "finance@connectservicecloud.demo",
    role: "FINANCE",
  },
  {
    id: "demo-customer-admin",
    name: "ABC Manufacturing Admin",
    email: "customer-admin@abcmfg.demo",
    role: "CUSTOMER_ADMIN",
  },
  {
    id: "demo-customer-user",
    name: "ABC Manufacturing User",
    email: "customer-user@abcmfg.demo",
    role: "CUSTOMER_USER",
  },
];

function passwordsMatch(input: string, expected: string) {
  const left = Buffer.from(input);
  const right = Buffer.from(expected);

  if (left.length !== right.length) {
    return false;
  }

  return timingSafeEqual(left, right);
}

export function authenticateDemoUser(email: string, password: string): SessionUser | null {
  const account = DEMO_ACCOUNTS.find(
    (candidate) => candidate.email === email.trim().toLowerCase(),
  );

  if (!account || !passwordsMatch(password, DEMO_PASSWORD)) {
    return null;
  }

  return {
    id: account.id,
    name: account.name,
    email: account.email,
    role: account.role,
    userType: ROLE_USER_TYPE[account.role],
    tenantId: null,
    organisationId: null,
    customerId: null,
  };
}
