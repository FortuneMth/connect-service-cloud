import Link from "next/link";

import { SalesPanel } from "@/components/sales/sales-panel";
import { formatRand } from "@/data/customers";
import { OPPORTUNITY_TYPE_LABEL, type OpportunityRecord } from "@/data/sales";

export function OpportunityCustomerCard({ opportunity }: { opportunity: OpportunityRecord }) {
  const customer = opportunity.customer;

  return (
    <SalesPanel title="Customer">
      <dl className="grid gap-3 px-4 py-3 text-sm sm:grid-cols-2">
        <div className="min-w-0 sm:col-span-2">
          <dt className="text-xs text-muted-foreground">Customer name</dt>
          <dd className="mt-0.5">
            <Link href={`/customers/${customer.id}`} className="font-medium underline-offset-4 hover:underline">
              {customer.name}
            </Link>
          </dd>
        </div>
        <Fact label="Customer number" value={customer.customerNumber} />
        <Fact label="Type" value={OPPORTUNITY_TYPE_LABEL[customer.type]} />
        <Fact label="Account owner" value={customer.accountOwnerName} />
        <Fact label="Sites" value={String(customer.siteCount)} />
        <Fact label="Active services" value={String(customer.serviceCount)} />
        <Fact label="Current MRR" value={formatRand(customer.monthlyRecurringRevenue)} />
      </dl>
    </SalesPanel>
  );
}

function Fact({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-0">
      <dt className="text-xs text-muted-foreground">{label}</dt>
      <dd className="mt-0.5 break-words tabular-nums">{value}</dd>
    </div>
  );
}
