import { DashboardSection } from "@/components/dashboard/dashboard-section";
import { StatusBadge } from "@/components/shell/status-badge";
import {
  INSTALLATION_STATUS_LABEL,
  type UpcomingInstallation,
} from "@/data/operations-dashboard";

export function UpcomingInstallations({
  installations,
}: {
  installations: UpcomingInstallation[];
}) {
  return (
    <DashboardSection title="Upcoming Installations">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[640px] text-sm">
          <thead>
            <tr className="border-b text-left text-xs text-muted-foreground">
              <th scope="col" className="px-4 py-2 font-medium">Customer</th>
              <th scope="col" className="px-4 py-2 font-medium">Site</th>
              <th scope="col" className="px-4 py-2 font-medium">Service</th>
              <th scope="col" className="px-4 py-2 font-medium">Engineer</th>
              <th scope="col" className="px-4 py-2 font-medium">Date</th>
              <th scope="col" className="px-4 py-2 font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {installations.map((installation) => (
              <tr key={installation.id} className="border-b last:border-b-0">
                <td className="px-4 py-2.5 whitespace-nowrap">{installation.customerName}</td>
                <td className="px-4 py-2.5 whitespace-nowrap">{installation.siteName}</td>
                <td className="px-4 py-2.5 whitespace-nowrap">{installation.serviceName}</td>
                <td className="px-4 py-2.5 whitespace-nowrap">{installation.engineerName}</td>
                <td className="px-4 py-2.5 whitespace-nowrap text-muted-foreground tabular-nums">
                  {installation.dateLabel}
                </td>
                <td className="px-4 py-2.5">
                  <StatusBadge status={INSTALLATION_STATUS_LABEL[installation.status]} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </DashboardSection>
  );
}
