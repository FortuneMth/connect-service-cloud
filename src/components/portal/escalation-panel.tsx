"use client";

import { useState } from "react";

import { EscalationDialog } from "@/components/portal/escalation-dialog";
import { usePortalDelivery } from "@/components/portal/portal-delivery-store";
import { StatusBadge } from "@/components/shell/status-badge";
import { Button } from "@/components/ui/button";
import { ESCALATION_STATUS_LABEL, STAGE_SHORT_LABEL, type PortalEscalation } from "@/data/portal";

export function EscalationPanel({ orderId }: { orderId: string }) {
  const { escalations } = usePortalDelivery();
  const [open, setOpen] = useState(false);
  const [focused, setFocused] = useState<PortalEscalation | null>(null);
  const orderEscalations = escalations.filter((item) => item.orderId === orderId && item.status !== "RESOLVED");

  return (
    <section id="escalation" className="min-w-0 rounded-lg border bg-card px-4 py-4">
      <h2 className="text-sm font-medium">Need help?</h2>
      <p className="mt-0.5 text-sm text-muted-foreground">Has your delivery stopped progressing?</p>
      <div className="mt-3">
        <Button type="button" size="sm" onClick={() => setOpen(true)}>Request Escalation</Button>
      </div>
      {orderEscalations.length > 0 ? (
        <ul className="mt-4 flex flex-col gap-2">
          {orderEscalations.map((item) => (
            <li key={item.id} className="rounded-lg border px-3 py-2.5">
              <div className="flex flex-wrap items-center gap-2">
                <p className="font-mono text-sm font-medium">{item.reference}</p>
                <StatusBadge status={ESCALATION_STATUS_LABEL[item.status]} />
                <StatusBadge status="High" />
              </div>
              <p className="mt-1 text-sm text-muted-foreground">{item.reason}</p>
              <p className="mt-1 text-xs text-muted-foreground">
                Assigned to {item.assignedTo} · {item.expectedResponse}
              </p>
              <Button type="button" variant="outline" size="sm" className="mt-2" onClick={() => setFocused(item)}>
                View Escalation
              </Button>
            </li>
          ))}
        </ul>
      ) : null}
      <EscalationDialog
        open={open}
        orderId={orderId}
        onOpenChange={setOpen}
        onSubmitted={(escalation) => setFocused(escalation)}
      />
      {focused ? (
        <div className="mt-4 rounded-lg border px-3 py-3 text-sm">
          <p className="font-mono font-medium">{focused.reference}</p>
          <p className="mt-1">{focused.message}</p>
          <dl className="mt-3 grid gap-2 sm:grid-cols-2">
            <div>
              <dt className="text-xs text-muted-foreground">Stage</dt>
              <dd>{STAGE_SHORT_LABEL[focused.stage]}</dd>
            </div>
            <div>
              <dt className="text-xs text-muted-foreground">Status</dt>
              <dd>{ESCALATION_STATUS_LABEL[focused.status]}</dd>
            </div>
            <div>
              <dt className="text-xs text-muted-foreground">Assigned</dt>
              <dd>{focused.assignedTo}</dd>
            </div>
            <div>
              <dt className="text-xs text-muted-foreground">Expected response</dt>
              <dd>{focused.expectedResponse}</dd>
            </div>
          </dl>
        </div>
      ) : null}
    </section>
  );
}
