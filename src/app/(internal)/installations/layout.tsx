import { InstallationProvider } from "@/components/installations/installation-store";

export default function InstallationsLayout({ children }: { children: React.ReactNode }) {
  return <InstallationProvider>{children}</InstallationProvider>;
}
