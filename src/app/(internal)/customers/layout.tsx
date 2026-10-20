import { CustomerProvider } from "@/components/customers/customer-store";

export default function CustomersLayout({ children }: { children: React.ReactNode }) {
  return <CustomerProvider>{children}</CustomerProvider>;
}
