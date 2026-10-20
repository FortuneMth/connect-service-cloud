"use client";

import { useState } from "react";
import { SlidersHorizontal } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  ACCESS_TYPES,
  HEALTH_LABEL,
  HEALTH_STATES,
  SERVICE_STATUSES,
  SERVICE_STATUS_LABEL,
  type AccessType,
  type HealthState,
  type ServiceStatus,
} from "@/data/services";

export type ServiceFilterState = {
  query: string;
  status: ServiceStatus | "ALL";
  customer: string;
  health: HealthState | "ALL";
  access: AccessType | "ALL";
  sort: "customer" | "updated" | "monthly" | "status" | "activated";
};

const selectClass =
  "h-8 rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50";

export function ServiceFilters({
  filters,
  customers,
  onChange,
}: {
  filters: ServiceFilterState;
  customers: string[];
  onChange: (next: ServiceFilterState) => void;
}) {
  const [open, setOpen] = useState(false);
  const fields = (
    <>
      <Input
        value={filters.query}
        onChange={(event) => onChange({ ...filters, query: event.target.value })}
        placeholder="Search services"
        aria-label="Search services"
        className="md:max-w-56"
      />
      <select className={selectClass} aria-label="Status" value={filters.status} onChange={(event) => onChange({ ...filters, status: event.target.value as ServiceFilterState["status"] })}>
        <option value="ALL">All statuses</option>
        {SERVICE_STATUSES.map((status) => (
          <option key={status} value={status}>{SERVICE_STATUS_LABEL[status]}</option>
        ))}
      </select>
      <select className={selectClass} aria-label="Customer" value={filters.customer} onChange={(event) => onChange({ ...filters, customer: event.target.value })}>
        <option value="ALL">All customers</option>
        {customers.map((customer) => (
          <option key={customer} value={customer}>{customer}</option>
        ))}
      </select>
      <select className={selectClass} aria-label="Health" value={filters.health} onChange={(event) => onChange({ ...filters, health: event.target.value as ServiceFilterState["health"] })}>
        <option value="ALL">All health</option>
        {HEALTH_STATES.map((health) => (
          <option key={health} value={health}>{HEALTH_LABEL[health]}</option>
        ))}
      </select>
      <select className={selectClass} aria-label="Access" value={filters.access} onChange={(event) => onChange({ ...filters, access: event.target.value as ServiceFilterState["access"] })}>
        <option value="ALL">All access</option>
        {ACCESS_TYPES.map((access) => (
          <option key={access} value={access}>{access}</option>
        ))}
      </select>
      <select className={selectClass} aria-label="Sort services" value={filters.sort} onChange={(event) => onChange({ ...filters, sort: event.target.value as ServiceFilterState["sort"] })}>
        <option value="customer">Customer</option>
        <option value="updated">Recently updated</option>
        <option value="monthly">Monthly charge</option>
        <option value="status">Status</option>
        <option value="activated">Activated</option>
      </select>
    </>
  );

  return (
    <section className="min-w-0">
      <div className="mb-2 flex items-center justify-between md:hidden">
        <h2 className="text-sm font-medium">Services</h2>
        <Button type="button" variant="outline" size="sm" onClick={() => setOpen((current) => !current)}>
          <SlidersHorizontal />
          Filters
        </Button>
      </div>
      <div className={open ? "flex flex-col gap-2" : "hidden md:flex md:flex-wrap md:items-center md:gap-2"}>{fields}</div>
    </section>
  );
}
