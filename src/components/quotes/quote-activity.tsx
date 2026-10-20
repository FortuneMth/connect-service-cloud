import { QuotePanel } from "@/components/quotes/quote-panel";
import type { QuoteRecord } from "@/data/quotes";

export function QuoteActivity({ quote }: { quote: QuoteRecord }) {
  return (
    <QuotePanel title="Activity">
      <ol className="grid gap-0 px-4 py-3">
        {quote.activities.map((activity, index) => (
          <li key={activity.id} className="relative grid grid-cols-[1rem_minmax(0,1fr)] gap-3 pb-4 last:pb-0">
            <span className="mt-1 size-2 rounded-full bg-foreground" />
            {index < quote.activities.length - 1 ? (
              <span className="absolute top-3 bottom-0 left-[0.2rem] w-px bg-border" />
            ) : null}
            <div className="min-w-0">
              <p className="text-sm">{activity.summary}</p>
              <p className="text-xs text-muted-foreground">
                {activity.actorName} · {activity.occurredLabel}
              </p>
            </div>
          </li>
        ))}
      </ol>
    </QuotePanel>
  );
}
