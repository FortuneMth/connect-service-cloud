"use client";

import { useState } from "react";
import { SlidersHorizontal } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { QUOTE_STATUS_LABEL, QUOTE_STATUSES, QUOTE_TYPE_LABEL, type QuoteStatus, type QuoteType } from "@/data/quotes";

export type QuoteFilterState = {
  query: string;
  status: QuoteStatus | "ALL";
  type: QuoteType | "ALL";
  owner: string;
  customer: string;
  validUntil: "ALL" | "DAYS_14" | "MONTH" | "QUARTER" | "PAST";
  valueRange: "ALL" | "UNDER_500" | "FROM_500" | "FROM_1000" | "OVER_2000";
  sort: "updated" | "total" | "validUntil" | "customer" | "mrr";
};

const selectClass =
  "h-8 rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50";

export function QuoteFilters({
  filters,
  owners,
  customers,
  onChange,
}: {
  filters: QuoteFilterState;
  owners: string[];
  customers: string[];
  onChange: (filters: QuoteFilterState) => void;
}) {
  const [open, setOpen] = useState(false);
  const set = (patch: Partial<QuoteFilterState>) => onChange({ ...filters, ...patch });

  return (
    <div className="flex min-w-0 flex-col gap-2">
      <div className="flex min-w-0 gap-2">
        <Input
          value={filters.query}
          onChange={(event) => set({ query: event.target.value })}
          placeholder="Search quotes, customers, or opportunities"
          aria-label="Search quotes"
          className="min-w-0"
        />
        <Button type="button" variant="outline" size="sm" className="md:hidden" onClick={() => setOpen((value) => !value)}>
          <SlidersHorizontal />
          Filters
        </Button>
      </div>
      <div className={open ? "flex flex-wrap gap-2" : "hidden flex-wrap gap-2 md:flex"}>
        <select className={selectClass} aria-label="Status" value={filters.status} onChange={(event) => set({ status: event.target.value as QuoteFilterState["status"] })}>
          <option value="ALL">All statuses</option>
          {QUOTE_STATUSES.map((status) => (
            <option key={status} value={status}>
              {QUOTE_STATUS_LABEL[status]}
            </option>
          ))}
        </select>
        <select className={selectClass} aria-label="Quote type" value={filters.type} onChange={(event) => set({ type: event.target.value as QuoteFilterState["type"] })}>
          <option value="ALL">All types</option>
          {(Object.keys(QUOTE_TYPE_LABEL) as QuoteType[]).map((type) => (
            <option key={type} value={type}>
              {QUOTE_TYPE_LABEL[type]}
            </option>
          ))}
        </select>
        <select className={selectClass} aria-label="Owner" value={filters.owner} onChange={(event) => set({ owner: event.target.value })}>
          <option value="ALL">All owners</option>
          {owners.map((owner) => (
            <option key={owner} value={owner}>
              {owner}
            </option>
          ))}
        </select>
        <select className={selectClass} aria-label="Customer" value={filters.customer} onChange={(event) => set({ customer: event.target.value })}>
          <option value="ALL">All customers</option>
          {customers.map((customer) => (
            <option key={customer} value={customer}>
              {customer}
            </option>
          ))}
        </select>
        <select className={selectClass} aria-label="Valid until" value={filters.validUntil} onChange={(event) => set({ validUntil: event.target.value as QuoteFilterState["validUntil"] })}>
          <option value="ALL">Any validity</option>
          <option value="DAYS_14">Next 14 days</option>
          <option value="MONTH">This month</option>
          <option value="QUARTER">This quarter</option>
          <option value="PAST">Past validity</option>
        </select>
        <select className={selectClass} aria-label="Value range" value={filters.valueRange} onChange={(event) => set({ valueRange: event.target.value as QuoteFilterState["valueRange"] })}>
          <option value="ALL">Any value</option>
          <option value="UNDER_500">Under R 500,000</option>
          <option value="FROM_500">R 500,000 – R 1,000,000</option>
          <option value="FROM_1000">R 1,000,000 – R 2,000,000</option>
          <option value="OVER_2000">Over R 2,000,000</option>
        </select>
        <select className={selectClass} aria-label="Sort quotes" value={filters.sort} onChange={(event) => set({ sort: event.target.value as QuoteFilterState["sort"] })}>
          <option value="updated">Recently updated</option>
          <option value="total">Total value</option>
          <option value="validUntil">Valid until</option>
          <option value="customer">Customer</option>
          <option value="mrr">MRR</option>
        </select>
      </div>
    </div>
  );
}
