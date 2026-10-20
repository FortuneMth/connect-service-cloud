import type { Models } from "../../prisma/contract";
import type { Role, UserType } from "@/auth/roles";

type Equal<A, B> =
  (<T>() => T extends A ? 1 : 2) extends <T>() => T extends B ? 1 : 2 ? true : false;

type Assert<T extends true> = T;

/** Fails the build when src/auth/roles.ts drifts from the Prisma Role enum. */
export type RoleMatchesContract = Assert<Equal<Role, Models.public_User["role"]>>;

/** Fails the build when src/auth/roles.ts drifts from the Prisma UserType enum. */
export type UserTypeMatchesContract = Assert<Equal<UserType, Models.public_User["userType"]>>;
