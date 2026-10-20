"use client";

import { useMemo, useState } from "react";

import { OpportunityForm } from "@/components/sales/opportunity-form";
import { OpportunityTable } from "@/components/sales/opportunity-table";
import { draftFromOpportunity, useOpportunities } from "@/components/sales/opportunity-store";
import { SalesFilters, type SalesFilterState } from "@/components/sales/sales-filters";
import { SalesHeader } from "@/components/sales/sales-header";
import { SalesKpis } from "@/components/sales/sales-kpis";
import { SalesPipeline } from "@/components/sales/sales-pipeline";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { OpportunityRecord } from "@/data/sales";

const initialFilters: SalesFilterState = {
  query: "",
  stage: "ALL",
  type: "ALL",
  owner: "ALL",
  closeWindow: "ALL",
  valueRange: "ALL",
  sort: "close",
};

const TODAY = "2026-10-14";

export function SalesWorkspace() {
  const { opportunities, addOpportunity, updateOpportunity } = useOpportunities();
  const [filters, setFilters] = useState<SalesFilterState>(initialFilters);
  const [adding, setAdding] = useState(false);
  const [added, setAdded] = useState<OpportunityRecord | null>(null);
  const [editing, setEditing] = useState<OpportunityRecord | null>(null);
  const [placeholder, setPlaceholder] = useState<"quote" | "export" | null>(null);
  const visible = useMemo(() => applyFilters(opportunities, filters), [opportunities, filters]);

  return (
    <div className="flex min-w-0 flex-col gap-6">
      <SalesHeader
        onCreate={() => {
          setAdded(null);
          setAdding(true);
        }}
        onQuote={() => setPlaceholder("quote")}
        onExport={() => setPlaceholder("export")}
      />
      <SalesKpis />
      <SalesPipeline
        activeStage={filters.stage}
        onSelect={(stage) => setFilters((current) => ({ ...current, stage }))}
      />
      <SalesFilters value={filters} onChange={setFilters} />
      <p className="text-xs text-muted-foreground">
        {visible.length} {visible.length === 1 ? "opportunity" : "opportunities"}
      </p>
      <OpportunityTable opportunities={visible} onEdit={setEditing} />
      <Dialog
        open={adding}
        onOpenChange={(open) => {
          setAdding(open);
          if (!open) setAdded(null);
        }}
      >
        <DialogContent className="max-h-[min(44rem,calc(100%-2rem))] w-[min(42rem,calc(100%-2rem))] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{added ? "Opportunity added" : "New Opportunity"}</DialogTitle>
            <DialogDescription>
              {added
                ? `${added.name} is available in this session as ${added.opportunityNumber}. Nothing is written to a database.`
                : "Capture the commercial case. The record stays in this browser session."}
            </DialogDescription>
          </DialogHeader>
          {added ? (
            <div className="mt-4 flex justify-end">
              <Button type="button" onClick={() => setAdding(false)}>
                Close
              </Button>
            </div>
          ) : (
            <div className="mt-4">
              <OpportunityForm
                submitLabel="Create opportunity"
                onCancel={() => setAdding(false)}
                onSubmit={(values) => setAdded(addOpportunity(values))}
              />
            </div>
          )}
        </DialogContent>
      </Dialog>
      <Dialog open={editing !== null} onOpenChange={(open) => !open && setEditing(null)}>
        <DialogContent className="max-h-[min(44rem,calc(100%-2rem))] w-[min(42rem,calc(100%-2rem))] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Opportunity</DialogTitle>
            <DialogDescription>
              {editing
                ? `Update ${editing.name}. Changes stay in this browser session.`
                : "Update the opportunity."}
            </DialogDescription>
          </DialogHeader>
          {editing ? (
            <div className="mt-4">
              <OpportunityForm
                key={editing.id}
                initial={draftFromOpportunity(editing)}
                submitLabel="Save changes"
                onCancel={() => setEditing(null)}
                onSubmit={(values) => {
                  updateOpportunity(editing.id, values);
                  setEditing(null);
                }}
              />
            </div>
          ) : null}
        </DialogContent>
      </Dialog>
      <Dialog open={placeholder !== null} onOpenChange={(open) => !open && setPlaceholder(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{placeholder === "export" ? "Export" : "Create Quote"}</DialogTitle>
            <DialogDescription>
              {placeholder === "export"
                ? "Opportunity export will be available when the sales data service is connected."
                : "Quote preparation will open here once the quotes workspace is connected."}{" "}
              Nothing is saved from this screen.
            </DialogDescription>
          </DialogHeader>
          <div className="mt-4 flex justify-end">
            <Button type="button" variant="outline" onClick={() => setPlaceholder(null)}>
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function applyFilters(opportunities: OpportunityRecord[], filters: SalesFilterState) {
  const query = filters.query.trim().toLowerCase();
  const filtered = opportunities.filter((opportunity) => {
    const matchesQuery =
      query.length === 0 ||
      opportunity.name.toLowerCase().includes(query) ||
      opportunity.opportunityNumber.toLowerCase().includes(query) ||
      opportunity.customer.name.toLowerCase().includes(query) ||
      opportunity.solution.toLowerCase().includes(query) ||
      opportunity.owner.name.toLowerCase().includes(query);
    const matchesStage = filters.stage === "ALL" || opportunity.stage === filters.stage;
    const matchesType = filters.type === "ALL" || opportunity.type === filters.type;
    const matchesOwner = filters.owner === "ALL" || opportunity.owner.name === filters.owner;
    const matchesClose = matchesCloseWindow(opportunity.expectedClose, filters.closeWindow);
    const matchesValue = matchesValueRange(opportunity.value, filters.valueRange);
    return matchesQuery && matchesStage && matchesType && matchesOwner && matchesClose && matchesValue;
  });

  return filtered.sort((left, right) => {
    if (filters.sort === "value") return right.value - left.value;
    if (filters.sort === "probability") return right.probability - left.probability;
    if (filters.sort === "updated") return right.updatedAt.localeCompare(left.updatedAt);
    return left.expectedClose.localeCompare(right.expectedClose);
  });
}

function matchesCloseWindow(expectedClose: string, window: SalesFilterState["closeWindow"]) {
  if (window === "ALL") return true;
  if (window === "MONTH") return expectedClose.startsWith("2026-10");
  if (window === "DAYS_30") return expectedClose >= TODAY && expectedClose <= "2026-11-13";
  return expectedClose >= "2026-10-01" && expectedClose <= "2026-12-31";
}

function matchesValueRange(value: number, range: SalesFilterState["valueRange"]) {
  if (range === "UNDER_500") return value < 500000;
  if (range === "FROM_500") return value >= 500000 && value <= 1000000;
  if (range === "FROM_1000") return value >= 1000000 && value <= 2000000;
  if (range === "OVER_2000") return value > 2000000;
  return true;
}
