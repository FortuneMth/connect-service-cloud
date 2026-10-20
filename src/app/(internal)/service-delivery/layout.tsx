import { DeliveryProvider } from "@/components/service-delivery/delivery-store";

export default function ServiceDeliveryLayout({ children }: { children: React.ReactNode }) {
  return <DeliveryProvider>{children}</DeliveryProvider>;
}
