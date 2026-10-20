"use client";

import { useRouter } from "next/navigation";

import { StatusBadge } from "@/components/shell/status-badge";
import {
  INSTALLATION_STATUS_LABEL,
  READINESS_LABEL,
  type InstallationRecord,
} from "@/data/installations";

export function UpcomingInstallations({ installations }: { installations: InstallationRecord[] }) {
  const router = useRouter();
  const upcoming = installations
    .filter((item) => item.status !== "COMPLETED" && item.status !== "CANCELLED")
    .sort((left, right) => `${left.scheduledDate}T${left.scheduledTime}`.localeCompare(`${right.scheduledDate}T${right.scheduledTime}`))
    .slice(0, 9);

  return (
    <section className="min-w-0">
      <div className="mb-2 flex items-baseline justify-between gap-3">
        <h2 className="text-sm font-medium">Upcoming installations</h2>
        <p className="text-xs text-muted-foreground">Next site visits</p>
      </div>
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {upcoming.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => router.push(`/installations/${item.id}`)}
            className="rounded-lg border bg-card p-4 text-left hover:bg-muted/30"
          >
            <div className="flex items-start justify-between gap-3">
              <h3 className="text-sm font-medium">{item.siteName}</h3>
              <StatusBadge status={INSTALLATION_STATUS_LABEL[item.status]} />
            </div>
            <dl className="mt-3 grid grid-cols-2 gap-x-3 gap-y-2 text-xs">
              <div>
                <dt className="text-muted-foreground">Date</dt>
                <dd>{item.scheduledLabel}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Time</dt>
                <dd className="tabular-nums">{item.scheduledTime}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Customer</dt>
                <dd>{item.customerName}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Order</dt>
                <dd className="font-mono">{item.orderNumber}</dd>
              </div>
              <div className="col-span-2">
                <dt className="text-muted-foreground">Service</dt>
                <dd>{item.serviceName}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Technician</dt>
                <dd>{item.technician}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Readiness</dt>
                <dd>{READINESS_LABEL[item.readiness]}</dd>
              </div>
            </dl>
            {item.risk ? <p className="mt-3 text-xs text-amber-700 dark:text-amber-400">{item.risk}</p> : null}
          </button>
        ))}
      </div>
    </section>
  );
}
