"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

import { usePortalDelivery } from "@/components/portal/portal-delivery-store";
import { StatusBadge } from "@/components/shell/status-badge";
import { Button } from "@/components/ui/button";
import { ESCALATION_STATUS_LABEL, STAGE_SHORT_LABEL } from "@/data/portal";

export function DeliveryEscalations() {
  const { escalations } = usePortalDelivery();
  const router = useRouter();
  const open = escalations.filter((item) => item.status !== "RESOLVED");

  return (
    <section className="min-w-0 rounded-lg border bg-card">
      <header className="border-b px-4 py-2.5">
        <h2 className="text-sm font-medium">Escalations</h2>
        <p className="mt-0.5 text-xs text-muted-foreground">
          Customer escalations that need a delivery response.
        </p>
      </header>
      {open.length === 0 ? (
        <p className="px-4 py-6 text-sm text-muted-foreground">No open escalations.</p>
      ) : (
        <ul className="divide-y">
          {open.map((item) => (
            <li key={item.id} className="grid gap-3 px-4 py-3 xl:grid-cols-[minmax(0,1fr)_auto] xl:items-start">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="font-mono text-sm font-medium">{item.reference}</p>
                  <StatusBadge status={ESCALATION_STATUS_LABEL[item.status]} />
                  <StatusBadge status="High" />
                  <StatusBadge status={STAGE_SHORT_LABEL[item.stage]} />
                </div>
                <p className="mt-1 text-sm">
                  {item.customerName} ·{" "}
                  <Link href={`/orders/${item.orderId}`} className="font-mono underline-offset-4 hover:underline">
                    {item.orderNumber}
                  </Link>
                </p>
                <p className="mt-1 text-sm font-medium">{item.reason}</p>
                <p className="mt-1 text-sm text-muted-foreground">&ldquo;{item.message}&rdquo;</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Assigned: {item.assignedTo} · SLA: 4 hours · {item.submittedLabel}
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button type="button" size="sm" variant="outline" render={<Link href={`/orders/${item.orderId}`} />}>
                  Open Order
                </Button>
                <Button type="button" size="sm" variant="outline" render={<Link href={`mailto:customer@${item.customerName.toLowerCase().replace(/\s+/g, "")}.demo`} />}>
                  Contact Customer
                </Button>
                <Button type="button" size="sm" variant="outline" onClick={() => router.push(`/service-delivery/escalations/${item.id}`)}>
                  Assign
                </Button>
                <Button type="button" size="sm" onClick={() => router.push(`/service-delivery/escalations/${item.id}`)}>
                  Resolve
                </Button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
