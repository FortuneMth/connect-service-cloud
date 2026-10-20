import { CustomerPanel } from "@/components/customers/customer-panel";
import { StatusBadge } from "@/components/shell/status-badge";
import { SITE_STATUS_LABEL, type CustomerRecord } from "@/data/customers";

export function CustomerSites({ customer }: { customer: CustomerRecord }) {
  const truncated = customer.siteCount > customer.sites.length;

  return (
    <CustomerPanel
      title="Sites"
      description={
        truncated
          ? `Showing ${customer.sites.length} primary locations of ${customer.siteCount}.`
          : undefined
      }
    >
      {customer.sites.length === 0 ? (
        <p className="px-4 py-6 text-sm text-muted-foreground">No sites on this account yet.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] text-sm">
            <thead>
              <tr className="border-b text-left text-xs text-muted-foreground">
                <th className="px-4 py-2 font-medium">Site</th>
                <th className="px-4 py-2 font-medium">Site Code</th>
                <th className="px-4 py-2 font-medium">Address</th>
                <th className="px-4 py-2 font-medium">City</th>
                <th className="px-4 py-2 font-medium">Service Count</th>
                <th className="px-4 py-2 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {customer.sites.map((site) => (
                <tr key={site.id} className="border-b last:border-b-0">
                  <td className="px-4 py-2.5 font-medium">{site.name}</td>
                  <td className="px-4 py-2.5 whitespace-nowrap text-muted-foreground">{site.siteCode}</td>
                  <td className="px-4 py-2.5">{site.addressLine1}</td>
                  <td className="px-4 py-2.5 whitespace-nowrap">{site.city}</td>
                  <td className="px-4 py-2.5 tabular-nums">{site.serviceCount}</td>
                  <td className="px-4 py-2.5">
                    <StatusBadge status={SITE_STATUS_LABEL[site.status]} />
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
