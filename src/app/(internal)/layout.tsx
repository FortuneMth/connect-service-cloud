import { requireInternalUser } from "@/auth/session";
import { InternalShell } from "@/components/shell/internal-shell";

export const instant = false;

export default async function InternalLayout({ children }: { children: React.ReactNode }) {
  const user = await requireInternalUser();

  return <InternalShell user={user}>{children}</InternalShell>;
}
