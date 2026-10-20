"use client";

import { useMemo, useState } from "react";

import { QuoteFilters, type QuoteFilterState } from "@/components/quotes/quote-filters";
import { QuoteForm } from "@/components/quotes/quote-form";
import { QuoteHeader } from "@/components/quotes/quote-header";
import { QuoteKpis } from "@/components/quotes/quote-kpis";
import { QuoteStatusPipeline } from "@/components/quotes/quote-status-pipeline";
import { QuoteTable } from "@/components/quotes/quote-table";
import { draftFromQuote, useQuotes } from "@/components/quotes/quote-store";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import type { QuoteRecord } from "@/data/quotes";

const initialFilters: QuoteFilterState = {
  query: "",
  status: "ALL",
  type: "ALL",
  owner: "ALL",
  customer: "ALL",
  validUntil: "ALL",
  valueRange: "ALL",
  sort: "updated",
};

const TODAY = "2026-10-14";
const DAYS_14 = "2026-10-28";

export function QuoteWorkspace() {
  const { quotes, addQuote, updateQuote } = useQuotes();
  const [filters, setFilters] = useState<QuoteFilterState>(initialFilters);
  const [adding, setAdding] = useState(false);
  const [added, setAdded] = useState<QuoteRecord | null>(null);
  const [editing, setEditing] = useState<QuoteRecord | null>(null);
  const [saved, setSaved] = useState(false);
  const [exporting, setExporting] = useState(false);
  const owners = useMemo(() => [...new Set(quotes.map((quote) => quote.owner.name))].sort(), [quotes]);
  const customers = useMemo(() => [...new Set(quotes.map((quote) => quote.customerName))].sort(), [quotes]);
  const visible = useMemo(() => applyFilters(quotes, filters), [quotes, filters]);

  return (
    <div className="flex min-w-0 flex-col gap-6">
      <QuoteHeader
        onCreate={() => {
          setAdded(null);
          setAdding(true);
        }}
        onExport={() => setExporting(true)}
      />
      <QuoteKpis />
      <QuoteStatusPipeline
        activeStatus={filters.status}
        onSelect={(status) => setFilters((current) => ({ ...current, status }))}
      />
      <div className="flex min-w-0 flex-col gap-3">
        <div className="flex items-baseline justify-between gap-3">
          <h2 className="text-sm font-medium">Quotes</h2>
          <p className="text-xs text-muted-foreground">
            {visible.length} {visible.length === 1 ? "quote" : "quotes"}
          </p>
        </div>
        <QuoteFilters filters={filters} owners={owners} customers={customers} onChange={setFilters} />
        <QuoteTable quotes={visible} onEdit={(quote) => { setSaved(false); setEditing(quote); }} />
      </div>

      <Dialog open={adding} onOpenChange={setAdding}>
        <DialogContent className="max-h-[min(44rem,calc(100%-2rem))] w-[min(44rem,calc(100%-2rem))] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create Quote</DialogTitle>
            <DialogDescription>
              {added
                ? `${added.quoteNumber} was added as a draft. Nothing was written to a database.`
                : "Prepare a connectivity proposal. It is stored in this browser session only."}
            </DialogDescription>
          </DialogHeader>
          {added ? (
            <div className="flex justify-end">
              <Button type="button" onClick={() => setAdding(false)}>Close</Button>
            </div>
          ) : (
            <QuoteForm
              submitLabel="Create quote"
              onCancel={() => setAdding(false)}
              onSubmit={(draft) => setAdded(addQuote(draft))}
            />
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={editing !== null} onOpenChange={(open) => { if (!open) setEditing(null); }}>
        <DialogContent className="max-h-[min(44rem,calc(100%-2rem))] w-[min(44rem,calc(100%-2rem))] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Quote</DialogTitle>
            <DialogDescription>
              {saved
                ? `${editing?.quoteNumber ?? "The quote"} was updated in this session.`
                : "Update the commercial record. Totals stay in this browser session."}
            </DialogDescription>
          </DialogHeader>
          {editing && !saved ? (
            <QuoteForm
              key={editing.id}
              initial={draftFromQuote(editing)}
              submitLabel="Save quote"
              onCancel={() => setEditing(null)}
              onSubmit={(draft) => {
                updateQuote(editing.id, draft);
                setSaved(true);
              }}
            />
          ) : (
            <div className="flex justify-end">
              <Button type="button" onClick={() => setEditing(null)}>Close</Button>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={exporting} onOpenChange={setExporting}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Export</DialogTitle>
            <DialogDescription>
              Quote export will be available when the quote data service is connected.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end">
            <Button type="button" onClick={() => setExporting(false)}>Close</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function applyFilters(quotes: QuoteRecord[], filters: QuoteFilterState) {
  const query = filters.query.trim().toLowerCase();

  const filtered = quotes.filter((quote) => {
    if (filters.status !== "ALL" && quote.status !== filters.status) return false;
    if (filters.type !== "ALL" && quote.quoteType !== filters.type) return false;
    if (filters.owner !== "ALL" && quote.owner.name !== filters.owner) return false;
    if (filters.customer !== "ALL" && quote.customerName !== filters.customer) return false;
    if (!matchesValidity(quote.validUntil, filters.validUntil)) return false;
    if (!matchesValue(quote.total, filters.valueRange)) return false;
    if (!query) return true;

    const haystack = [quote.quoteNumber, quote.customerName, quote.opportunityName, quote.owner.name]
      .join(" ")
      .toLowerCase();
    return haystack.includes(query);
  });

  return filtered.sort((left, right) => {
    if (filters.sort === "total") return right.total - left.total;
    if (filters.sort === "mrr") return right.mrr - left.mrr;
    if (filters.sort === "validUntil") return left.validUntil.localeCompare(right.validUntil);
    if (filters.sort === "customer") return left.customerName.localeCompare(right.customerName);
    return right.updatedAt.localeCompare(left.updatedAt);
  });
}

function matchesValidity(validUntil: string, window: QuoteFilterState["validUntil"]) {
  if (window === "ALL") return true;
  if (window === "PAST") return validUntil < TODAY;
  if (window === "DAYS_14") return validUntil >= TODAY && validUntil <= DAYS_14;
  if (window === "MONTH") return validUntil >= "2026-10-01" && validUntil <= "2026-10-31";
  return validUntil >= "2026-10-01" && validUntil <= "2026-12-31";
}

function matchesValue(total: number, range: QuoteFilterState["valueRange"]) {
  if (range === "UNDER_500") return total < 500_000;
  if (range === "FROM_500") return total >= 500_000 && total < 1_000_000;
  if (range === "FROM_1000") return total >= 1_000_000 && total <= 2_000_000;
  if (range === "OVER_2000") return total > 2_000_000;
  return true;
}
