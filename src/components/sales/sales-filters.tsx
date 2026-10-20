"use client";

import type { ReactNode } from "react";
import { Search, SlidersHorizontal } from "lucide-react";
import { useState } from "react";
import { cn } from "cn";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  OPPORTUNITY_STAGE_LABEL,
  OPPORTUNITY_STAGES,
  OPPORTUNITY_TYPE_LABEL,
  SALES_OWNERS,
  type OpportunityStage,
  type OpportunityType,
} from "@/data/sales";

export type CloseWindow = "ALL" | "MONTH" | "DAYS_30" | "QUARTER";
export type ValueRange = "ALL" | "UNDER_500" | "FROM_500" | "FROM_1000" | "OVER_2000";
export type SalesSort = "close" | "value" | "probability" | "updated";

export type SalesFilterState = {
  query: string;
  stage: OpportunityStage | "ALL";
  type: OpportunityType | "ALL";
  owner: string;
  closeWindow: CloseWindow;
  valueRange: ValueRange;
  sort: SalesSort;
};

const selectClass =
  "h-8 max-w-full rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50";

export function SalesFilters({
  value,
  onChange,
}: {
  value: SalesFilterState;
  onChange: (next: SalesFilterState) => void;
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
            placeholder="Search opportunities, customers, or solutions"
            aria-label="Search opportunities"
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
          label="Stage"
          value={value.stage}
          onChange={(stage) => onChange({ ...value, stage: stage as SalesFilterState["stage"] })}
        >
          <option value="ALL">All stages</option>
          {OPPORTUNITY_STAGES.map((stage) => (
            <option key={stage} value={stage}>
              {OPPORTUNITY_STAGE_LABEL[stage]}
            </option>
          ))}
        </FilterSelect>
        <FilterSelect
          label="Opportunity type"
          value={value.type}
          onChange={(type) => onChange({ ...value, type: type as SalesFilterState["type"] })}
        >
          <option value="ALL">All types</option>
          {Object.entries(OPPORTUNITY_TYPE_LABEL).map(([type, label]) => (
            <option key={type} value={type}>
              {label}
            </option>
          ))}
        </FilterSelect>
        <FilterSelect
          label="Owner"
          value={value.owner}
          onChange={(owner) => onChange({ ...value, owner })}
        >
          <option value="ALL">All owners</option>
          {SALES_OWNERS.map((owner) => (
            <option key={owner.id} value={owner.name}>
              {owner.name}
            </option>
          ))}
        </FilterSelect>
        <FilterSelect
          label="Expected close"
          value={value.closeWindow}
          onChange={(closeWindow) =>
            onChange({ ...value, closeWindow: closeWindow as CloseWindow })
          }
        >
          <option value="ALL">Any close date</option>
          <option value="MONTH">This month</option>
          <option value="DAYS_30">Next 30 days</option>
          <option value="QUARTER">This quarter</option>
        </FilterSelect>
        <FilterSelect
          label="Value range"
          value={value.valueRange}
          onChange={(valueRange) => onChange({ ...value, valueRange: valueRange as ValueRange })}
        >
          <option value="ALL">Any value</option>
          <option value="UNDER_500">Under R 500,000</option>
          <option value="FROM_500">R 500,000 – R 1,000,000</option>
          <option value="FROM_1000">R 1,000,000 – R 2,000,000</option>
          <option value="OVER_2000">Over R 2,000,000</option>
        </FilterSelect>
        <FilterSelect
          label="Sort by"
          value={value.sort}
          onChange={(sort) => onChange({ ...value, sort: sort as SalesSort })}
        >
          <option value="close">Expected close</option>
          <option value="value">Value</option>
          <option value="probability">Probability</option>
          <option value="updated">Recently updated</option>
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
