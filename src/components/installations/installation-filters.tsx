"use client";

import { useState } from "react";
import { SlidersHorizontal } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  INSTALLATION_PRIORITIES,
  INSTALLATION_PRIORITY_LABEL,
  INSTALLATION_STATUSES,
  INSTALLATION_STATUS_LABEL,
  READINESS_LABEL,
  READINESS_STATES,
  type InstallationPriority,
  type InstallationStatus,
  type ReadinessState,
} from "@/data/installations";

export type InstallationFilterState = {
  query: string;
  status: InstallationStatus | "ALL";
  customer: string;
  technician: string;
  priority: InstallationPriority | "ALL";
  readiness: ReadinessState | "ALL";
  risk: "ALL" | "YES" | "NO";
  scheduled: "ALL" | "WEEK" | "MONTH" | "NEXT14" | "PAST";
  sort: "date" | "priority" | "updated" | "customer" | "readiness";
};

const selectClass =
  "h-8 rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50";

export function InstallationFilters({
  filters,
  customers,
  technicians,
  onChange,
}: {
  filters: InstallationFilterState;
  customers: string[];
  technicians: string[];
  onChange: (next: InstallationFilterState) => void;
}) {
  const [open, setOpen] = useState(false);
  const fields = (
    <>
      <Input
        value={filters.query}
        onChange={(event) => onChange({ ...filters, query: event.target.value })}
        placeholder="Search installations"
        aria-label="Search installations"
        className="md:max-w-56"
      />
      <select className={selectClass} aria-label="Status" value={filters.status} onChange={(event) => onChange({ ...filters, status: event.target.value as InstallationFilterState["status"] })}>
        <option value="ALL">All statuses</option>
        {INSTALLATION_STATUSES.map((status) => (
          <option key={status} value={status}>{INSTALLATION_STATUS_LABEL[status]}</option>
        ))}
      </select>
      <select className={selectClass} aria-label="Customer" value={filters.customer} onChange={(event) => onChange({ ...filters, customer: event.target.value })}>
        <option value="ALL">All customers</option>
        {customers.map((customer) => (
          <option key={customer} value={customer}>{customer}</option>
        ))}
      </select>
      <select className={selectClass} aria-label="Technician" value={filters.technician} onChange={(event) => onChange({ ...filters, technician: event.target.value })}>
        <option value="ALL">All technicians</option>
        {technicians.map((technician) => (
          <option key={technician} value={technician}>{technician}</option>
        ))}
      </select>
      <select className={selectClass} aria-label="Priority" value={filters.priority} onChange={(event) => onChange({ ...filters, priority: event.target.value as InstallationFilterState["priority"] })}>
        <option value="ALL">All priorities</option>
        {INSTALLATION_PRIORITIES.map((priority) => (
          <option key={priority} value={priority}>{INSTALLATION_PRIORITY_LABEL[priority]}</option>
        ))}
      </select>
      <select className={selectClass} aria-label="Readiness" value={filters.readiness} onChange={(event) => onChange({ ...filters, readiness: event.target.value as InstallationFilterState["readiness"] })}>
        <option value="ALL">All readiness</option>
        {READINESS_STATES.map((state) => (
          <option key={state} value={state}>{READINESS_LABEL[state]}</option>
        ))}
      </select>
      <select className={selectClass} aria-label="Risk" value={filters.risk} onChange={(event) => onChange({ ...filters, risk: event.target.value as InstallationFilterState["risk"] })}>
        <option value="ALL">All risk</option>
        <option value="YES">Has risk</option>
        <option value="NO">No risk</option>
      </select>
      <select className={selectClass} aria-label="Scheduled date" value={filters.scheduled} onChange={(event) => onChange({ ...filters, scheduled: event.target.value as InstallationFilterState["scheduled"] })}>
        <option value="ALL">Any date</option>
        <option value="WEEK">This week</option>
        <option value="MONTH">This month</option>
        <option value="NEXT14">Next 14 days</option>
        <option value="PAST">Past</option>
      </select>
      <select className={selectClass} aria-label="Sort installations" value={filters.sort} onChange={(event) => onChange({ ...filters, sort: event.target.value as InstallationFilterState["sort"] })}>
        <option value="date">Scheduled date</option>
        <option value="priority">Priority</option>
        <option value="updated">Recently updated</option>
        <option value="customer">Customer</option>
        <option value="readiness">Readiness</option>
      </select>
    </>
  );

  return (
    <section className="min-w-0">
      <div className="mb-2 flex items-center justify-between md:hidden">
        <h2 className="text-sm font-medium">Installations</h2>
        <Button type="button" variant="outline" size="sm" onClick={() => setOpen((current) => !current)}>
          <SlidersHorizontal />
          Filters
        </Button>
      </div>
      <div className={open ? "flex flex-col gap-2" : "hidden md:flex md:flex-wrap md:items-center md:gap-2"}>{fields}</div>
    </section>
  );
}
