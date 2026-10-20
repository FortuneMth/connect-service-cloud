import type { Metadata } from "next";

import { CustomerWorkspace } from "@/components/customers/customer-workspace";

export const metadata: Metadata = {
  title: "Customers",
};

export default function CustomersPage() {
  return <CustomerWorkspace />;
}
