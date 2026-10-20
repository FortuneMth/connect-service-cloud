import { CustomerPanel } from "@/components/customers/customer-panel";
import { formatRand, type CustomerRecord } from "@/data/customers";

export function CustomerOverview({ customer }: { customer: CustomerRecord }) {
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <CustomerPanel title="Customer information">
        <dl className="grid gap-3 px-4 py-3 text-sm sm:grid-cols-2">
          <Fact label="Customer number" value={customer.customerNumber} />
          <Fact label="Industry" value={customer.industry} />
          <Fact label="Customer since" value={customer.customerSince} />
          <Fact label="Payment terms" value={customer.paymentTerms} />
          <Fact label="Sites" value={String(customer.siteCount)} />
          <Fact label="Active services" value={String(customer.serviceCount)} />
          <Fact label="Current MRR" value={formatRand(customer.monthlyRecurringRevenue)} />
        </dl>
      </CustomerPanel>
      <CustomerPanel title="Contacts">
        <dl className="grid gap-4 px-4 py-3 text-sm">
          <Fact
            label="Primary contact"
            value={`${customer.primaryContact.name} · ${customer.primaryContact.email} · ${customer.primaryContact.phone}`}
          />
          <Fact
            label="Billing contact"
            value={`${customer.billingContact.name} · ${customer.billingContact.email} · ${customer.billingContact.phone}`}
          />
          <Fact label="Account owner" value={customer.accountOwner.name} />
        </dl>
      </CustomerPanel>
    </div>
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
