import { requireCustomerUser } from "@/auth/session";
import { PortalShell } from "@/components/shell/portal-shell";

export const instant = false;

export default async function PortalLayout({ children }: { children: React.ReactNode }) {
  const user = await requireCustomerUser();

  return <PortalShell user={user}>{children}</PortalShell>;
}
