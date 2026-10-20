import { QuotePanel } from "@/components/quotes/quote-panel";
import { StatusBadge } from "@/components/shell/status-badge";
import type { QuoteRecord } from "@/data/quotes";

export function QuoteSites({ quote }: { quote: QuoteRecord }) {
  return (
    <QuotePanel title="Sites" description="Locations included on this quote.">
      <div className="hidden overflow-x-auto md:block">
        <table className="w-full min-w-[40rem] text-left text-sm">
          <thead className="border-b bg-muted/40 text-xs text-muted-foreground">
            <tr>
              <th className="px-3 py-2 font-medium">Site</th>
              <th className="px-3 py-2 font-medium">Address</th>
              <th className="px-3 py-2 font-medium">Service</th>
              <th className="px-3 py-2 font-medium">Access Status</th>
              <th className="px-3 py-2 font-medium">Estimated Install Date</th>
            </tr>
          </thead>
          <tbody>
            {quote.sites.map((site) => (
              <tr key={site.id} className="border-b last:border-0">
                <td className="px-3 py-2.5 font-medium">{site.name}</td>
                <td className="px-3 py-2.5">{site.address}</td>
                <td className="px-3 py-2.5">{site.service}</td>
                <td className="px-3 py-2.5">
                  <StatusBadge status={site.accessStatus} />
                </td>
                <td className="px-3 py-2.5">{site.estimatedInstallLabel}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <ul className="flex flex-col gap-2 p-3 md:hidden">
        {quote.sites.map((site) => (
          <li key={site.id} className="rounded-lg border px-3 py-3">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="font-medium">{site.name}</p>
                <p className="text-sm text-muted-foreground">{site.address}</p>
              </div>
              <StatusBadge status={site.accessStatus} />
            </div>
            <p className="mt-2 text-sm">{site.service}</p>
            <p className="text-xs text-muted-foreground">Install {site.estimatedInstallLabel}</p>
          </li>
        ))}
      </ul>
    </QuotePanel>
  );
}
