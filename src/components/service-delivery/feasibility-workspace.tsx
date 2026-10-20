"use client";

import Link from "next/link";

import { useDelivery } from "@/components/service-delivery/delivery-store";
import { StatusBadge } from "@/components/shell/status-badge";
import {
  FEASIBILITY_STATUSES,
  FEASIBILITY_STATUS_LABEL,
  type FeasibilityItem,
  type FeasibilityStatus,
} from "@/data/service-delivery";

const selectClass =
  "h-8 rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50";

export function FeasibilityWorkspace({ items }: { items: FeasibilityItem[] }) {
  const { setFeasibilityStatus } = useDelivery();

  return (
    <section className="min-w-0 rounded-lg border bg-card">
      <header className="border-b px-4 py-2.5">
        <h2 className="text-sm font-medium">Feasibility</h2>
        <p className="mt-0.5 text-xs text-muted-foreground">Coverage and capacity checks sitting in front of planning.</p>
      </header>
      <div className="hidden overflow-x-auto md:block">
        <table className="w-full min-w-[64rem] text-left text-sm">
          <thead className="border-b bg-muted/40 text-xs text-muted-foreground">
            <tr>
              <th className="px-3 py-2 font-medium">Order</th>
              <th className="px-3 py-2 font-medium">Customer</th>
              <th className="px-3 py-2 font-medium">Sites</th>
              <th className="px-3 py-2 font-medium">Technology</th>
              <th className="px-3 py-2 font-medium">Coverage</th>
              <th className="px-3 py-2 font-medium">Capacity</th>
              <th className="px-3 py-2 font-medium">Result</th>
              <th className="px-3 py-2 font-medium">Owner</th>
              <th className="px-3 py-2 font-medium">Due</th>
              <th className="px-3 py-2 font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id} className="border-b last:border-0">
                <td className="px-3 py-2.5"><OrderLink id={item.orderId} number={item.orderNumber} /></td>
                <td className="px-3 py-2.5"><CustomerLink id={item.customerId} name={item.customerName} /></td>
                <td className="px-3 py-2.5">{item.sites}</td>
                <td className="px-3 py-2.5">{item.technology}</td>
                <td className="px-3 py-2.5">{item.coverage}</td>
                <td className="px-3 py-2.5">{item.capacity}</td>
                <td className="px-3 py-2.5">{item.result}</td>
                <td className="px-3 py-2.5">{item.ownerName}</td>
                <td className="px-3 py-2.5">{item.dueLabel}</td>
                <td className="px-3 py-2.5">
                  <select
                    aria-label={`Feasibility status for ${item.orderNumber}`}
                    className={selectClass}
                    value={item.status}
                    onChange={(event) => setFeasibilityStatus(item.id, event.target.value as FeasibilityStatus)}
                  >
                    {FEASIBILITY_STATUSES.map((status) => (
                      <option key={status} value={status}>{FEASIBILITY_STATUS_LABEL[status]}</option>
                    ))}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <ul className="divide-y md:hidden">
        {items.map((item) => (
          <li key={item.id} className="flex flex-col gap-2 px-4 py-3 text-sm">
            <div className="flex items-start justify-between gap-3">
              <div>
                <OrderLink id={item.orderId} number={item.orderNumber} />
                <p className="text-muted-foreground">{item.customerName}</p>
              </div>
              <StatusBadge status={FEASIBILITY_STATUS_LABEL[item.status]} />
            </div>
            <p>{item.sites} · {item.technology} · {item.coverage}</p>
            <p className="text-xs text-muted-foreground">{item.result} · {item.ownerName} · Due {item.dueLabel}</p>
            <select
              aria-label={`Feasibility status for ${item.orderNumber}`}
              className={selectClass}
              value={item.status}
              onChange={(event) => setFeasibilityStatus(item.id, event.target.value as FeasibilityStatus)}
            >
              {FEASIBILITY_STATUSES.map((status) => (
                <option key={status} value={status}>{FEASIBILITY_STATUS_LABEL[status]}</option>
              ))}
            </select>
          </li>
        ))}
      </ul>
    </section>
  );
}

export function OrderLink({ id, number }: { id: string; number: string }) {
  return (
    <Link href={`/orders/${id}`} className="font-medium underline-offset-4 hover:underline">
      {number}
    </Link>
  );
}

export function CustomerLink({ id, name }: { id: string; name: string }) {
  return (
    <Link href={`/customers/${id}`} className="underline-offset-4 hover:underline">
      {name}
    </Link>
  );
}
