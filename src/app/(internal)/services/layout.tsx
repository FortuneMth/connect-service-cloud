import { ServiceProvider } from "@/components/services/service-store";

export default function ServicesLayout({ children }: { children: React.ReactNode }) {
  return <ServiceProvider>{children}</ServiceProvider>;
}
