import { ROLE_USER_TYPE, type Role, type SessionUser, type UserType } from "@/auth/roles";

const INTERNAL_ROUTES = [
  "/dashboard",
  "/customers",
  "/sales",
  "/quotes",
  "/orders",
  "/service-delivery",
  "/installations",
  "/services",
  "/billing",
  "/messages",
  "/documents",
  "/reports",
  "/settings",
] as const;

const CUSTOMER_ROUTES = [
  "/portal",
  "/portal/orders",
  "/portal/services",
  "/portal/documents",
  "/portal/billing",
  "/portal/messages",
  "/portal/support",
  "/portal/profile",
] as const;

/**
 * Route access for each role. CUSTOMER_USER currently matches the full portal;
 * keep it listed separately so a narrower customer role can be introduced later.
 */
export const ROLE_ROUTES = {
  ADMIN: INTERNAL_ROUTES,
  OPERATIONS: [
    "/dashboard",
    "/customers",
    "/orders",
    "/service-delivery",
    "/installations",
    "/services",
    "/messages",
    "/documents",
  ],
  SALES: [
    "/dashboard",
    "/customers",
    "/sales",
    "/quotes",
    "/orders",
    "/messages",
    "/documents",
  ],
  FINANCE: [
    "/dashboard",
    "/customers",
    "/orders",
    "/billing",
    "/reports",
    "/documents",
  ],
  CUSTOMER_ADMIN: CUSTOMER_ROUTES,
  CUSTOMER_USER: [
    "/portal",
    "/portal/orders",
    "/portal/services",
    "/portal/documents",
    "/portal/billing",
    "/portal/messages",
    "/portal/support",
    "/portal/profile",
  ],
} as const satisfies Record<Role, readonly string[]>;

function matchesRoute(routes: readonly string[], pathname: string) {
  return routes.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`),
  );
}

export function hasPermission(role: Role, pathname: string) {
  return matchesRoute(ROLE_ROUTES[role], pathname);
}

export function isInternalPath(pathname: string) {
  return matchesRoute(INTERNAL_ROUTES, pathname);
}

export function isCustomerPath(pathname: string) {
  return matchesRoute(CUSTOMER_ROUTES, pathname);
}

export function homePathFor(userType: UserType) {
  return userType === "CUSTOMER" ? "/portal" : "/dashboard";
}

export type AccessDecision = "allow" | "login" | "home" | "deny";

export function decideAccess(user: SessionUser | null, pathname: string): AccessDecision {
  if (pathname === "/login") {
    return user ? "home" : "allow";
  }

  if (pathname === "/access-denied") {
    return user ? "allow" : "login";
  }

  const protectedPath = isInternalPath(pathname) || isCustomerPath(pathname);

  if (!protectedPath) {
    return "allow";
  }

  if (!user) {
    return "login";
  }

  if (isCustomerPath(pathname) && ROLE_USER_TYPE[user.role] !== "CUSTOMER") {
    return "home";
  }

  if (isInternalPath(pathname) && ROLE_USER_TYPE[user.role] !== "INTERNAL") {
    return "home";
  }

  if (!hasPermission(user.role, pathname)) {
    return "deny";
  }

  return "allow";
}
