"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Copy, Eye, FileCheck, Pencil, Send, ShoppingCart, XCircle } from "lucide-react";

import { QuoteAcceptanceDialog } from "@/components/quotes/quote-acceptance-dialog";
import { QuoteForm } from "@/components/quotes/quote-form";
import { QuotePreview } from "@/components/quotes/quote-preview";
import { QuoteRejectionDialog } from "@/components/quotes/quote-rejection-dialog";
import { draftFromQuote, useQuotes } from "@/components/quotes/quote-store";
import { StatusBadge } from "@/components/shell/status-badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { QUOTE_STATUS_LABEL, QUOTE_TYPE_LABEL, type QuoteRecord } from "@/data/quotes";

export function QuoteDetailHeader({ quote }: { quote: QuoteRecord }) {
  const { updateQuote, sendQuote, acceptQuote, rejectQuote, duplicateQuote } = useQuotes();
  const [editing, setEditing] = useState(false);
  const [saved, setSaved] = useState(false);
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [accepting, setAccepting] = useState(false);
  const [rejecting, setRejecting] = useState(false);
  const [preview, setPreview] = useState(false);
  const [ordering, setOrdering] = useState(false);
  const [copyNumber, setCopyNumber] = useState<string | null>(null);
  const canSend = quote.status === "DRAFT" || quote.status === "INTERNAL_REVIEW";
  const canAccept = quote.status === "SENT" || quote.status === "CUSTOMER_REVIEW";
  const canReject = quote.status !== "ACCEPTED" && quote.status !== "REJECTED" && quote.status !== "EXPIRED";
  const canOrder = quote.status === "ACCEPTED";

  return (
    <div className="flex min-w-0 flex-col gap-3">
      <Link href="/quotes" className="inline-flex w-fit items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="size-3.5" />
        Quotes
      </Link>
      <div className="flex flex-col gap-3 xl:flex-row xl:items-start xl:justify-between">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="font-heading text-xl font-semibold tracking-tight">{quote.quoteNumber}</h1>
            <StatusBadge status={QUOTE_STATUS_LABEL[quote.status]} />
            <StatusBadge status={QUOTE_TYPE_LABEL[quote.quoteType]} />
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            {quote.customerName} · {quote.owner.name} · Created {quote.createdLabel} · Valid until {quote.validUntilLabel}
          </p>
        </div>
        <div className="flex min-w-0 flex-wrap items-center gap-2">
          <Button type="button" variant="outline" size="sm" onClick={() => { setSaved(false); setEditing(true); }}>
            <Pencil />
            Edit Quote
          </Button>
          <Button type="button" variant="outline" size="sm" disabled={!canSend} title={canSend ? undefined : "Send is available while the quote is in draft or internal review."} onClick={() => { setSent(false); setSending(true); }}>
            <Send />
            Send Quote
          </Button>
          <Button type="button" variant="outline" size="sm" disabled={!canAccept} title={canAccept ? undefined : "Accept is available after the quote has been sent."} onClick={() => setAccepting(true)}>
            <FileCheck />
            Accept Quote
          </Button>
          <Button type="button" variant="outline" size="sm" disabled={!canReject} title={canReject ? undefined : "This quote can no longer be rejected."} onClick={() => setRejecting(true)}>
            <XCircle />
            Reject Quote
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => {
              const copy = duplicateQuote(quote.id);
              setCopyNumber(copy?.quoteNumber ?? null);
            }}
          >
            <Copy />
            Duplicate Quote
          </Button>
          <Button type="button" variant="outline" size="sm" onClick={() => setPreview(true)}>
            <Eye />
            Preview Quote
          </Button>
          <Button type="button" size="sm" disabled={!canOrder} onClick={() => setOrdering(true)}>
            <ShoppingCart />
            Create Order
          </Button>
          {canOrder ? null : (
            <p className="basis-full text-xs text-muted-foreground">
              Create Order is available after this quote is accepted.
            </p>
          )}
        </div>
      </div>
      {quote.rejectionReason ? (
        <p className="rounded-lg border bg-card px-3 py-2 text-sm">
          <span className="font-medium">Rejection reason. </span>
          {quote.rejectionReason}
        </p>
      ) : null}

      <Dialog open={editing} onOpenChange={setEditing}>
        <DialogContent className="max-h-[min(44rem,calc(100%-2rem))] w-[min(44rem,calc(100%-2rem))] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Quote</DialogTitle>
            <DialogDescription>
              {saved ? `${quote.quoteNumber} was updated in this session.` : "Update the commercial record. Totals stay in this browser session."}
            </DialogDescription>
          </DialogHeader>
          {saved ? (
            <div className="flex justify-end">
              <Button type="button" onClick={() => setEditing(false)}>Close</Button>
            </div>
          ) : (
            <QuoteForm
              key={quote.updatedAt}
              initial={draftFromQuote(quote)}
              submitLabel="Save quote"
              onCancel={() => setEditing(false)}
              onSubmit={(draft) => {
                updateQuote(quote.id, draft);
                setSaved(true);
              }}
            />
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={sending} onOpenChange={setSending}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Send Quote</DialogTitle>
            <DialogDescription>
              {sent ? `${quote.quoteNumber} is now Sent. No email was sent.` : "Send this quote to the customer?"}
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-wrap justify-end gap-2">
            {sent ? (
              <Button type="button" onClick={() => setSending(false)}>Close</Button>
            ) : (
              <>
                <Button type="button" variant="outline" onClick={() => setSending(false)}>Cancel</Button>
                <Button
                  type="button"
                  onClick={() => {
                    sendQuote(quote.id);
                    setSent(true);
                  }}
                >
                  Send Quote
                </Button>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>

      <QuoteAcceptanceDialog
        open={accepting}
        quoteNumber={quote.quoteNumber}
        onOpenChange={setAccepting}
        onConfirm={() => acceptQuote(quote.id)}
      />
      <QuoteRejectionDialog
        open={rejecting}
        quoteNumber={quote.quoteNumber}
        onOpenChange={setRejecting}
        onConfirm={(reason) => rejectQuote(quote.id, reason)}
      />
      <QuotePreview quote={quote} open={preview} onOpenChange={setPreview} />

      <Dialog open={ordering} onOpenChange={setOrdering}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create Order</DialogTitle>
            <DialogDescription>
              {quote.quoteNumber} is eligible for an order. Order creation will open when the orders workspace is connected. No order is created from this screen.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end">
            <Button type="button" onClick={() => setOrdering(false)}>Close</Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={copyNumber !== null} onOpenChange={(open) => { if (!open) setCopyNumber(null); }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Quote duplicated</DialogTitle>
            <DialogDescription>
              {copyNumber} was created as a draft from {quote.quoteNumber}. Nothing was written to a database.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end">
            <Button type="button" onClick={() => setCopyNumber(null)}>Close</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
