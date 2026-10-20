"use client";

import { Upload } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export function ImportCustomerDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Customer import</DialogTitle>
          <DialogDescription>
            CSV import will be available when the customer data service is connected.
          </DialogDescription>
        </DialogHeader>
        <div className="mt-4 flex flex-col items-center gap-2 rounded-lg border border-dashed bg-muted/40 px-4 py-8 text-center opacity-70">
          <Upload className="size-4 text-muted-foreground" aria-hidden />
          <p className="text-sm text-muted-foreground">Drop a CSV file here</p>
          <Button type="button" variant="outline" size="sm" disabled>
            Choose file
          </Button>
        </div>
        <div className="mt-4 flex justify-end">
          <DialogClose render={<Button variant="outline" />}>Close</DialogClose>
        </div>
      </DialogContent>
    </Dialog>
  );
}
