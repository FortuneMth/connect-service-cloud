export const USER_TYPES = ["INTERNAL", "CUSTOMER"] as const;

export type UserType = (typeof USER_TYPES)[number];

export const ROLES = [
  "ADMIN",
  "OPERATIONS",
  "SALES",
  "FINANCE",
  "CUSTOMER_ADMIN",
  "CUSTOMER_USER",
] as const;

export type Role = (typeof ROLES)[number];

export const ROLE_USER_TYPE = {
  ADMIN: "INTERNAL",
  OPERATIONS: "INTERNAL",
  SALES: "INTERNAL",
  FINANCE: "INTERNAL",
  CUSTOMER_ADMIN: "CUSTOMER",
  CUSTOMER_USER: "CUSTOMER",
} as const satisfies Record<Role, UserType>;

export const ROLE_LABELS = {
  ADMIN: "Admin",
  OPERATIONS: "Operations",
  SALES: "Sales",
  FINANCE: "Finance",
  CUSTOMER_ADMIN: "Customer admin",
  CUSTOMER_USER: "Customer user",
} as const satisfies Record<Role, string>;

/**
 * Identity carried on the Auth.js session.
 * organisationId is the tenant. Demo sign-in leaves the tenancy fields null
 * until authenticateDemoUser is replaced by a User-table lookup.
 */
export type SessionUser = {
  id: string;
  name: string;
  email: string;
  role: Role;
  userType: UserType;
  tenantId: string | null;
  organisationId: string | null;
  customerId: string | null;
};

export function isRole(value: string): value is Role {
  return ROLES.some((role) => role === value);
}

export function isUserType(value: string): value is UserType {
  return USER_TYPES.some((userType) => userType === value);
}

export function readSessionUser(user: {
  id?: string;
  name?: string | null;
  email?: string | null;
  role?: string;
  userType?: string;
  tenantId?: string | null;
  organisationId?: string | null;
  customerId?: string | null;
} | null | undefined): SessionUser | null {
  if (!user?.id || !user.email || !user.role || !user.userType) {
    return null;
  }

  if (!isRole(user.role) || !isUserType(user.userType)) {
    return null;
  }

  if (ROLE_USER_TYPE[user.role] !== user.userType) {
    return null;
  }

  return {
    id: user.id,
    name: user.name || user.email,
    email: user.email,
    role: user.role,
    userType: user.userType,
    tenantId: user.tenantId ?? null,
    organisationId: user.organisationId ?? null,
    customerId: user.customerId ?? null,
  };
}
