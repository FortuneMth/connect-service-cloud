"use client";

import { useRouter } from "next/navigation";

import { CustomerStatusBadge } from "@/components/customers/customer-status-badge";
import { Button } from "@/components/ui/button";
import {
  CUSTOMER_TYPE_LABEL,
  formatRand,
  type CustomerRecord,
} from "@/data/customers";

export function CustomerTable({
  customers,
  onEdit,
}: {
  customers: CustomerRecord[];
  onEdit: (customer: CustomerRecord) => void;
}) {
  const router = useRouter();

  if (customers.length === 0) {
    return (
      <div className="rounded-lg border bg-card px-4 py-10 text-center">
        <p className="text-sm font-medium">No customers match these filters</p>
        <p className="mt-1 text-xs text-muted-foreground">Adjust the search or filter values.</p>
      </div>
    );
  }

  return (
    <>
      <div className="hidden min-w-0 overflow-hidden rounded-lg border bg-card md:block">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[860px] text-sm xl:min-w-[1100px]">
            <thead>
              <tr className="border-b text-left text-xs text-muted-foreground">
                <th className="px-4 py-2 font-medium">Customer</th>
                <th className="px-4 py-2 font-medium">Customer Number</th>
                <th className="px-4 py-2 font-medium">Type</th>
                <th className="px-4 py-2 font-medium">Status</th>
                <th className="hidden px-4 py-2 font-medium xl:table-cell">Primary Contact</th>
                <th className="px-4 py-2 font-medium">Sites</th>
                <th className="px-4 py-2 font-medium">Active Services</th>
                <th className="px-4 py-2 font-medium">MRR</th>
                <th className="hidden px-4 py-2 font-medium lg:table-cell">Account Owner</th>
                <th className="hidden px-4 py-2 font-medium xl:table-cell">Last Activity</th>
                <th className="px-4 py-2 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {customers.map((customer) => (
                <tr
                  key={customer.id}
                  className="cursor-pointer border-b last:border-b-0 hover:bg-muted/40"
                  onClick={() => router.push(`/customers/${customer.id}`)}
                >
                  <td className="px-4 py-2.5 font-medium whitespace-nowrap">{customer.name}</td>
                  <td className="px-4 py-2.5 whitespace-nowrap text-muted-foreground tabular-nums">
                    {customer.customerNumber}
                  </td>
                  <td className="px-4 py-2.5 whitespace-nowrap">{CUSTOMER_TYPE_LABEL[customer.type]}</td>
                  <td className="px-4 py-2.5">
                    <CustomerStatusBadge status={customer.status} />
                  </td>
                  <td className="hidden px-4 py-2.5 whitespace-nowrap xl:table-cell">
                    {customer.primaryContact.name}
                  </td>
                  <td className="px-4 py-2.5 tabular-nums">{customer.siteCount}</td>
                  <td className="px-4 py-2.5 tabular-nums">{customer.serviceCount}</td>
                  <td className="px-4 py-2.5 whitespace-nowrap tabular-nums">
                    {formatRand(customer.monthlyRecurringRevenue)}
                  </td>
                  <td className="hidden px-4 py-2.5 whitespace-nowrap lg:table-cell">
                    {customer.accountOwner.name}
                  </td>
                  <td className="hidden px-4 py-2.5 whitespace-nowrap text-muted-foreground xl:table-cell">
                    {customer.lastActivityLabel}
                  </td>
                  <td className="px-4 py-2.5">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={(event) => {
                        event.stopPropagation();
                        onEdit(customer);
                      }}
                    >
                      Edit
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <ul className="flex flex-col gap-3 md:hidden">
        {customers.map((customer) => (
          <li key={customer.id}>
            <article className="rounded-lg border bg-card p-4">
              <button
                type="button"
                className="w-full text-left"
                onClick={() => router.push(`/customers/${customer.id}`)}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="font-medium">{customer.name}</p>
                    <p className="text-xs text-muted-foreground tabular-nums">{customer.customerNumber}</p>
                  </div>
                  <CustomerStatusBadge status={customer.status} />
                </div>
                <dl className="mt-3 grid grid-cols-2 gap-x-3 gap-y-2 text-sm">
                  <div>
                    <dt className="text-xs text-muted-foreground">Type</dt>
                    <dd>{CUSTOMER_TYPE_LABEL[customer.type]}</dd>
                  </div>
                  <div>
                    <dt className="text-xs text-muted-foreground">MRR</dt>
                    <dd className="tabular-nums">{formatRand(customer.monthlyRecurringRevenue)}</dd>
                  </div>
                  <div>
                    <dt className="text-xs text-muted-foreground">Sites</dt>
                    <dd className="tabular-nums">{customer.siteCount}</dd>
                  </div>
                  <div>
                    <dt className="text-xs text-muted-foreground">Services</dt>
                    <dd className="tabular-nums">{customer.serviceCount}</dd>
                  </div>
                  <div>
                    <dt className="text-xs text-muted-foreground">Owner</dt>
                    <dd>{customer.accountOwner.name}</dd>
                  </div>
                  <div>
                    <dt className="text-xs text-muted-foreground">Last activity</dt>
                    <dd>{customer.lastActivityLabel}</dd>
                  </div>
                </dl>
              </button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="mt-3"
                onClick={() => onEdit(customer)}
              >
                Edit
              </Button>
            </article>
          </li>
        ))}
      </ul>
    </>
  );
}
