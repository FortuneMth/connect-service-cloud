"use client";

import Link from "next/link";

import { StatusBadge } from "@/components/shell/status-badge";
import { Button } from "@/components/ui/button";
import {
  INSTALLATION_PRIORITY_LABEL,
  INSTALLATION_STATUSES,
  INSTALLATION_STATUS_LABEL,
  type InstallationRecord,
  type InstallationStatus,
} from "@/data/installations";

const selectClass =
  "h-8 rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50";

export function InstallationDetailHeader({
  installation,
  onStatus,
  onReschedule,
  onAssign,
  onReady,
  onStart,
  onComplete,
  onNote,
}: {
  installation: InstallationRecord;
  onStatus: (status: InstallationStatus) => void;
  onReschedule: () => void;
  onAssign: () => void;
  onReady: () => void;
  onStart: () => void;
  onComplete: () => void;
  onNote: () => void;
}) {
  return (
    <div className="flex min-w-0 flex-col gap-3">
      <div className="flex flex-col gap-2 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0">
          <p className="font-mono text-xs text-muted-foreground">{installation.installationNumber}</p>
          <h1 className="mt-1 font-heading text-xl font-semibold tracking-tight">{installation.siteName}</h1>
          <p className="mt-1 flex flex-wrap gap-x-3 gap-y-1 text-sm text-muted-foreground">
            <Link href={`/customers/${installation.customerId}`} className="underline-offset-4 hover:underline">{installation.customerName}</Link>
            <Link href={`/orders/${installation.orderId}`} className="font-mono underline-offset-4 hover:underline">{installation.orderNumber}</Link>
            <Link href={`/services/${installation.serviceId}`} className="underline-offset-4 hover:underline">{installation.serviceName}</Link>
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <StatusBadge status={INSTALLATION_STATUS_LABEL[installation.status]} />
          <StatusBadge status={INSTALLATION_PRIORITY_LABEL[installation.priority]} />
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <label className="text-xs text-muted-foreground" htmlFor="installation-status">Change Status</label>
        <select
          id="installation-status"
          className={selectClass}
          value={installation.status}
          onChange={(event) => onStatus(event.target.value as InstallationStatus)}
        >
          {INSTALLATION_STATUSES.map((status) => (
            <option key={status} value={status}>{INSTALLATION_STATUS_LABEL[status]}</option>
          ))}
        </select>
        <Button type="button" variant="outline" size="sm" onClick={onReschedule}>Reschedule</Button>
        <Button type="button" variant="outline" size="sm" onClick={onAssign}>Assign Technician</Button>
        <Button type="button" variant="outline" size="sm" onClick={onReady}>Mark Ready</Button>
        <Button type="button" size="sm" onClick={onStart}>Start Installation</Button>
        <Button type="button" variant="outline" size="sm" onClick={onComplete}>Complete Installation</Button>
        <Button type="button" variant="outline" size="sm" onClick={onNote}>Add Note</Button>
      </div>
    </div>
  );
}
