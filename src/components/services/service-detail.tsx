"use client";

import Link from "next/link";
import { useState } from "react";

import { ServiceCircuit } from "@/components/services/service-circuit";
import { ServiceDetailHeader } from "@/components/services/service-detail-header";
import { ServiceHealth } from "@/components/services/service-health";
import { ServiceNotes } from "@/components/services/service-notes";
import { ServiceSummary } from "@/components/services/service-summary";
import { ServiceTimeline } from "@/components/services/service-timeline";
import { useService, useServices } from "@/components/services/service-store";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { serviceStatusSummary, type ServiceStatus } from "@/data/services";

const documents = ["Service order", "Circuit design", "Test results", "Customer acceptance", "Handover pack"];

const fieldClass =
  "h-20 w-full rounded-lg border border-input bg-transparent px-2.5 py-2 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50";

export function ServiceDetail({ id }: { id: string }) {
  const service = useService(id);
  const { changeStatus, suspendService, recordCheck, addNote } = useServices();
  const [notice, setNotice] = useState("");
  const [suspendOpen, setSuspendOpen] = useState(false);
  const [reason, setReason] = useState("Customer requested a pause");
  const [documentName, setDocumentName] = useState<string | null>(null);

  if (!service) {
    return (
      <div className="rounded-lg border bg-card px-4 py-8">
        <h1 className="text-lg font-semibold">Service not found</h1>
        <p className="mt-1 text-sm text-muted-foreground">This service is not in the current service book.</p>
        <Button className="mt-4" size="sm" render={<Link href="/services" />}>
          Back to services
        </Button>
      </div>
    );
  }

  function onStatus(status: ServiceStatus) {
    if (!service) return;

    changeStatus(service.id, status);
    setNotice(serviceStatusSummary(status));
  }

  return (
    <div className="flex min-w-0 flex-col gap-4">
      <ServiceDetailHeader
        service={service}
        onStatus={onStatus}
        onActivate={() => onStatus("LIVE")}
        onSuspend={() => setSuspendOpen(true)}
        onNote={() => document.getElementById("service-notes")?.scrollIntoView({ behavior: "smooth" })}
      />
      {notice ? <p className="text-sm text-emerald-700 dark:text-emerald-400">{notice}</p> : null}
      <ServiceSummary service={service} />
      <div className="grid gap-4 xl:grid-cols-2">
        <ServiceCircuit service={service} />
        <ServiceHealth
          service={service}
          onRecord={(check) => {
            recordCheck(service.id, check);
            setNotice(`Health check recorded: ${check.name}`);
          }}
        />
      </div>
      <section className="rounded-lg border bg-card px-4 py-3">
        <h2 className="text-sm font-medium">Documents</h2>
        <ul className="mt-3 flex flex-col gap-2">
          {documents.map((file) => (
            <li key={file} className="flex items-center justify-between gap-3 border-t pt-2 first:border-0 first:pt-0">
              <span className="text-sm">{file}</span>
              <Button type="button" variant="outline" size="sm" onClick={() => setDocumentName(file)}>Open</Button>
            </li>
          ))}
        </ul>
      </section>
      <div className="grid gap-4 xl:grid-cols-2">
        <ServiceTimeline service={service} />
        <ServiceNotes
          service={service}
          onAdd={(body) => {
            addNote(service.id, body);
            setNotice("Internal note added.");
          }}
        />
      </div>
      <Dialog open={suspendOpen} onOpenChange={setSuspendOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Suspend Service</DialogTitle>
            <DialogDescription>The service stays on the customer record and leaves the live inventory.</DialogDescription>
          </DialogHeader>
          <form
            className="flex flex-col gap-3"
            onSubmit={(event) => {
              event.preventDefault();

              if (!reason.trim()) return;

              suspendService(service.id, reason.trim());
              setSuspendOpen(false);
              setNotice("Service suspended.");
            }}
          >
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="suspend-reason">Reason</Label>
              <textarea id="suspend-reason" className={fieldClass} value={reason} onChange={(event) => setReason(event.target.value)} />
            </div>
            <div className="flex justify-end">
              <Button type="submit" size="sm">Suspend Service</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
      <Dialog open={documentName !== null} onOpenChange={(open) => setDocumentName(open ? documentName : null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{documentName}</DialogTitle>
            <DialogDescription>Document preview will open when the documents workspace is connected.</DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
}
