"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  OPPORTUNITY_STAGE_LABEL,
  OPPORTUNITY_STAGES,
  type OpportunityRecord,
  type OpportunityStage,
} from "@/data/sales";

const fieldClass =
  "h-8 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50";

export function StageChangeDialog({
  opportunity,
  open,
  onOpenChange,
  onMove,
}: {
  opportunity: OpportunityRecord;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onMove: (stage: OpportunityStage) => void;
}) {
  const [stage, setStage] = useState<OpportunityStage>(opportunity.stage);
  const [movedTo, setMovedTo] = useState<OpportunityStage | null>(null);

  function close(next: boolean) {
    if (!next) {
      setMovedTo(null);
      setStage(opportunity.stage);
    }
    onOpenChange(next);
  }

  return (
    <Dialog open={open} onOpenChange={close}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{movedTo ? "Stage updated" : "Move Stage"}</DialogTitle>
          <DialogDescription>
            {movedTo
              ? `Opportunity moved to ${OPPORTUNITY_STAGE_LABEL[movedTo]}. The change stays in this browser session.`
              : `Choose the next stage for ${opportunity.opportunityNumber}.`}
          </DialogDescription>
        </DialogHeader>
        {movedTo ? (
          <div className="mt-4 flex justify-end">
            <Button type="button" onClick={() => close(false)}>
              Close
            </Button>
          </div>
        ) : (
          <form
            className="mt-4 grid gap-3"
            onSubmit={(event) => {
              event.preventDefault();
              if (stage === opportunity.stage) {
                close(false);
                return;
              }
              onMove(stage);
              setMovedTo(stage);
            }}
          >
            <label className="text-sm">
              <span className="mb-1.5 block text-sm font-medium">Stage</span>
              <select
                aria-label="Stage"
                className={fieldClass}
                value={stage}
                onChange={(event) => setStage(event.target.value as OpportunityStage)}
              >
                {OPPORTUNITY_STAGES.map((item) => (
                  <option key={item} value={item}>
                    {OPPORTUNITY_STAGE_LABEL[item]}
                  </option>
                ))}
              </select>
            </label>
            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => close(false)}>
                Cancel
              </Button>
              <Button type="submit">Update stage</Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
