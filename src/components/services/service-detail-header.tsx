"use client";

import Link from "next/link";

import { StatusBadge } from "@/components/shell/status-badge";
import { Button } from "@/components/ui/button";
import { HEALTH_LABEL, SERVICE_STATUSES, SERVICE_STATUS_LABEL, type ServiceRecord, type ServiceStatus } from "@/data/services";

const selectClass =
  "h-8 rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50";

export function ServiceDetailHeader({
  service,
  onStatus,
  onActivate,
  onSuspend,
  onNote,
}: {
  service: ServiceRecord;
  onStatus: (status: ServiceStatus) => void;
  onActivate: () => void;
  onSuspend: () => void;
  onNote: () => void;
}) {
  const closed = service.status === "CANCELLED" || service.status === "LIVE";

  return (
    <div className="flex min-w-0 flex-col gap-3">
      <div className="flex flex-col gap-2 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0">
          <p className="font-mono text-xs text-muted-foreground">{service.serviceNumber}</p>
          <h1 className="mt-1 font-heading text-xl font-semibold tracking-tight">{service.product}</h1>
          <p className="mt-1 flex flex-wrap gap-x-3 gap-y-1 text-sm text-muted-foreground">
            <Link href={`/customers/${service.customerId}`} className="underline-offset-4 hover:underline">{service.customerName}</Link>
            <span>{service.siteName}</span>
            <Link href={`/orders/${service.orderId}`} className="font-mono underline-offset-4 hover:underline">{service.orderNumber}</Link>
            {service.installationId ? (
              <Link href={`/installations/${service.installationId}`} className="font-mono underline-offset-4 hover:underline">{service.installationNumber}</Link>
            ) : null}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <StatusBadge status={SERVICE_STATUS_LABEL[service.status]} />
          <StatusBadge status={HEALTH_LABEL[service.health]} />
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <label className="text-xs text-muted-foreground" htmlFor="service-status">Change Status</label>
        <select
          id="service-status"
          className={selectClass}
          value={service.status}
          onChange={(event) => onStatus(event.target.value as ServiceStatus)}
        >
          {SERVICE_STATUSES.map((status) => (
            <option key={status} value={status}>{SERVICE_STATUS_LABEL[status]}</option>
          ))}
        </select>
        <Button type="button" size="sm" disabled={closed} onClick={onActivate}>Activate Service</Button>
        <Button type="button" variant="outline" size="sm" disabled={service.status === "CANCELLED" || service.status === "SUSPENDED"} onClick={onSuspend}>
          Suspend Service
        </Button>
        <Button type="button" variant="outline" size="sm" onClick={onNote}>Add Note</Button>
      </div>
    </div>
  );
}
