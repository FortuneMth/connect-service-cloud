import { CustomerPanel } from "@/components/customers/customer-panel";
import { StatusBadge } from "@/components/shell/status-badge";
import { formatRand, type CustomerRecord } from "@/data/customers";

export function CustomerQuotes({ customer }: { customer: CustomerRecord }) {
  return (
    <CustomerPanel title="Quotes">
      {customer.quotes.length === 0 ? (
        <p className="px-4 py-6 text-sm text-muted-foreground">No quotes for this customer yet.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[680px] text-sm">
            <thead>
              <tr className="border-b text-left text-xs text-muted-foreground">
                <th className="px-4 py-2 font-medium">Quote number</th>
                <th className="px-4 py-2 font-medium">Description</th>
                <th className="px-4 py-2 font-medium">Status</th>
                <th className="px-4 py-2 font-medium">Value</th>
                <th className="px-4 py-2 font-medium">Expiry</th>
                <th className="px-4 py-2 font-medium">Created</th>
              </tr>
            </thead>
            <tbody>
              {customer.quotes.map((quote) => (
                <tr key={quote.id} className="border-b last:border-b-0">
                  <td className="px-4 py-2.5 font-medium whitespace-nowrap tabular-nums">{quote.quoteNumber}</td>
                  <td className="px-4 py-2.5">{quote.description}</td>
                  <td className="px-4 py-2.5">
                    <StatusBadge status={quote.status} />
                  </td>
                  <td className="px-4 py-2.5 whitespace-nowrap tabular-nums">{formatRand(quote.value)}</td>
                  <td className="px-4 py-2.5 whitespace-nowrap text-muted-foreground">{quote.expiryLabel}</td>
                  <td className="px-4 py-2.5 whitespace-nowrap text-muted-foreground">{quote.createdLabel}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </CustomerPanel>
  );
}
