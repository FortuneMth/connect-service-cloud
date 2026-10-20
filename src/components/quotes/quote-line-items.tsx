import { QuotePanel } from "@/components/quotes/quote-panel";
import { formatRand, lineMonthly, lineOnceOff, type QuoteRecord } from "@/data/quotes";

export function QuoteLineItems({ quote }: { quote: QuoteRecord }) {
  const monthly = quote.lineItems.reduce((sum, item) => sum + lineMonthly(item), 0);
  const onceOff = quote.lineItems.reduce((sum, item) => sum + lineOnceOff(item), 0);

  return (
    <QuotePanel title="Line items" description="Services, sites, and charges on this quote.">
      <div className="hidden overflow-x-auto md:block">
        <table className="w-full min-w-[64rem] text-left text-sm">
          <thead className="border-b bg-muted/40 text-xs text-muted-foreground">
            <tr>
              <th className="px-3 py-2 font-medium">Product / Service</th>
              <th className="px-3 py-2 font-medium">Description</th>
              <th className="px-3 py-2 font-medium">Site</th>
              <th className="px-3 py-2 font-medium">Quantity</th>
              <th className="px-3 py-2 font-medium">Unit</th>
              <th className="px-3 py-2 font-medium">Monthly Price</th>
              <th className="px-3 py-2 font-medium">Once-off Price</th>
              <th className="px-3 py-2 font-medium">Total Monthly</th>
              <th className="px-3 py-2 font-medium">Total Once-off</th>
            </tr>
          </thead>
          <tbody>
            {quote.lineItems.map((item) => (
              <tr key={item.id} className="border-b last:border-0">
                <td className="px-3 py-2.5 font-medium">{item.product}</td>
                <td className="px-3 py-2.5">{item.description || "—"}</td>
                <td className="px-3 py-2.5">{item.site}</td>
                <td className="px-3 py-2.5 tabular-nums">{item.quantity}</td>
                <td className="px-3 py-2.5">{item.unit}</td>
                <td className="px-3 py-2.5 tabular-nums">{formatRand(item.monthlyPrice)}</td>
                <td className="px-3 py-2.5 tabular-nums">{formatRand(item.onceOffPrice)}</td>
                <td className="px-3 py-2.5 tabular-nums">{formatRand(lineMonthly(item))}</td>
                <td className="px-3 py-2.5 tabular-nums">{formatRand(lineOnceOff(item))}</td>
              </tr>
            ))}
          </tbody>
          <tfoot className="border-t bg-muted/20 text-sm font-medium">
            <tr>
              <td className="px-3 py-2.5" colSpan={7}>
                Totals
              </td>
              <td className="px-3 py-2.5 tabular-nums">{formatRand(monthly)}</td>
              <td className="px-3 py-2.5 tabular-nums">{formatRand(onceOff)}</td>
            </tr>
          </tfoot>
        </table>
      </div>
      <ul className="flex flex-col gap-2 p-3 md:hidden">
        {quote.lineItems.map((item) => (
          <li key={item.id} className="rounded-lg border px-3 py-3">
            <p className="font-medium">{item.product}</p>
            <p className="text-sm text-muted-foreground">{item.description || item.site}</p>
            <dl className="mt-2 grid grid-cols-2 gap-2 text-sm">
              <Fact label="Site" value={item.site} />
              <Fact label="Quantity" value={`${item.quantity} ${item.unit}`} />
              <Fact label="Monthly" value={formatRand(item.monthlyPrice)} />
              <Fact label="Once-off" value={formatRand(item.onceOffPrice)} />
              <Fact label="Total monthly" value={formatRand(lineMonthly(item))} />
              <Fact label="Total once-off" value={formatRand(lineOnceOff(item))} />
            </dl>
          </li>
        ))}
        <li className="rounded-lg border bg-muted/30 px-3 py-3 text-sm">
          <div className="flex items-center justify-between gap-3">
            <span>Total monthly</span>
            <span className="font-medium tabular-nums">{formatRand(monthly)}</span>
          </div>
          <div className="mt-1 flex items-center justify-between gap-3">
            <span>Total once-off</span>
            <span className="font-medium tabular-nums">{formatRand(onceOff)}</span>
          </div>
        </li>
      </ul>
    </QuotePanel>
  );
}

function Fact({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-0">
      <dt className="text-xs text-muted-foreground">{label}</dt>
      <dd className="mt-0.5 break-words tabular-nums">{value}</dd>
    </div>
  );
}
