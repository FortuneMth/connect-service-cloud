import Link from "next/link";

import { QuotePanel } from "@/components/quotes/quote-panel";
import type { QuoteRecord } from "@/data/quotes";

export function QuoteCustomerCard({ quote }: { quote: QuoteRecord }) {
  const customer = quote.customer;

  return (
    <QuotePanel title="Customer">
      <dl className="grid gap-3 px-4 py-3 text-sm sm:grid-cols-2">
        <div className="min-w-0 sm:col-span-2">
          <dt className="text-xs text-muted-foreground">Customer</dt>
          <dd className="mt-0.5">
            <Link href={`/customers/${customer.id}`} className="font-medium underline-offset-4 hover:underline">
              {customer.name}
            </Link>
          </dd>
        </div>
        <Fact label="Customer number" value={customer.customerNumber} />
        <Fact label="Primary contact" value={customer.primaryContact.name} />
        <Fact label="Email" value={customer.primaryContact.email} />
        <Fact label="Phone" value={customer.primaryContact.phone} />
        <Fact label="Billing contact" value={customer.billingContact.name} />
      </dl>
    </QuotePanel>
  );
}

function Fact({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-0">
      <dt className="text-xs text-muted-foreground">{label}</dt>
      <dd className="mt-0.5 break-words">{value}</dd>
    </div>
  );
}
