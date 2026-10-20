"use client";

import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

import {
  DEMO_ORGANISATION_ID,
  OPPORTUNITY_STAGE_LABEL,
  SALES_OWNERS,
  contractValue,
  demoOpportunities,
  formatCloseDate,
  nextTaskStatus,
  salesCustomers,
  type OpportunityRecord,
  type OpportunityStage,
  type OpportunityType,
} from "@/data/sales";

const STORAGE_KEY = "csc-sales-book";

export type OpportunityDraft = {
  name: string;
  customerId: string;
  type: OpportunityType;
  solution: string;
  estimatedMrr: string;
  estimatedNrc: string;
  contractTermMonths: string;
  probability: string;
  expectedClose: string;
  ownerName: string;
  notes: string;
};

type OpportunityStore = {
  opportunities: OpportunityRecord[];
  addOpportunity: (draft: OpportunityDraft) => OpportunityRecord;
  updateOpportunity: (id: string, draft: OpportunityDraft) => void;
  moveStage: (id: string, stage: OpportunityStage) => void;
  toggleTask: (opportunityId: string, taskId: string) => void;
  addActivity: (id: string, summary: string) => void;
};

const OpportunityContext = createContext<OpportunityStore | null>(null);

export function OpportunityProvider({ children }: { children: ReactNode }) {
  const [opportunities, setOpportunities] = useState(demoOpportunities);

  useEffect(() => {
    const stored = sessionStorage.getItem(STORAGE_KEY);

    if (!stored) {
      return;
    }

    try {
      const parsed = JSON.parse(stored) as OpportunityRecord[];

      if (Array.isArray(parsed) && parsed.length > 0) {
        setOpportunities(parsed);
      }
    } catch {
      sessionStorage.removeItem(STORAGE_KEY);
    }
  }, []);

  const store = useMemo<OpportunityStore>(
    () => ({
      opportunities,
      addOpportunity(draft) {
        const record = createOpportunity(draft, opportunities);
        const next = [record, ...opportunities];
        setOpportunities(next);
        sessionStorage.setItem(STORAGE_KEY, JSON.stringify(next));
        return record;
      },
      updateOpportunity(id, draft) {
        const next = opportunities.map((opportunity) =>
          opportunity.id === id ? applyDraft(opportunity, draft) : opportunity,
        );
        setOpportunities(next);
        sessionStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      },
      moveStage(id, stage) {
        const next = opportunities.map((opportunity) => {
          if (opportunity.id !== id || opportunity.stage === stage) {
            return opportunity;
          }

          return {
            ...opportunity,
            stage,
            updatedAt: new Date().toISOString(),
            lastActivityLabel: "Just now",
            activities: [
              {
                id: `act-${Date.now()}`,
                action: "STAGE" as const,
                summary: `Opportunity moved to ${OPPORTUNITY_STAGE_LABEL[stage]}`,
                actorName: opportunity.owner.name,
                occurredLabel: "Just now",
              },
              ...opportunity.activities,
            ],
          };
        });
        setOpportunities(next);
        sessionStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      },
      toggleTask(opportunityId, taskId) {
        const next = opportunities.map((opportunity) => {
          if (opportunity.id !== opportunityId) {
            return opportunity;
          }

          return {
            ...opportunity,
            updatedAt: new Date().toISOString(),
            tasks: opportunity.tasks.map((item) =>
              item.id === taskId ? { ...item, status: nextTaskStatus(item.status) } : item,
            ),
          };
        });
        setOpportunities(next);
        sessionStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      },
      addActivity(id, summary) {
        const next = opportunities.map((opportunity) => {
          if (opportunity.id !== id) {
            return opportunity;
          }

          return {
            ...opportunity,
            updatedAt: new Date().toISOString(),
            lastActivityLabel: "Just now",
            activities: [
              {
                id: `act-${Date.now()}`,
                action: "NOTE" as const,
                summary: summary.trim(),
                actorName: opportunity.owner.name,
                occurredLabel: "Just now",
              },
              ...opportunity.activities,
            ],
          };
        });
        setOpportunities(next);
        sessionStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      },
    }),
    [opportunities],
  );

  return <OpportunityContext.Provider value={store}>{children}</OpportunityContext.Provider>;
}

export function useOpportunities() {
  const store = useContext(OpportunityContext);

  if (!store) {
    throw new Error("Opportunity data is only available inside the sales workspace.");
  }

  return store;
}

export function draftFromOpportunity(opportunity: OpportunityRecord): OpportunityDraft {
  return {
    name: opportunity.name,
    customerId: opportunity.customer.id,
    type: opportunity.type,
    solution: opportunity.solution,
    estimatedMrr: String(opportunity.estimatedMrr),
    estimatedNrc: String(opportunity.estimatedNrc),
    contractTermMonths: String(opportunity.contractTermMonths),
    probability: String(opportunity.probability),
    expectedClose: opportunity.expectedClose,
    ownerName: opportunity.owner.name,
    notes: opportunity.notes,
  };
}

function applyDraft(opportunity: OpportunityRecord, draft: OpportunityDraft): OpportunityRecord {
  const customer = salesCustomers.find((item) => item.id === draft.customerId) ?? opportunity.customer;
  const owner = SALES_OWNERS.find((item) => item.name === draft.ownerName) ?? opportunity.owner;
  const estimatedMrr = parseAmount(draft.estimatedMrr);
  const estimatedNrc = parseAmount(draft.estimatedNrc);
  const contractTermMonths = Number(draft.contractTermMonths);
  const commercialChanged =
    estimatedMrr !== opportunity.estimatedMrr ||
    estimatedNrc !== opportunity.estimatedNrc ||
    contractTermMonths !== opportunity.contractTermMonths;

  return {
    ...opportunity,
    name: draft.name.trim(),
    customer,
    type: draft.type,
    solution: draft.solution.trim(),
    estimatedMrr,
    estimatedNrc,
    contractTermMonths,
    value: commercialChanged
      ? contractValue(estimatedMrr, estimatedNrc, contractTermMonths)
      : opportunity.value,
    probability: Number(draft.probability),
    expectedClose: draft.expectedClose,
    expectedCloseLabel: formatCloseDate(draft.expectedClose),
    owner,
    notes: draft.notes.trim(),
    lastActivityLabel: "Just now",
    updatedAt: new Date().toISOString(),
  };
}

function createOpportunity(draft: OpportunityDraft, existing: OpportunityRecord[]): OpportunityRecord {
  const sequence = existing.reduce((max, opportunity) => {
    const match = opportunity.opportunityNumber.match(/(\d+)$/);
    return Math.max(max, match ? Number(match[1]) : 0);
  }, 0);
  const number = String(sequence + 1).padStart(4, "0");
  const owner = SALES_OWNERS.find((item) => item.name === draft.ownerName) ?? SALES_OWNERS[0];
  const customer = salesCustomers.find((item) => item.id === draft.customerId) ?? salesCustomers[0];

  return applyDraft(
    {
      id: `opp-session-${number}`,
      organisationId: DEMO_ORGANISATION_ID,
      opportunityNumber: `OPP-2026-${number}`,
      name: draft.name,
      customer,
      type: draft.type,
      solution: draft.solution,
      stage: "LEAD",
      value: 0,
      estimatedMrr: 0,
      estimatedNrc: 0,
      contractTermMonths: 36,
      probability: 0,
      expectedClose: draft.expectedClose,
      expectedCloseLabel: formatCloseDate(draft.expectedClose),
      owner,
      source: "Manual entry",
      createdLabel: "Today",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      lastActivityLabel: "Just now",
      contacts: [
        {
          id: `ctc-${number}`,
          name: customer.primaryContactName,
          role: "Primary contact",
          email: customer.primaryContactEmail,
          phone: customer.primaryContactPhone,
        },
      ],
      activities: [
        {
          id: `act-${number}`,
          action: "CREATED",
          summary: "Opportunity created",
          actorName: owner.name,
          occurredLabel: "Just now",
        },
      ],
      tasks: [
        {
          id: `task-${number}`,
          title: "Schedule customer meeting",
          ownerName: owner.name,
          dueLabel: formatCloseDate(draft.expectedClose),
          status: "OPEN",
          priority: "MEDIUM",
        },
      ],
      notes: draft.notes,
    },
    draft,
  );
}

function parseAmount(value: string) {
  const amount = Number(value.replace(/[R\s,]/g, ""));
  return Number.isFinite(amount) ? amount : 0;
}
