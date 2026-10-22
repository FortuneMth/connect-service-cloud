import { PortalDeliveryProvider } from "@/components/portal/portal-delivery-store";
import { DeliveryProvider } from "@/components/service-delivery/delivery-store";

export default function ServiceDeliveryLayout({ children }: { children: React.ReactNode }) {
  return (
    <DeliveryProvider>
      <PortalDeliveryProvider>{children}</PortalDeliveryProvider>
    </DeliveryProvider>
  );
}
