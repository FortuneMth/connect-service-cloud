"use client";

import type { ReactNode } from "react";
import { Search, SlidersHorizontal } from "lucide-react";
import { useState } from "react";
import { cn } from "cn";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  ACCOUNT_OWNERS,
  CUSTOMER_STATUS_LABEL,
  CUSTOMER_TYPE_LABEL,
  type CustomerStatus,
  type CustomerType,
} from "@/data/customers";

export type CustomerSort = "updated" | "name" | "mrr" | "services";

export type CustomerFilterState = {
  query: string;
  type: CustomerType | "ALL";
  status: CustomerStatus | "ALL";
  owner: string;
  sort: CustomerSort;
};

const selectClass =
  "h-8 rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50";

export function CustomerFilters({
  value,
  onChange,
}: {
  value: CustomerFilterState;
  onChange: (next: CustomerFilterState) => void;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex min-w-0 flex-col gap-2">
      <div className="flex min-w-0 gap-2">
        <div className="relative min-w-0 flex-1">
          <Search className="pointer-events-none absolute top-1/2 left-2.5 size-3.5 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={value.query}
            onChange={(event) => onChange({ ...value, query: event.target.value })}
            placeholder="Search customers, contacts, or numbers"
            aria-label="Search customers"
            className="pl-8"
          />
        </div>
        <Button
          type="button"
          variant="outline"
          className="md:hidden"
          aria-expanded={open}
          onClick={() => setOpen((current) => !current)}
        >
          <SlidersHorizontal />
          Filters
        </Button>
      </div>
      <div className={cn("flex flex-wrap gap-2", open ? "flex" : "hidden md:flex")}>
        <FilterSelect
          label="Customer type"
          value={value.type}
          onChange={(type) => onChange({ ...value, type: type as CustomerFilterState["type"] })}
        >
          <option value="ALL">All types</option>
          {Object.entries(CUSTOMER_TYPE_LABEL).map(([type, label]) => (
            <option key={type} value={type}>
              {label}
            </option>
          ))}
        </FilterSelect>
        <FilterSelect
          label="Status"
          value={value.status}
          onChange={(status) => onChange({ ...value, status: status as CustomerFilterState["status"] })}
        >
          <option value="ALL">All statuses</option>
          {Object.entries(CUSTOMER_STATUS_LABEL).map(([status, label]) => (
            <option key={status} value={status}>
              {label}
            </option>
          ))}
        </FilterSelect>
        <FilterSelect
          label="Account owner"
          value={value.owner}
          onChange={(owner) => onChange({ ...value, owner })}
        >
          <option value="ALL">All owners</option>
          {ACCOUNT_OWNERS.map((owner) => (
            <option key={owner.id} value={owner.name}>
              {owner.name}
            </option>
          ))}
        </FilterSelect>
        <FilterSelect
          label="Sort by"
          value={value.sort}
          onChange={(sort) => onChange({ ...value, sort: sort as CustomerSort })}
        >
          <option value="updated">Recently updated</option>
          <option value="name">Customer name</option>
          <option value="mrr">MRR</option>
          <option value="services">Active services</option>
        </FilterSelect>
      </div>
    </div>
  );
}

function FilterSelect({
  label,
  value,
  onChange,
  children,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  children: ReactNode;
}) {
  return (
    <select
      aria-label={label}
      className={selectClass}
      value={value}
      onChange={(event) => onChange(event.target.value)}
    >
      {children}
    </select>
  );
}
