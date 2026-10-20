"use client";

import { useRouter } from "next/navigation";

import { OpportunityStageBadge } from "@/components/sales/opportunity-stage-badge";
import { Button } from "@/components/ui/button";
import { formatRand } from "@/data/customers";
import { OPPORTUNITY_TYPE_LABEL, type OpportunityRecord } from "@/data/sales";

export function OpportunityTable({
  opportunities,
  onEdit,
}: {
  opportunities: OpportunityRecord[];
  onEdit: (opportunity: OpportunityRecord) => void;
}) {
  const router = useRouter();

  if (opportunities.length === 0) {
    return (
      <div className="rounded-lg border bg-card px-4 py-10 text-center">
        <p className="text-sm font-medium">No opportunities match these filters</p>
        <p className="mt-1 text-xs text-muted-foreground">Adjust the search or filter values.</p>
      </div>
    );
  }

  return (
    <>
      <div className="hidden min-w-0 overflow-hidden rounded-lg border bg-card md:block">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[920px] text-sm xl:min-w-[1180px]">
            <thead>
              <tr className="border-b text-left text-xs text-muted-foreground">
                <th className="px-4 py-2 font-medium">Opportunity</th>
                <th className="px-4 py-2 font-medium">Customer</th>
                <th className="hidden px-4 py-2 font-medium lg:table-cell">Type</th>
                <th className="px-4 py-2 font-medium">Product / Solution</th>
                <th className="px-4 py-2 font-medium">Stage</th>
                <th className="px-4 py-2 font-medium">Value</th>
                <th className="hidden px-4 py-2 font-medium xl:table-cell">Probability</th>
                <th className="px-4 py-2 font-medium">Expected Close</th>
                <th className="hidden px-4 py-2 font-medium lg:table-cell">Owner</th>
                <th className="hidden px-4 py-2 font-medium xl:table-cell">Last Activity</th>
                <th className="px-4 py-2 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {opportunities.map((opportunity) => (
                <tr
                  key={opportunity.id}
                  className="cursor-pointer border-b last:border-b-0 hover:bg-muted/40"
                  onClick={() => router.push(`/sales/${opportunity.id}`)}
                >
                  <td className="px-4 py-2.5">
                    <p className="font-medium whitespace-nowrap">{opportunity.name}</p>
                    <p className="text-xs text-muted-foreground tabular-nums">{opportunity.opportunityNumber}</p>
                  </td>
                  <td className="px-4 py-2.5 whitespace-nowrap">{opportunity.customer.name}</td>
                  <td className="hidden px-4 py-2.5 whitespace-nowrap lg:table-cell">
                    {OPPORTUNITY_TYPE_LABEL[opportunity.type]}
                  </td>
                  <td className="px-4 py-2.5 whitespace-nowrap">{opportunity.solution}</td>
                  <td className="px-4 py-2.5">
                    <OpportunityStageBadge stage={opportunity.stage} />
                  </td>
                  <td className="px-4 py-2.5 whitespace-nowrap tabular-nums">{formatRand(opportunity.value)}</td>
                  <td className="hidden px-4 py-2.5 tabular-nums xl:table-cell">{opportunity.probability}%</td>
                  <td className="px-4 py-2.5 whitespace-nowrap">{opportunity.expectedCloseLabel}</td>
                  <td className="hidden px-4 py-2.5 whitespace-nowrap lg:table-cell">{opportunity.owner.name}</td>
                  <td className="hidden px-4 py-2.5 whitespace-nowrap text-muted-foreground xl:table-cell">
                    {opportunity.lastActivityLabel}
                  </td>
                  <td className="px-4 py-2.5">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={(event) => {
                        event.stopPropagation();
                        onEdit(opportunity);
                      }}
                    >
                      Edit
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <ul className="flex flex-col gap-3 md:hidden">
        {opportunities.map((opportunity) => (
          <li key={opportunity.id}>
            <article className="rounded-lg border bg-card p-4">
              <button
                type="button"
                className="w-full text-left"
                onClick={() => router.push(`/sales/${opportunity.id}`)}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="font-medium">{opportunity.name}</p>
                    <p className="text-xs text-muted-foreground">{opportunity.customer.name}</p>
                    <p className="text-xs text-muted-foreground tabular-nums">{opportunity.opportunityNumber}</p>
                  </div>
                  <OpportunityStageBadge stage={opportunity.stage} />
                </div>
                <dl className="mt-3 grid grid-cols-2 gap-x-3 gap-y-2 text-sm">
                  <div>
                    <dt className="text-xs text-muted-foreground">Type</dt>
                    <dd>{OPPORTUNITY_TYPE_LABEL[opportunity.type]}</dd>
                  </div>
                  <div>
                    <dt className="text-xs text-muted-foreground">Value</dt>
                    <dd className="tabular-nums">{formatRand(opportunity.value)}</dd>
                  </div>
                  <div className="col-span-2">
                    <dt className="text-xs text-muted-foreground">Solution</dt>
                    <dd>{opportunity.solution}</dd>
                  </div>
                  <div>
                    <dt className="text-xs text-muted-foreground">Probability</dt>
                    <dd className="tabular-nums">{opportunity.probability}%</dd>
                  </div>
                  <div>
                    <dt className="text-xs text-muted-foreground">Expected close</dt>
                    <dd>{opportunity.expectedCloseLabel}</dd>
                  </div>
                  <div>
                    <dt className="text-xs text-muted-foreground">Owner</dt>
                    <dd>{opportunity.owner.name}</dd>
                  </div>
                  <div>
                    <dt className="text-xs text-muted-foreground">Last activity</dt>
                    <dd>{opportunity.lastActivityLabel}</dd>
                  </div>
                </dl>
              </button>
              <Button type="button" variant="outline" size="sm" className="mt-3" onClick={() => onEdit(opportunity)}>
                Edit
              </Button>
            </article>
          </li>
        ))}
      </ul>
    </>
  );
}
