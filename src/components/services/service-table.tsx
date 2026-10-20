"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

import { StatusBadge } from "@/components/shell/status-badge";
import { Button } from "@/components/ui/button";
import { formatRand } from "@/data/customers";
import { HEALTH_LABEL, SERVICE_STATUS_LABEL, type ServiceRecord } from "@/data/services";

export function ServiceTable({ services }: { services: ServiceRecord[] }) {
  const router = useRouter();

  if (services.length === 0) {
    return (
      <div className="rounded-lg border bg-card px-4 py-8 text-sm text-muted-foreground">
        No services match these filters.
      </div>
    );
  }

  return (
    <>
      <div className="hidden min-w-0 overflow-x-auto md:block">
        <table className="w-full min-w-[68rem] text-left text-sm">
          <thead className="text-xs text-muted-foreground">
            <tr className="border-b">
              <th className="px-3 py-2 font-medium">Service</th>
              <th className="px-3 py-2 font-medium">Customer</th>
              <th className="px-3 py-2 font-medium">Site</th>
              <th className="hidden px-3 py-2 font-medium lg:table-cell">Product</th>
              <th className="px-3 py-2 font-medium">Order</th>
              <th className="px-3 py-2 font-medium">Status</th>
              <th className="px-3 py-2 font-medium">Health</th>
              <th className="hidden px-3 py-2 font-medium xl:table-cell">Bandwidth</th>
              <th className="px-3 py-2 font-medium">Monthly</th>
              <th className="hidden px-3 py-2 font-medium lg:table-cell">Activated</th>
              <th className="px-3 py-2 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {services.map((item) => (
              <tr
                key={item.id}
                className="cursor-pointer border-b last:border-0 hover:bg-muted/40"
                onClick={() => router.push(`/services/${item.id}`)}
              >
                <td className="px-3 py-2">
                  <p className="font-mono text-xs">{item.serviceNumber}</p>
                  <p className="text-xs text-muted-foreground">{item.accessType}</p>
                </td>
                <td className="px-3 py-2">
                  <Link href={`/customers/${item.customerId}`} className="underline-offset-4 hover:underline" onClick={(event) => event.stopPropagation()}>
                    {item.customerName}
                  </Link>
                </td>
                <td className="px-3 py-2">{item.siteName}</td>
                <td className="hidden px-3 py-2 lg:table-cell">{item.product}</td>
                <td className="px-3 py-2">
                  <Link href={`/orders/${item.orderId}`} className="font-mono text-xs underline-offset-4 hover:underline" onClick={(event) => event.stopPropagation()}>
                    {item.orderNumber}
                  </Link>
                </td>
                <td className="px-3 py-2"><StatusBadge status={SERVICE_STATUS_LABEL[item.status]} /></td>
                <td className="px-3 py-2"><StatusBadge status={HEALTH_LABEL[item.health]} /></td>
                <td className="hidden px-3 py-2 xl:table-cell">{item.bandwidth}</td>
                <td className="px-3 py-2 tabular-nums">{formatRand(item.monthly)}</td>
                <td className="hidden px-3 py-2 lg:table-cell">{item.activatedLabel}</td>
                <td className="px-3 py-2">
                  <Button variant="outline" size="sm" render={<Link href={`/services/${item.id}`} />} onClick={(event) => event.stopPropagation()}>
                    Open
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <ul className="flex flex-col gap-2 md:hidden">
        {services.map((item) => (
          <li key={item.id}>
            <button
              type="button"
              onClick={() => router.push(`/services/${item.id}`)}
              className="w-full rounded-lg border bg-card px-3 py-3 text-left"
            >
              <p className="font-mono text-xs text-muted-foreground">{item.serviceNumber}</p>
              <p className="mt-1 text-sm font-medium">{item.siteName}</p>
              <p className="text-sm text-muted-foreground">{item.customerName}</p>
              <p className="mt-1 text-xs text-muted-foreground">{item.product} · {formatRand(item.monthly)}</p>
              <div className="mt-2 flex flex-wrap gap-1.5">
                <StatusBadge status={SERVICE_STATUS_LABEL[item.status]} />
                <StatusBadge status={HEALTH_LABEL[item.health]} />
              </div>
              {item.risk ? <p className="mt-2 text-xs text-muted-foreground">{item.risk}</p> : null}
            </button>
          </li>
        ))}
      </ul>
    </>
  );
}
