import { ROLE_USER_TYPE, type Role, type SessionUser, type UserType } from "@/auth/roles";

/**
 * Fields Auth.js needs from a User row.
 * Role names match the Role and UserType enums in prisma/contract.prisma.
 * src/auth/prisma-enums.ts fails the build if those definitions drift.
 */
export type AuthUserRecord = {
  id: string;
  name: string;
  email: string;
  role: Role;
  userType: UserType;
  organisationId: string;
  customerId: string | null;
};

export function sessionUserFromRecord(user: AuthUserRecord): SessionUser {
  if (ROLE_USER_TYPE[user.role] !== user.userType) {
    throw new Error("User role does not match user type.");
  }

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    userType: user.userType,
    tenantId: user.organisationId,
    organisationId: user.organisationId,
    customerId: user.customerId,
  };
}
