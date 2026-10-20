import type { Metadata } from "next";

import { CustomerDetail } from "@/components/customers/customer-detail";
import { demoCustomers, getDemoCustomer } from "@/data/customers";

export function generateStaticParams() {
  return demoCustomers.map((customer) => ({ id: customer.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const customer = getDemoCustomer(id);

  return {
    title: customer?.name ?? "Customer",
  };
}

export default async function CustomerDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return <CustomerDetail id={id} />;
}
