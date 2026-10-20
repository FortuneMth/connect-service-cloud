"use client";

import { useRouter } from "next/navigation";

import { StatusBadge } from "@/components/shell/status-badge";
import { HEALTH_LABEL, SERVICE_STATUS_LABEL, type ServiceRecord } from "@/data/services";

export function ActivationQueue({ services }: { services: ServiceRecord[] }) {
  const router = useRouter();
  const queue = services
    .filter((item) => item.status === "TESTING")
    .sort((left, right) => left.serviceNumber.localeCompare(right.serviceNumber));

  return (
    <section className="min-w-0">
      <div className="mb-2">
        <h2 className="text-sm font-medium">Ready to activate</h2>
        <p className="text-xs text-muted-foreground">Services in testing that still need a go-live decision</p>
      </div>
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        {queue.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => router.push(`/services/${item.id}`)}
            className="rounded-lg border bg-card px-4 py-3 text-left"
          >
            <h3 className="text-sm font-medium">{item.siteName}</h3>
            <p className="mt-1 font-mono text-xs text-muted-foreground">{item.serviceNumber}</p>
            <dl className="mt-3 grid grid-cols-2 gap-x-3 gap-y-2 text-xs">
              <div>
                <dt className="text-muted-foreground">Customer</dt>
                <dd>{item.customerName}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Order</dt>
                <dd className="font-mono">{item.orderNumber}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Service</dt>
                <dd>{item.product}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Health</dt>
                <dd>{HEALTH_LABEL[item.health]}</dd>
              </div>
            </dl>
            <div className="mt-3 flex flex-wrap items-center gap-1.5">
              <StatusBadge status={SERVICE_STATUS_LABEL[item.status]} />
              <StatusBadge status={HEALTH_LABEL[item.health]} />
            </div>
            {item.risk ? <p className="mt-2 text-xs text-muted-foreground">{item.risk}</p> : null}
          </button>
        ))}
      </div>
    </section>
  );
}
