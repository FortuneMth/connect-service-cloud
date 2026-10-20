import { OrderProvider } from "@/components/orders/order-store";

export default function OrdersLayout({ children }: { children: React.ReactNode }) {
  return <OrderProvider>{children}</OrderProvider>;
}
