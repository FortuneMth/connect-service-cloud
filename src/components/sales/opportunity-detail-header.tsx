"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRightLeft, FileText, Pencil, Plus } from "lucide-react";

import { OpportunityForm } from "@/components/sales/opportunity-form";
import { OpportunityStageBadge } from "@/components/sales/opportunity-stage-badge";
import { draftFromOpportunity, useOpportunities } from "@/components/sales/opportunity-store";
import { StageChangeDialog } from "@/components/sales/stage-change-dialog";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { OpportunityRecord } from "@/data/sales";

export function OpportunityDetailHeader({ opportunity }: { opportunity: OpportunityRecord }) {
  const { updateOpportunity, moveStage, addActivity } = useOpportunities();
  const [editing, setEditing] = useState(false);
  const [moving, setMoving] = useState(false);
  const [quoting, setQuoting] = useState(false);
  const [noting, setNoting] = useState(false);
  const [note, setNote] = useState("");
  const [noted, setNoted] = useState(false);

  return (
    <div className="flex flex-col gap-4">
      <Link
        href="/sales"
        className="inline-flex w-fit items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-3.5" />
        Sales
      </Link>
      <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="font-heading text-xl font-semibold tracking-tight">{opportunity.name}</h1>
            <OpportunityStageBadge stage={opportunity.stage} />
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            {opportunity.opportunityNumber} · {opportunity.customer.name} · {opportunity.probability}% ·{" "}
            {opportunity.owner.name}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button type="button" variant="outline" size="sm" onClick={() => setEditing(true)}>
            <Pencil />
            Edit Opportunity
          </Button>
          <Button type="button" variant="outline" size="sm" onClick={() => setMoving(true)}>
            <ArrowRightLeft />
            Move Stage
          </Button>
          <Button type="button" variant="outline" size="sm" onClick={() => setQuoting(true)}>
            <FileText />
            Create Quote
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => {
              setNote("");
              setNoted(false);
              setNoting(true);
            }}
          >
            <Plus />
            Add Activity
          </Button>
        </div>
      </div>
      <Dialog open={editing} onOpenChange={setEditing}>
        <DialogContent className="max-h-[min(44rem,calc(100%-2rem))] w-[min(42rem,calc(100%-2rem))] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Opportunity</DialogTitle>
            <DialogDescription>Changes stay in this browser session.</DialogDescription>
          </DialogHeader>
          <div className="mt-4">
            <OpportunityForm
              key={opportunity.updatedAt}
              initial={draftFromOpportunity(opportunity)}
              submitLabel="Save changes"
              onCancel={() => setEditing(false)}
              onSubmit={(values) => {
                updateOpportunity(opportunity.id, values);
                setEditing(false);
              }}
            />
          </div>
        </DialogContent>
      </Dialog>
      <StageChangeDialog
        opportunity={opportunity}
        open={moving}
        onOpenChange={setMoving}
        onMove={(stage) => moveStage(opportunity.id, stage)}
      />
      <Dialog open={quoting} onOpenChange={setQuoting}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create Quote</DialogTitle>
            <DialogDescription>
              Quote preparation from this opportunity will open here once the quotes workspace is connected. Nothing
              is saved from this screen.
            </DialogDescription>
          </DialogHeader>
          <div className="mt-4 flex justify-end">
            <Button type="button" variant="outline" onClick={() => setQuoting(false)}>
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>
      <Dialog
        open={noting}
        onOpenChange={(open) => {
          setNoting(open);
          if (!open) setNoted(false);
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{noted ? "Activity added" : "Add Activity"}</DialogTitle>
            <DialogDescription>
              {noted
                ? "The note is on this opportunity for the current session."
                : "Record a commercial update. It stays in this browser session."}
            </DialogDescription>
          </DialogHeader>
          {noted ? (
            <div className="mt-4 flex justify-end">
              <Button type="button" onClick={() => setNoting(false)}>
                Close
              </Button>
            </div>
          ) : (
            <form
              className="mt-4 grid gap-3"
              onSubmit={(event) => {
                event.preventDefault();
                if (note.trim().length < 2) return;
                addActivity(opportunity.id, note);
                setNoted(true);
              }}
            >
              <div>
                <Label className="mb-1.5" htmlFor="activity-note">
                  Activity
                </Label>
                <Input
                  id="activity-note"
                  value={note}
                  onChange={(event) => setNote(event.target.value)}
                  placeholder="Customer meeting"
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setNoting(false)}>
                  Cancel
                </Button>
                <Button type="submit">Add activity</Button>
              </div>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
