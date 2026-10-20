"use client";

import { useState } from "react";
import Link from "next/link";

import { OpportunityActivity } from "@/components/sales/opportunity-activity";
import { OpportunityCommercialSummary } from "@/components/sales/opportunity-commercial-summary";
import { OpportunityContacts } from "@/components/sales/opportunity-contacts";
import { OpportunityCustomerCard } from "@/components/sales/opportunity-customer-card";
import { OpportunityDetailHeader } from "@/components/sales/opportunity-detail-header";
import { OpportunityOverview } from "@/components/sales/opportunity-overview";
import { OpportunityTasks } from "@/components/sales/opportunity-tasks";
import { useOpportunities } from "@/components/sales/opportunity-store";
import { Button } from "@/components/ui/button";

const tabs = [
  { id: "overview", label: "Overview" },
  { id: "activity", label: "Activity" },
  { id: "tasks", label: "Tasks" },
  { id: "contacts", label: "Contacts" },
] as const;

type TabId = (typeof tabs)[number]["id"];

export function OpportunityDetail({ id }: { id: string }) {
  const { opportunities, toggleTask } = useOpportunities();
  const opportunity = opportunities.find((item) => item.id === id);
  const [tab, setTab] = useState<TabId>("overview");

  if (!opportunity) {
    return (
      <div className="rounded-lg border bg-card px-4 py-10">
        <h1 className="text-lg font-semibold">Opportunity not found</h1>
        <p className="mt-1 text-sm text-muted-foreground">This opportunity is not in the current session.</p>
        <Button className="mt-4" render={<Link href="/sales" />}>
          Back to sales
        </Button>
      </div>
    );
  }

  return (
    <div className="flex min-w-0 flex-col gap-6">
      <OpportunityDetailHeader opportunity={opportunity} />
      <div className="flex gap-1 overflow-x-auto border-b" role="tablist" aria-label="Opportunity sections">
        {tabs.map((item) => (
          <button
            key={item.id}
            type="button"
            role="tab"
            aria-selected={tab === item.id}
            className={`shrink-0 border-b-2 px-3 py-2 text-sm ${
              tab === item.id
                ? "border-foreground font-medium text-foreground"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
            onClick={() => setTab(item.id)}
          >
            {item.label}
          </button>
        ))}
      </div>
      {tab === "overview" ? (
        <div className="grid gap-4 xl:grid-cols-2">
          <OpportunityOverview opportunity={opportunity} />
          <div className="flex min-w-0 flex-col gap-4">
            <OpportunityCommercialSummary opportunity={opportunity} />
            <OpportunityCustomerCard opportunity={opportunity} />
          </div>
        </div>
      ) : null}
      {tab === "activity" ? <OpportunityActivity opportunity={opportunity} /> : null}
      {tab === "tasks" ? (
        <OpportunityTasks
          opportunity={opportunity}
          onToggle={(taskId) => toggleTask(opportunity.id, taskId)}
        />
      ) : null}
      {tab === "contacts" ? <OpportunityContacts opportunity={opportunity} /> : null}
    </div>
  );
}
