"use client";

import { useState } from "react";
import { SlidersHorizontal } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DELIVERY_STAGES,
  DELIVERY_STAGE_LABEL,
  TASK_PRIORITIES,
  TASK_PRIORITY_LABEL,
  TASK_STATUSES,
  TASK_STATUS_LABEL,
  type DeliveryStage,
  type TaskPriority,
  type TaskStatus,
} from "@/data/service-delivery";

export type DeliveryFilterState = {
  query: string;
  stage: DeliveryStage | "ALL";
  status: TaskStatus | "ALL";
  priority: TaskPriority | "ALL";
  owner: string;
  customer: string;
  due: "ALL" | "TODAY" | "WEEK" | "MONTH" | "OVERDUE";
  atRisk: "ALL" | "YES";
  blocked: "ALL" | "YES";
  sort: "due" | "priority" | "updated" | "customer" | "stage";
};

const selectClass =
  "h-8 rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50";

export function DeliveryFilters({
  filters,
  owners,
  customers,
  onChange,
}: {
  filters: DeliveryFilterState;
  owners: string[];
  customers: string[];
  onChange: (filters: DeliveryFilterState) => void;
}) {
  const [open, setOpen] = useState(false);
  const set = (patch: Partial<DeliveryFilterState>) => onChange({ ...filters, ...patch });

  return (
    <div className="flex min-w-0 flex-col gap-2">
      <div className="flex min-w-0 gap-2">
        <Input
          value={filters.query}
          onChange={(event) => set({ query: event.target.value })}
          placeholder="Search orders, customers, or work items"
          aria-label="Search delivery work"
          className="min-w-0"
        />
        <Button type="button" variant="outline" size="sm" className="md:hidden" onClick={() => setOpen((current) => !current)}>
          <SlidersHorizontal />
          Filters
        </Button>
      </div>
      <div className={open ? "flex min-w-0 flex-wrap gap-2" : "hidden min-w-0 flex-wrap gap-2 md:flex"}>
        <select aria-label="Delivery stage" className={selectClass} value={filters.stage} onChange={(event) => set({ stage: event.target.value as DeliveryFilterState["stage"] })}>
          <option value="ALL">All stages</option>
          {DELIVERY_STAGES.map((stage) => (
            <option key={stage} value={stage}>{DELIVERY_STAGE_LABEL[stage]}</option>
          ))}
        </select>
        <select aria-label="Work status" className={selectClass} value={filters.status} onChange={(event) => set({ status: event.target.value as DeliveryFilterState["status"] })}>
          <option value="ALL">All statuses</option>
          {TASK_STATUSES.map((status) => (
            <option key={status} value={status}>{TASK_STATUS_LABEL[status]}</option>
          ))}
        </select>
        <select aria-label="Priority" className={selectClass} value={filters.priority} onChange={(event) => set({ priority: event.target.value as DeliveryFilterState["priority"] })}>
          <option value="ALL">All priorities</option>
          {TASK_PRIORITIES.map((priority) => (
            <option key={priority} value={priority}>{TASK_PRIORITY_LABEL[priority]}</option>
          ))}
        </select>
        <select aria-label="Owner" className={selectClass} value={filters.owner} onChange={(event) => set({ owner: event.target.value })}>
          <option value="ALL">All owners</option>
          {owners.map((owner) => (
            <option key={owner} value={owner}>{owner}</option>
          ))}
        </select>
        <select aria-label="Customer" className={selectClass} value={filters.customer} onChange={(event) => set({ customer: event.target.value })}>
          <option value="ALL">All customers</option>
          {customers.map((customer) => (
            <option key={customer} value={customer}>{customer}</option>
          ))}
        </select>
        <select aria-label="Due date" className={selectClass} value={filters.due} onChange={(event) => set({ due: event.target.value as DeliveryFilterState["due"] })}>
          <option value="ALL">Any due date</option>
          <option value="TODAY">Due today</option>
          <option value="WEEK">Next 7 days</option>
          <option value="MONTH">This month</option>
          <option value="OVERDUE">Overdue</option>
        </select>
        <select aria-label="At risk" className={selectClass} value={filters.atRisk} onChange={(event) => set({ atRisk: event.target.value as DeliveryFilterState["atRisk"] })}>
          <option value="ALL">All work</option>
          <option value="YES">At risk</option>
        </select>
        <select aria-label="Blocked" className={selectClass} value={filters.blocked} onChange={(event) => set({ blocked: event.target.value as DeliveryFilterState["blocked"] })}>
          <option value="ALL">Blocked or not</option>
          <option value="YES">Blocked</option>
        </select>
        <select aria-label="Sort delivery work" className={selectClass} value={filters.sort} onChange={(event) => set({ sort: event.target.value as DeliveryFilterState["sort"] })}>
          <option value="due">Due date</option>
          <option value="priority">Priority</option>
          <option value="updated">Recently updated</option>
          <option value="customer">Customer</option>
          <option value="stage">Stage</option>
        </select>
      </div>
    </div>
  );
}
