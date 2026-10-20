"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";

export function QuoteAcceptanceDialog({
  open,
  quoteNumber,
  onOpenChange,
  onConfirm,
}: {
  open: boolean;
  quoteNumber: string;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
}) {
  const [accepted, setAccepted] = useState(false);

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        if (!next) {
          setAccepted(false);
        }
        onOpenChange(next);
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Accept Quote</DialogTitle>
          <DialogDescription>
            {accepted
              ? `${quoteNumber} is accepted. Create Order is now available. No order has been created.`
              : "Accepting this quote will mark the commercial proposal as accepted and make it eligible for order creation."}
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-wrap justify-end gap-2">
          {accepted ? (
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
                  onConfirm();
                  setAccepted(true);
                }}
              >
                Accept Quote
              </Button>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
