"use client";

import Link from "next/link";
import { useState } from "react";

import { usePortalDelivery } from "@/components/portal/portal-delivery-store";
import { StatusBadge } from "@/components/shell/status-badge";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  ESCALATION_STATUSES,
  ESCALATION_STATUS_LABEL,
  STAGE_SHORT_LABEL,
  type EscalationStatus,
} from "@/data/portal";

const selectClass =
  "h-8 rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50";

const areaClass =
  "h-20 w-full rounded-lg border border-input bg-transparent px-2.5 py-2 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50";

const assignees = [
  "Service Delivery Manager",
  "Sarah M.",
  "David K.",
  "Michael R.",
  "Installation Team",
];

export function EscalationDetail({ id }: { id: string }) {
  const { escalations, updateEscalation, addEscalationNote } = usePortalDelivery();
  const escalation = escalations.find((item) => item.id === id);
  const [notice, setNotice] = useState("");
  const [internalNote, setInternalNote] = useState("");
  const [customerUpdate, setCustomerUpdate] = useState("");

  if (!escalation) {
    return (
      <div className="rounded-lg border bg-card px-4 py-8">
        <h1 className="text-lg font-semibold">Escalation not found</h1>
        <p className="mt-1 text-sm text-muted-foreground">This escalation is not in the current session.</p>
        <Button className="mt-4" size="sm" render={<Link href="/service-delivery" />}>
          Back to Service Delivery
        </Button>
      </div>
    );
  }

  const internalNotes = escalation.notes.filter((note) => !note.customerVisible);
  const customerNotes = escalation.notes.filter((note) => note.customerVisible);

  return (
    <div className="flex min-w-0 flex-col gap-4">
      <div>
        <Button variant="outline" size="sm" render={<Link href="/service-delivery" />}>
          Back to Service Delivery
        </Button>
      </div>
      <header className="rounded-lg border bg-card px-4 py-4">
        <p className="font-mono text-xs text-muted-foreground">{escalation.reference}</p>
        <h1 className="mt-1 font-heading text-xl font-semibold tracking-tight">{escalation.customerName}</h1>
        <p className="mt-1 flex flex-wrap gap-x-3 gap-y-1 text-sm text-muted-foreground">
          <Link href={`/orders/${escalation.orderId}`} className="font-mono underline-offset-4 hover:underline">
            {escalation.orderNumber}
          </Link>
          <span>{STAGE_SHORT_LABEL[escalation.stage]}</span>
        </p>
        <div className="mt-2 flex flex-wrap gap-1.5">
          <StatusBadge status={ESCALATION_STATUS_LABEL[escalation.status]} />
          <StatusBadge status={escalation.priority === "HIGH" ? "High" : escalation.priority === "MEDIUM" ? "Medium" : "Low"} />
        </div>
        {notice ? <p className="mt-3 text-sm text-emerald-700 dark:text-emerald-400">{notice}</p> : null}
      </header>

      <section className="grid gap-4 xl:grid-cols-2">
        <article className="rounded-lg border bg-card px-4 py-4">
          <h2 className="text-sm font-medium">Escalation details</h2>
          <dl className="mt-3 grid gap-3 text-sm sm:grid-cols-2">
            <div>
              <dt className="text-xs text-muted-foreground">Reason</dt>
              <dd>{escalation.reason}</dd>
            </div>
            <div>
              <dt className="text-xs text-muted-foreground">Submitted</dt>
              <dd>{escalation.submittedLabel}</dd>
            </div>
            <div>
              <dt className="text-xs text-muted-foreground">Assigned</dt>
              <dd>{escalation.assignedTo}</dd>
            </div>
            <div>
              <dt className="text-xs text-muted-foreground">Expected response</dt>
              <dd>{escalation.expectedResponse}</dd>
            </div>
            <div>
              <dt className="text-xs text-muted-foreground">Contact preference</dt>
              <dd>{escalation.contactPreference}</dd>
            </div>
            <div>
              <dt className="text-xs text-muted-foreground">Current stage</dt>
              <dd>{STAGE_SHORT_LABEL[escalation.stage]}</dd>
            </div>
          </dl>
          <p className="mt-4 text-sm">&ldquo;{escalation.message}&rdquo;</p>
        </article>

        <article className="rounded-lg border bg-card px-4 py-4">
          <h2 className="text-sm font-medium">Actions</h2>
          <div className="mt-3 flex flex-col gap-3">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="esc-status">Status</Label>
              <select
                id="esc-status"
                className={selectClass}
                value={escalation.status}
                onChange={(event) => {
                  updateEscalation(escalation.id, { status: event.target.value as EscalationStatus });
                  setNotice("Escalation status updated.");
                }}
              >
                {ESCALATION_STATUSES.map((status) => (
                  <option key={status} value={status}>{ESCALATION_STATUS_LABEL[status]}</option>
                ))}
              </select>
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="esc-priority">Priority</Label>
              <select
                id="esc-priority"
                className={selectClass}
                value={escalation.priority}
                onChange={(event) => {
                  updateEscalation(escalation.id, { priority: event.target.value as "HIGH" | "MEDIUM" | "LOW" });
                  setNotice("Escalation priority updated.");
                }}
              >
                <option value="HIGH">High</option>
                <option value="MEDIUM">Medium</option>
                <option value="LOW">Low</option>
              </select>
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="esc-assignee">Assign</Label>
              <select
                id="esc-assignee"
                className={selectClass}
                value={escalation.assignedTo}
                onChange={(event) => {
                  updateEscalation(escalation.id, { assignedTo: event.target.value });
                  setNotice("Escalation assigned.");
                }}
              >
                {assignees.map((person) => (
                  <option key={person} value={person}>{person}</option>
                ))}
              </select>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button type="button" size="sm" variant="outline" render={<Link href={`/orders/${escalation.orderId}`} />}>
                Open Order
              </Button>
              <Button
                type="button"
                size="sm"
                onClick={() => {
                  updateEscalation(escalation.id, { status: "RESOLVED" });
                  setNotice("Escalation resolved.");
                }}
              >
                Resolve Escalation
              </Button>
            </div>
          </div>
        </article>
      </section>

      <div className="grid gap-4 xl:grid-cols-2">
        <section className="rounded-lg border bg-card px-4 py-4">
          <h2 className="text-sm font-medium">Internal notes</h2>
          <p className="mt-0.5 text-xs text-muted-foreground">Never shown in the customer portal.</p>
          <ul className="mt-3 flex flex-col gap-2">
            {internalNotes.length === 0 ? <li className="text-sm text-muted-foreground">No internal notes yet.</li> : null}
            {internalNotes.map((note) => (
              <li key={note.id} className="border-t pt-2 first:border-0 first:pt-0">
                <p className="text-sm">{note.body}</p>
                <p className="text-xs text-muted-foreground">{note.actorName} · {note.occurredLabel}</p>
              </li>
            ))}
          </ul>
          <form
            className="mt-3 flex flex-col gap-2"
            onSubmit={(event) => {
              event.preventDefault();
              if (!internalNote.trim()) return;
              addEscalationNote(escalation.id, internalNote.trim(), false);
              setInternalNote("");
              setNotice("Internal note added.");
            }}
          >
            <Label htmlFor="internal-note">Add internal note</Label>
            <textarea id="internal-note" className={areaClass} value={internalNote} onChange={(event) => setInternalNote(event.target.value)} />
            <div><Button type="submit" variant="outline" size="sm">Add Internal Note</Button></div>
          </form>
        </section>

        <section className="rounded-lg border bg-card px-4 py-4">
          <h2 className="text-sm font-medium">Customer-facing update</h2>
          <p className="mt-0.5 text-xs text-muted-foreground">Appears on the customer delivery tracker.</p>
          <ul className="mt-3 flex flex-col gap-2">
            {customerNotes.length === 0 ? <li className="text-sm text-muted-foreground">No customer updates from this escalation yet.</li> : null}
            {customerNotes.map((note) => (
              <li key={note.id} className="border-t pt-2 first:border-0 first:pt-0">
                <p className="text-sm">{note.body}</p>
                <p className="text-xs text-muted-foreground">{note.actorName} · {note.occurredLabel}</p>
              </li>
            ))}
          </ul>
          <form
            className="mt-3 flex flex-col gap-2"
            onSubmit={(event) => {
              event.preventDefault();
              if (!customerUpdate.trim()) return;
              addEscalationNote(escalation.id, customerUpdate.trim(), true);
              setCustomerUpdate("");
              setNotice("Customer-facing update posted.");
            }}
          >
            <Label htmlFor="customer-update">Add customer update</Label>
            <textarea id="customer-update" className={areaClass} value={customerUpdate} onChange={(event) => setCustomerUpdate(event.target.value)} />
            <div><Button type="submit" size="sm">Post Customer Update</Button></div>
          </form>
        </section>
      </div>
    </div>
  );
}
