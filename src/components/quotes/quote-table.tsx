"use client";

import { useRouter } from "next/navigation";
import { Pencil } from "lucide-react";

import { StatusBadge } from "@/components/shell/status-badge";
import { Button } from "@/components/ui/button";
import { QUOTE_STATUS_LABEL, QUOTE_TYPE_LABEL, formatRand, type QuoteRecord } from "@/data/quotes";

export function QuoteTable({
  quotes,
  onEdit,
}: {
  quotes: QuoteRecord[];
  onEdit: (quote: QuoteRecord) => void;
}) {
  const router = useRouter();

  if (quotes.length === 0) {
    return (
      <div className="rounded-lg border bg-card px-4 py-8 text-sm text-muted-foreground">
        No quotes match these filters.
      </div>
    );
  }

  return (
    <div className="min-w-0">
      <div className="hidden overflow-x-auto rounded-lg border md:block">
        <table className="w-full min-w-[68rem] text-left text-sm">
          <thead className="border-b bg-muted/40 text-xs text-muted-foreground">
            <tr>
              <th className="px-3 py-2 font-medium">Quote</th>
              <th className="px-3 py-2 font-medium">Customer</th>
              <th className="hidden px-3 py-2 font-medium lg:table-cell">Opportunity</th>
              <th className="hidden px-3 py-2 font-medium xl:table-cell">Type</th>
              <th className="px-3 py-2 font-medium">Status</th>
              <th className="px-3 py-2 font-medium">Total Value</th>
              <th className="px-3 py-2 font-medium">MRR</th>
              <th className="hidden px-3 py-2 font-medium lg:table-cell">Valid Until</th>
              <th className="hidden px-3 py-2 font-medium xl:table-cell">Owner</th>
              <th className="hidden px-3 py-2 font-medium lg:table-cell">Last Activity</th>
              <th className="px-3 py-2 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {quotes.map((quote) => (
              <tr
                key={quote.id}
                className="cursor-pointer border-b last:border-0 hover:bg-muted/30"
                onClick={() => router.push(`/quotes/${quote.id}`)}
              >
                <td className="px-3 py-2.5 font-medium">{quote.quoteNumber}</td>
                <td className="px-3 py-2.5">{quote.customerName}</td>
                <td className="hidden px-3 py-2.5 lg:table-cell">{quote.opportunityName}</td>
                <td className="hidden px-3 py-2.5 xl:table-cell">{QUOTE_TYPE_LABEL[quote.quoteType]}</td>
                <td className="px-3 py-2.5">
                  <StatusBadge status={QUOTE_STATUS_LABEL[quote.status]} />
                </td>
                <td className="px-3 py-2.5 tabular-nums">{formatRand(quote.total)}</td>
                <td className="px-3 py-2.5 tabular-nums">{formatRand(quote.mrr)}</td>
                <td className="hidden px-3 py-2.5 lg:table-cell">{quote.validUntilLabel}</td>
                <td className="hidden px-3 py-2.5 xl:table-cell">{quote.owner.name}</td>
                <td className="hidden px-3 py-2.5 lg:table-cell">{quote.lastActivityLabel}</td>
                <td className="px-3 py-2.5">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={(event) => {
                      event.stopPropagation();
                      onEdit(quote);
                    }}
                  >
                    <Pencil />
                    Edit
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <ul className="flex flex-col gap-2 md:hidden">
        {quotes.map((quote) => (
          <li key={quote.id}>
            <button
              type="button"
              onClick={() => router.push(`/quotes/${quote.id}`)}
              className="w-full rounded-lg border bg-card px-3 py-3 text-left"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="font-medium">{quote.quoteNumber}</p>
                  <p className="truncate text-sm text-muted-foreground">{quote.customerName}</p>
                </div>
                <StatusBadge status={QUOTE_STATUS_LABEL[quote.status]} />
              </div>
              <dl className="mt-3 grid grid-cols-2 gap-2 text-sm">
                <div>
                  <dt className="text-xs text-muted-foreground">Total value</dt>
                  <dd className="tabular-nums">{formatRand(quote.total)}</dd>
                </div>
                <div>
                  <dt className="text-xs text-muted-foreground">MRR</dt>
                  <dd className="tabular-nums">{formatRand(quote.mrr)}</dd>
                </div>
                <div>
                  <dt className="text-xs text-muted-foreground">Valid until</dt>
                  <dd>{quote.validUntilLabel}</dd>
                </div>
                <div>
                  <dt className="text-xs text-muted-foreground">Owner</dt>
                  <dd>{quote.owner.name}</dd>
                </div>
              </dl>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
