import { CustomerPanel } from "@/components/customers/customer-panel";
import { StatusBadge } from "@/components/shell/status-badge";
import { formatRand, SERVICE_STATUS_LABEL, type CustomerRecord } from "@/data/customers";

export function CustomerServices({ customer }: { customer: CustomerRecord }) {
  const truncated = customer.serviceCount > customer.services.length;

  return (
    <CustomerPanel
      title="Active services"
      description={
        truncated
          ? `Showing ${customer.services.length} primary services of ${customer.serviceCount}.`
          : undefined
      }
    >
      {customer.services.length === 0 ? (
        <p className="px-4 py-6 text-sm text-muted-foreground">No services are active on this account yet.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] text-sm">
            <thead>
              <tr className="border-b text-left text-xs text-muted-foreground">
                <th className="px-4 py-2 font-medium">Service number</th>
                <th className="px-4 py-2 font-medium">Product</th>
                <th className="px-4 py-2 font-medium">Site</th>
                <th className="px-4 py-2 font-medium">Bandwidth</th>
                <th className="px-4 py-2 font-medium">Status</th>
                <th className="px-4 py-2 font-medium">Monthly Recurring Revenue</th>
              </tr>
            </thead>
            <tbody>
              {customer.services.map((service) => (
                <tr key={service.id} className="border-b last:border-b-0">
                  <td className="px-4 py-2.5 font-medium whitespace-nowrap tabular-nums">
                    {service.serviceNumber}
                  </td>
                  <td className="px-4 py-2.5 whitespace-nowrap">{service.productName}</td>
                  <td className="px-4 py-2.5 whitespace-nowrap">{service.siteName}</td>
                  <td className="px-4 py-2.5 whitespace-nowrap">{service.bandwidth}</td>
                  <td className="px-4 py-2.5">
                    <StatusBadge status={SERVICE_STATUS_LABEL[service.status]} />
                  </td>
                  <td className="px-4 py-2.5 whitespace-nowrap tabular-nums">
                    {formatRand(service.monthlyRecurringCharge)}/month
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </CustomerPanel>
  );
}
