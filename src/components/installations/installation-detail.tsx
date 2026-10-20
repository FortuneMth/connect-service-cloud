"use client";

import { useState } from "react";
import Link from "next/link";

import { CustomerAcceptance } from "@/components/installations/customer-acceptance";
import { InstallationChecklist } from "@/components/installations/installation-checklist";
import { InstallationDetailHeader } from "@/components/installations/installation-detail-header";
import { InstallationNotes } from "@/components/installations/installation-notes";
import { InstallationReadiness } from "@/components/installations/installation-readiness";
import { InstallationSummary } from "@/components/installations/installation-summary";
import { InstallationTimeline } from "@/components/installations/installation-timeline";
import { ReadinessChecklist } from "@/components/installations/readiness-checklist";
import { RescheduleInstallationDialog } from "@/components/installations/reschedule-installation-dialog";
import { SiteInformation } from "@/components/installations/site-information";
import { TechnicianAssignmentDialog } from "@/components/installations/technician-assignment-dialog";
import { TestResults } from "@/components/installations/test-results";
import { useInstallation, useInstallations } from "@/components/installations/installation-store";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export function InstallationDetail({ id }: { id: string }) {
  const installation = useInstallation(id);
  const store = useInstallations();
  const [rescheduleOpen, setRescheduleOpen] = useState(false);
  const [assignOpen, setAssignOpen] = useState(false);
  const [documentName, setDocumentName] = useState("");
  const [notice, setNotice] = useState("");

  if (!installation) {
    return (
      <div className="rounded-lg border bg-card px-4 py-8">
        <h1 className="font-heading text-lg font-semibold">Installation not found</h1>
        <p className="mt-1 text-sm text-muted-foreground">This installation is not in the local field book.</p>
        <Button className="mt-4" size="sm" render={<Link href="/installations" />}>
          Back to installations
        </Button>
      </div>
    );
  }

  return (
    <div className="flex min-w-0 flex-col gap-5">
      <InstallationDetailHeader
        installation={installation}
        onStatus={(status) => {
          store.changeStatus(installation.id, status);
          setNotice("Installation status updated.");
        }}
        onReschedule={() => setRescheduleOpen(true)}
        onAssign={() => setAssignOpen(true)}
        onReady={() => {
          store.changeStatus(installation.id, "READY");
          setNotice("Installation marked ready.");
        }}
        onStart={() => {
          store.changeStatus(installation.id, "IN_PROGRESS");
          setNotice("Installation started.");
        }}
        onComplete={() => {
          store.changeStatus(installation.id, "COMPLETED");
          setNotice("Installation completed.");
        }}
        onNote={() => document.getElementById("installation-notes")?.scrollIntoView({ block: "start" })}
      />
      {notice ? <p className="text-sm text-emerald-700 dark:text-emerald-400">{notice}</p> : null}
      <InstallationSummary installation={installation} />
      <div className="grid min-w-0 gap-5 xl:grid-cols-2">
        <SiteInformation installation={installation} />
        <InstallationReadiness installation={installation} />
      </div>
      <ReadinessChecklist installation={installation} onToggle={(itemId) => store.toggleReadiness(installation.id, itemId)} />
      <InstallationChecklist installation={installation} onToggle={(itemId) => store.toggleFieldCheck(installation.id, itemId)} />
      <div className="grid min-w-0 gap-5 xl:grid-cols-2">
        <TestResults installation={installation} onRecord={(test) => store.recordTest(installation.id, test)} />
        <CustomerAcceptance installation={installation} onRecord={(acceptance) => store.recordAcceptance(installation.id, acceptance)} />
      </div>
      <section className="rounded-lg border bg-card p-4">
        <h2 className="text-sm font-medium">Documents</h2>
        <ul className="mt-3 flex flex-col gap-2">
          {installation.documents.map((file) => (
            <li key={file.id} className="flex flex-wrap items-center justify-between gap-2 text-sm">
              <span>{file.name}</span>
              <Button type="button" variant="outline" size="sm" onClick={() => setDocumentName(file.name)}>
                Open
              </Button>
            </li>
          ))}
        </ul>
      </section>
      <div className="grid min-w-0 gap-5 xl:grid-cols-2">
        <InstallationTimeline installation={installation} />
        <InstallationNotes installation={installation} onAdd={(body) => store.addNote(installation.id, body)} />
      </div>

      <Dialog open={rescheduleOpen} onOpenChange={setRescheduleOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reschedule</DialogTitle>
            <DialogDescription>Move this site visit and record why.</DialogDescription>
          </DialogHeader>
          <RescheduleInstallationDialog
            date={installation.scheduledDate}
            time={installation.scheduledTime}
            onSubmit={(values) => {
              store.reschedule(installation.id, values.scheduledDate, values.scheduledTime, values.reason);
              setNotice("Installation rescheduled.");
            }}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={assignOpen} onOpenChange={setAssignOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Assign Technician</DialogTitle>
            <DialogDescription>Set the field team responsible for this installation.</DialogDescription>
          </DialogHeader>
          <TechnicianAssignmentDialog
            technician={installation.technician}
            onSubmit={(technician) => {
              store.assignTechnician(installation.id, technician);
              setNotice(`Assigned to ${technician}.`);
            }}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={documentName.length > 0} onOpenChange={(open) => { if (!open) setDocumentName(""); }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{documentName}</DialogTitle>
            <DialogDescription>Document preview will open when the documents workspace is connected.</DialogDescription>
          </DialogHeader>
          <div className="flex justify-end">
            <Button type="button" variant="outline" size="sm" onClick={() => setDocumentName("")}>Close</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
