import { StatusBadge } from "@/components/shell/status-badge";
import { CustomerLink, OrderLink } from "@/components/service-delivery/feasibility-workspace";
import type { InstallationReadinessItem } from "@/data/service-delivery";

export function InstallationReadiness({ items }: { items: InstallationReadinessItem[] }) {
  return (
    <section className="min-w-0 rounded-lg border bg-card">
      <header className="border-b px-4 py-2.5">
        <h2 className="text-sm font-medium">Installation readiness</h2>
        <p className="mt-0.5 text-xs text-muted-foreground">Upcoming site work. The installations workspace will take this over later.</p>
      </header>
      <div className="hidden overflow-x-auto md:block">
        <table className="w-full min-w-[68rem] text-left text-sm">
          <thead className="border-b bg-muted/40 text-xs text-muted-foreground">
            <tr>
              <th className="px-3 py-2 font-medium">Order</th>
              <th className="px-3 py-2 font-medium">Customer</th>
              <th className="px-3 py-2 font-medium">Site</th>
              <th className="px-3 py-2 font-medium">Scheduled Date</th>
              <th className="px-3 py-2 font-medium">Site Access</th>
              <th className="px-3 py-2 font-medium">CPE</th>
              <th className="px-3 py-2 font-medium">Materials</th>
              <th className="px-3 py-2 font-medium">Technician</th>
              <th className="px-3 py-2 font-medium">Readiness</th>
              <th className="px-3 py-2 font-medium">Risk</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id} className="border-b last:border-0">
                <td className="px-3 py-2.5"><OrderLink id={item.orderId} number={item.orderNumber} /></td>
                <td className="px-3 py-2.5"><CustomerLink id={item.customerId} name={item.customerName} /></td>
                <td className="px-3 py-2.5">{item.site}</td>
                <td className="px-3 py-2.5">{item.scheduledLabel}</td>
                <td className="px-3 py-2.5">{item.siteAccess}</td>
                <td className="px-3 py-2.5">{item.cpe}</td>
                <td className="px-3 py-2.5">{item.materials}</td>
                <td className="px-3 py-2.5">{item.technician}</td>
                <td className="px-3 py-2.5"><StatusBadge status={item.readiness} /></td>
                <td className="px-3 py-2.5">{item.risk}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <ul className="divide-y md:hidden">
        {items.map((item) => (
          <li key={item.id} className="flex flex-col gap-1 px-4 py-3 text-sm">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="font-medium">{item.site}</p>
                <p className="text-muted-foreground">{item.customerName}</p>
              </div>
              <StatusBadge status={item.readiness} />
            </div>
            <p className="text-xs text-muted-foreground">
              {item.scheduledLabel} · Access {item.siteAccess} · CPE {item.cpe} · Materials {item.materials} · {item.technician}
            </p>
            <p className="text-xs text-muted-foreground">{item.risk}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
