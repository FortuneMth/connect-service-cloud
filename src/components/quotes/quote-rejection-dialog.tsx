"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

export function QuoteRejectionDialog({
  open,
  quoteNumber,
  onOpenChange,
  onConfirm,
}: {
  open: boolean;
  quoteNumber: string;
  onOpenChange: (open: boolean) => void;
  onConfirm: (reason: string) => void;
}) {
  const [reason, setReason] = useState("");
  const [error, setError] = useState("");
  const [rejected, setRejected] = useState(false);

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        if (!next) {
          setReason("");
          setError("");
          setRejected(false);
        }
        onOpenChange(next);
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Reject Quote</DialogTitle>
          <DialogDescription>
            {rejected
              ? `${quoteNumber} is rejected. The reason is stored on this quote.`
              : "Record why the customer is declining this proposal. The quote stays in this workspace."}
          </DialogDescription>
        </DialogHeader>
        {rejected ? null : (
          <div>
            <Label htmlFor="rejection-reason" className="mb-1 text-xs">
              Rejection reason
            </Label>
            <textarea
              id="rejection-reason"
              value={reason}
              onChange={(event) => setReason(event.target.value)}
              className="min-h-24 w-full rounded-lg border border-input bg-transparent px-2.5 py-2 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
            />
            {error ? <p className="mt-1 text-xs text-destructive">{error}</p> : null}
          </div>
        )}
        <div className="flex flex-wrap justify-end gap-2">
          {rejected ? (
            <Button type="button" onClick={() => onOpenChange(false)}>
              Close
            </Button>
          ) : (
            <>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button
                type="button"
                onClick={() => {
                  if (reason.trim().length < 3) {
                    setError("Enter a rejection reason.");
                    return;
                  }
                  onConfirm(reason.trim());
                  setRejected(true);
                }}
              >
                Reject Quote
              </Button>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
