import Link from "next/link";

import { StatusBadge } from "@/components/shell/status-badge";
import { CustomerLink, OrderLink } from "@/components/service-delivery/feasibility-workspace";
import type { ActivationReadinessItem } from "@/data/service-delivery";

export function ActivationReadiness({ items }: { items: ActivationReadinessItem[] }) {
  return (
    <section className="min-w-0 rounded-lg border bg-card">
      <header className="border-b px-4 py-2.5">
        <h2 className="text-sm font-medium">Activation readiness</h2>
        <p className="mt-0.5 text-xs text-muted-foreground">Services approaching the activation window.</p>
      </header>
      <ul className="divide-y">
        {items.map((item) => (
          <li key={item.id} className="grid gap-3 px-4 py-3 text-sm lg:grid-cols-[minmax(0,1.1fr)_repeat(4,minmax(0,0.7fr))]">
            <div className="min-w-0">
              <OrderLink id={item.orderId} number={item.orderNumber} />
              <p className="mt-1"><CustomerLink id={item.customerId} name={item.customerName} /></p>
              <p className="mt-1">
                <Link href={`/services/${item.serviceId}`} className="underline-offset-4 hover:underline">
                  {item.serviceNumber}
                </Link>
              </p>
              <p className="text-muted-foreground">{item.service}</p>
            </div>
            <Readiness label="Testing" value={item.testing} />
            <Readiness label="Customer acceptance" value={item.customerAcceptance} />
            <Readiness label="Billing" value={item.billingSetup} />
            <Readiness label="Activation" value={item.activation} />
          </li>
        ))}
      </ul>
    </section>
  );
}

function Readiness({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs text-muted-foreground">{label}</p>
      <div className="mt-1">
        <StatusBadge status={value} />
      </div>
    </div>
  );
}
