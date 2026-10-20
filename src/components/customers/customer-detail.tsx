"use client";

import { useState } from "react";
import Link from "next/link";

import { CustomerActivity } from "@/components/customers/customer-activity";
import { CustomerDetailHeader } from "@/components/customers/customer-detail-header";
import { CustomerDocuments } from "@/components/customers/customer-documents";
import { CustomerOrders } from "@/components/customers/customer-orders";
import { CustomerOverview } from "@/components/customers/customer-overview";
import { CustomerQuotes } from "@/components/customers/customer-quotes";
import { CustomerServices } from "@/components/customers/customer-services";
import { CustomerSites } from "@/components/customers/customer-sites";
import { useCustomers } from "@/components/customers/customer-store";
import { Button } from "@/components/ui/button";

const tabs = [
  { id: "overview", label: "Overview" },
  { id: "sites", label: "Sites" },
  { id: "services", label: "Services" },
  { id: "orders", label: "Orders" },
  { id: "quotes", label: "Quotes" },
  { id: "documents", label: "Documents" },
  { id: "activity", label: "Activity" },
] as const;

type TabId = (typeof tabs)[number]["id"];

export function CustomerDetail({ id }: { id: string }) {
  const { customers } = useCustomers();
  const customer = customers.find((item) => item.id === id);
  const [tab, setTab] = useState<TabId>("overview");

  if (!customer) {
    return (
      <div className="rounded-lg border bg-card px-4 py-10">
        <h1 className="text-lg font-semibold">Customer not found</h1>
        <p className="mt-1 text-sm text-muted-foreground">This customer is not in the current session.</p>
        <Button className="mt-4" render={<Link href="/customers" />}>
          Back to customers
        </Button>
      </div>
    );
  }

  return (
    <div className="flex min-w-0 flex-col gap-6">
      <CustomerDetailHeader customer={customer} />
      <div className="flex gap-1 overflow-x-auto border-b" role="tablist" aria-label="Customer sections">
        {tabs.map((item) => (
          <button
            key={item.id}
            type="button"
            role="tab"
            aria-selected={tab === item.id}
            className={`shrink-0 border-b-2 px-3 py-2 text-sm ${
              tab === item.id
                ? "border-foreground font-medium text-foreground"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
            onClick={() => setTab(item.id)}
          >
            {item.label}
          </button>
        ))}
      </div>
      {tab === "overview" ? <CustomerOverview customer={customer} /> : null}
      {tab === "sites" ? <CustomerSites customer={customer} /> : null}
      {tab === "services" ? <CustomerServices customer={customer} /> : null}
      {tab === "orders" ? <CustomerOrders customer={customer} /> : null}
      {tab === "quotes" ? <CustomerQuotes customer={customer} /> : null}
      {tab === "documents" ? <CustomerDocuments customer={customer} /> : null}
      {tab === "activity" ? <CustomerActivity customer={customer} /> : null}
    </div>
  );
}
