import { StatusBadge } from "@/components/shell/status-badge";
import { CustomerLink, OrderLink } from "@/components/service-delivery/feasibility-workspace";
import type { PlanningItem } from "@/data/service-delivery";

export function PlanningWorkspace({ items }: { items: PlanningItem[] }) {
  return (
    <section className="min-w-0 rounded-lg border bg-card">
      <header className="border-b px-4 py-2.5">
        <h2 className="text-sm font-medium">Network planning</h2>
        <p className="mt-0.5 text-xs text-muted-foreground">Design and network resource handover before build.</p>
      </header>
      <div className="hidden overflow-x-auto md:block">
        <table className="w-full min-w-[64rem] text-left text-sm">
          <thead className="border-b bg-muted/40 text-xs text-muted-foreground">
            <tr>
              <th className="px-3 py-2 font-medium">Order</th>
              <th className="px-3 py-2 font-medium">Customer</th>
              <th className="px-3 py-2 font-medium">Service</th>
              <th className="px-3 py-2 font-medium">Design Status</th>
              <th className="px-3 py-2 font-medium">Network Resource</th>
              <th className="px-3 py-2 font-medium">Handover</th>
              <th className="px-3 py-2 font-medium">Engineer</th>
              <th className="px-3 py-2 font-medium">Due</th>
              <th className="px-3 py-2 font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id} className="border-b last:border-0">
                <td className="px-3 py-2.5"><OrderLink id={item.orderId} number={item.orderNumber} /></td>
                <td className="px-3 py-2.5"><CustomerLink id={item.customerId} name={item.customerName} /></td>
                <td className="px-3 py-2.5">{item.service}</td>
                <td className="px-3 py-2.5">{item.designStatus}</td>
                <td className="px-3 py-2.5">{item.networkResource}</td>
                <td className="px-3 py-2.5">{item.handover}</td>
                <td className="px-3 py-2.5">{item.engineerName}</td>
                <td className="px-3 py-2.5">{item.dueLabel}</td>
                <td className="px-3 py-2.5"><StatusBadge status={item.status} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <ul className="divide-y md:hidden">
        {items.map((item) => (
          <li key={item.id} className="flex flex-col gap-1 px-4 py-3 text-sm">
            <div className="flex items-start justify-between gap-3">
              <OrderLink id={item.orderId} number={item.orderNumber} />
              <StatusBadge status={item.status} />
            </div>
            <p>{item.customerName}</p>
            <p>{item.service}</p>
            <p className="text-xs text-muted-foreground">
              {item.designStatus} · {item.networkResource} · {item.handover} · {item.engineerName} · Due {item.dueLabel}
            </p>
          </li>
        ))}
      </ul>
    </section>
  );
}
