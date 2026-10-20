"use client";

import { useState } from "react";
import { SlidersHorizontal } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  ORDER_PRIORITIES,
  ORDER_PRIORITY_LABEL,
  ORDER_STATUSES,
  ORDER_STATUS_LABEL,
  ORDER_TYPES,
  ORDER_TYPE_LABEL,
  type OrderPriority,
  type OrderStatus,
  type OrderType,
} from "@/data/orders";

export type OrderFilterState = {
  query: string;
  status: OrderStatus | "ALL";
  type: OrderType | "ALL";
  priority: OrderPriority | "ALL";
  customer: string;
  owner: string;
  targetActivation: "ALL" | "DAYS_14" | "MONTH" | "QUARTER" | "PAST";
  atRisk: "ALL" | "YES";
  sort: "updated" | "target" | "value" | "customer" | "priority";
};

const selectClass =
  "h-8 rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50";

export function OrderFilters({
  filters,
  owners,
  customers,
  onChange,
}: {
  filters: OrderFilterState;
  owners: string[];
  customers: string[];
  onChange: (filters: OrderFilterState) => void;
}) {
  const [open, setOpen] = useState(false);
  const set = (patch: Partial<OrderFilterState>) => onChange({ ...filters, ...patch });

  return (
    <div className="flex min-w-0 flex-col gap-2">
      <div className="flex min-w-0 gap-2">
        <Input
          value={filters.query}
          onChange={(event) => set({ query: event.target.value })}
          placeholder="Search orders, customers, or products"
          aria-label="Search orders"
          className="min-w-0"
        />
        <Button type="button" variant="outline" size="sm" className="md:hidden" onClick={() => setOpen((current) => !current)}>
          <SlidersHorizontal />
          Filters
        </Button>
      </div>
      <div className={open ? "flex min-w-0 flex-wrap gap-2" : "hidden min-w-0 flex-wrap gap-2 md:flex"}>
        <select
          aria-label="Status"
          className={selectClass}
          value={filters.status}
          onChange={(event) => set({ status: event.target.value as OrderFilterState["status"] })}
        >
          <option value="ALL">All statuses</option>
          {ORDER_STATUSES.map((status) => (
            <option key={status} value={status}>
              {ORDER_STATUS_LABEL[status]}
            </option>
          ))}
        </select>
        <select
          aria-label="Order type"
          className={selectClass}
          value={filters.type}
          onChange={(event) => set({ type: event.target.value as OrderFilterState["type"] })}
        >
          <option value="ALL">All types</option>
          {ORDER_TYPES.map((type) => (
            <option key={type} value={type}>
              {ORDER_TYPE_LABEL[type]}
            </option>
          ))}
        </select>
        <select
          aria-label="Priority"
          className={selectClass}
          value={filters.priority}
          onChange={(event) => set({ priority: event.target.value as OrderFilterState["priority"] })}
        >
          <option value="ALL">All priorities</option>
          {ORDER_PRIORITIES.map((priority) => (
            <option key={priority} value={priority}>
              {ORDER_PRIORITY_LABEL[priority]}
            </option>
          ))}
        </select>
        <select
          aria-label="Customer"
          className={selectClass}
          value={filters.customer}
          onChange={(event) => set({ customer: event.target.value })}
        >
          <option value="ALL">All customers</option>
          {customers.map((customer) => (
            <option key={customer} value={customer}>
              {customer}
            </option>
          ))}
        </select>
        <select
          aria-label="Owner"
          className={selectClass}
          value={filters.owner}
          onChange={(event) => set({ owner: event.target.value })}
        >
          <option value="ALL">All owners</option>
          {owners.map((owner) => (
            <option key={owner} value={owner}>
              {owner}
            </option>
          ))}
        </select>
        <select
          aria-label="Target activation"
          className={selectClass}
          value={filters.targetActivation}
          onChange={(event) => set({ targetActivation: event.target.value as OrderFilterState["targetActivation"] })}
        >
          <option value="ALL">Any target date</option>
          <option value="DAYS_14">Next 14 days</option>
          <option value="MONTH">This month</option>
          <option value="QUARTER">This quarter</option>
          <option value="PAST">Past target</option>
        </select>
        <select
          aria-label="At risk"
          className={selectClass}
          value={filters.atRisk}
          onChange={(event) => set({ atRisk: event.target.value as OrderFilterState["atRisk"] })}
        >
          <option value="ALL">All orders</option>
          <option value="YES">At risk</option>
        </select>
        <select
          aria-label="Sort orders"
          className={selectClass}
          value={filters.sort}
          onChange={(event) => set({ sort: event.target.value as OrderFilterState["sort"] })}
        >
          <option value="updated">Recently updated</option>
          <option value="target">Target activation</option>
          <option value="value">Order value</option>
          <option value="customer">Customer</option>
          <option value="priority">Priority</option>
        </select>
      </div>
    </div>
  );
}
