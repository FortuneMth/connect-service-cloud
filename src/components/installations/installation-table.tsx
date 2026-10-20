"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

import { StatusBadge } from "@/components/shell/status-badge";
import { Button } from "@/components/ui/button";
import {
  INSTALLATION_PRIORITY_LABEL,
  INSTALLATION_STATUS_LABEL,
  READINESS_LABEL,
  type InstallationRecord,
} from "@/data/installations";

export function InstallationTable({ installations }: { installations: InstallationRecord[] }) {
  const router = useRouter();

  if (installations.length === 0) {
    return (
      <div className="rounded-lg border bg-card px-4 py-8 text-sm text-muted-foreground">
        No installations match these filters.
      </div>
    );
  }

  return (
    <>
      <div className="hidden min-w-0 overflow-x-auto md:block">
        <table className="w-full min-w-[68rem] text-left text-sm">
          <thead className="text-xs text-muted-foreground">
            <tr className="border-b">
              <th className="px-3 py-2 font-medium">Installation</th>
              <th className="px-3 py-2 font-medium">Order</th>
              <th className="px-3 py-2 font-medium">Customer</th>
              <th className="px-3 py-2 font-medium">Site</th>
              <th className="hidden px-3 py-2 font-medium lg:table-cell">Service</th>
              <th className="px-3 py-2 font-medium">Scheduled Date</th>
              <th className="hidden px-3 py-2 font-medium xl:table-cell">Technician</th>
              <th className="px-3 py-2 font-medium">Status</th>
              <th className="px-3 py-2 font-medium">Readiness</th>
              <th className="hidden px-3 py-2 font-medium lg:table-cell">Priority</th>
              <th className="hidden px-3 py-2 font-medium xl:table-cell">Risk</th>
              <th className="px-3 py-2 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {installations.map((item) => (
              <tr
                key={item.id}
                className="cursor-pointer border-b last:border-0 hover:bg-muted/30"
                onClick={() => router.push(`/installations/${item.id}`)}
              >
                <td className="px-3 py-2.5 font-mono text-xs">{item.installationNumber}</td>
                <td className="px-3 py-2.5" onClick={(event) => event.stopPropagation()}>
                  <Link href={`/orders/${item.orderId}`} className="font-mono text-xs underline-offset-4 hover:underline">
                    {item.orderNumber}
                  </Link>
                </td>
                <td className="px-3 py-2.5" onClick={(event) => event.stopPropagation()}>
                  <Link href={`/customers/${item.customerId}`} className="underline-offset-4 hover:underline">
                    {item.customerName}
                  </Link>
                </td>
                <td className="px-3 py-2.5">{item.siteName}</td>
                <td className="hidden px-3 py-2.5 lg:table-cell" onClick={(event) => event.stopPropagation()}>
                  <Link href={`/services/${item.serviceId}`} className="underline-offset-4 hover:underline">
                    {item.serviceName}
                  </Link>
                </td>
                <td className="px-3 py-2.5 whitespace-nowrap">{item.scheduledLabel} {item.scheduledTime}</td>
                <td className="hidden px-3 py-2.5 xl:table-cell">{item.technician}</td>
                <td className="px-3 py-2.5"><StatusBadge status={INSTALLATION_STATUS_LABEL[item.status]} /></td>
                <td className="px-3 py-2.5"><StatusBadge status={READINESS_LABEL[item.readiness]} /></td>
                <td className="hidden px-3 py-2.5 lg:table-cell"><StatusBadge status={INSTALLATION_PRIORITY_LABEL[item.priority]} /></td>
                <td className="hidden max-w-40 px-3 py-2.5 text-xs text-muted-foreground xl:table-cell">{item.risk || "—"}</td>
                <td className="px-3 py-2.5" onClick={(event) => event.stopPropagation()}>
                  <Button variant="outline" size="sm" render={<Link href={`/installations/${item.id}`} />}>
                    Open
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <ul className="flex flex-col gap-2 md:hidden">
        {installations.map((item) => (
          <li key={item.id}>
            <button
              type="button"
              onClick={() => router.push(`/installations/${item.id}`)}
              className="w-full rounded-lg border bg-card p-3 text-left"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="font-mono text-xs">{item.installationNumber}</p>
                  <p className="mt-1 text-sm font-medium">{item.siteName}</p>
                  <p className="text-xs text-muted-foreground">{item.customerName}</p>
                </div>
                <StatusBadge status={INSTALLATION_STATUS_LABEL[item.status]} />
              </div>
              <p className="mt-2 text-xs text-muted-foreground">
                {item.scheduledLabel} {item.scheduledTime} · {item.technician}
              </p>
              <div className="mt-2 flex flex-wrap gap-2">
                <StatusBadge status={READINESS_LABEL[item.readiness]} />
                <StatusBadge status={INSTALLATION_PRIORITY_LABEL[item.priority]} />
              </div>
              {item.risk ? <p className="mt-2 text-xs text-amber-700 dark:text-amber-400">{item.risk}</p> : null}
            </button>
          </li>
        ))}
      </ul>
    </>
  );
}
