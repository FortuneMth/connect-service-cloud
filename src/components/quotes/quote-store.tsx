"use client";

import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

import {
  DEMO_ORGANISATION_ID,
  VAT_RATE,
  demoQuotes,
  findCustomerSnapshot,
  findOpportunitySnapshot,
  nextQuoteNumber,
  quoteCustomers,
  summariseLines,
  type QuoteLineItem,
  type QuoteRecord,
  type QuoteStatus,
  type QuoteType,
} from "@/data/quotes";
import { formatCloseDate } from "@/data/sales";

const STORAGE_KEY = "csc-quote-book";

export type QuoteLineDraft = {
  product: string;
  description: string;
  site: string;
  quantity: string;
  unit: string;
  monthlyPrice: string;
  onceOffPrice: string;
};

export type QuoteDraft = {
  customerId: string;
  opportunityId: string;
  primaryContactName: string;
  quoteType: QuoteType;
  contractTerm: string;
  paymentTerms: string;
  billingFrequency: string;
  validUntil: string;
  installationLeadTime: string;
  sla: string;
  cancellationTerms: string;
  pricingNotes: string;
  lineItems: QuoteLineDraft[];
};

type QuoteStore = {
  quotes: QuoteRecord[];
  addQuote: (draft: QuoteDraft) => QuoteRecord;
  updateQuote: (id: string, draft: QuoteDraft) => void;
  sendQuote: (id: string) => void;
  acceptQuote: (id: string) => void;
  rejectQuote: (id: string, reason: string) => void;
  duplicateQuote: (id: string) => QuoteRecord | null;
};

const QuoteContext = createContext<QuoteStore | null>(null);

export function QuoteProvider({ children }: { children: ReactNode }) {
  const [quotes, setQuotes] = useState(demoQuotes);

  useEffect(() => {
    const stored = sessionStorage.getItem(STORAGE_KEY);

    if (!stored) {
      return;
    }

    try {
      const parsed = JSON.parse(stored) as QuoteRecord[];

      if (Array.isArray(parsed) && parsed.length > 0) {
        setQuotes(parsed);
      }
    } catch {
      sessionStorage.removeItem(STORAGE_KEY);
    }
  }, []);

  const store = useMemo<QuoteStore>(
    () => ({
      quotes,
      addQuote(draft) {
        const record = createQuote(draft, quotes);
        persist(setQuotes, [record, ...quotes]);
        return record;
      },
      updateQuote(id, draft) {
        persist(
          setQuotes,
          quotes.map((quote) => (quote.id === id ? applyDraft(quote, draft) : quote)),
        );
      },
      sendQuote(id) {
        persist(
          setQuotes,
          quotes.map((quote) => {
            if (quote.id !== id || (quote.status !== "DRAFT" && quote.status !== "INTERNAL_REVIEW")) {
              return quote;
            }

            return withActivity(quote, "SENT", "Quote sent to customer", quote.owner.name);
          }),
        );
      },
      acceptQuote(id) {
        persist(
          setQuotes,
          quotes.map((quote) => {
            if (quote.id !== id || (quote.status !== "SENT" && quote.status !== "CUSTOMER_REVIEW")) {
              return quote;
            }

            return withActivity(
              quote,
              "ACCEPTED",
              "Quote accepted by customer",
              quote.customer.primaryContact.name,
            );
          }),
        );
      },
      rejectQuote(id, reason) {
        const trimmed = reason.trim();

        persist(
          setQuotes,
          quotes.map((quote) => {
            if (quote.id !== id || !trimmed || !canReject(quote.status)) {
              return quote;
            }

            return {
              ...withActivity(quote, "REJECTED", "Quote rejected", quote.customer.primaryContact.name),
              rejectionReason: trimmed,
            };
          }),
        );
      },
      duplicateQuote(id) {
        const source = quotes.find((quote) => quote.id === id);

        if (!source) {
          return null;
        }

        const quoteNumber = nextQuoteNumber(quotes);
        const suffix = quoteNumber.slice(-4);
        const copy: QuoteRecord = {
          ...source,
          id: `quo-session-${suffix}`,
          quoteNumber,
          status: "DRAFT",
          rejectionReason: null,
          createdAt: new Date().toISOString(),
          createdLabel: "14 Oct 2026",
          updatedAt: new Date().toISOString(),
          lastActivityLabel: "Just now",
          approvals: source.approvals.map((approval) => ({
            ...approval,
            id: `${approval.id}-copy-${suffix}`,
            status: "PENDING",
            actorName:
              approval.area === "COMMERCIAL"
                ? source.owner.name
                : approval.area === "TECHNICAL"
                  ? "Technical Team"
                  : "Finance Team",
          })),
          activities: [
            {
              id: `act-${Date.now()}`,
              summary: `Quote duplicated from ${source.quoteNumber}`,
              actorName: source.owner.name,
              occurredLabel: "Just now",
            },
          ],
          lineItems: source.lineItems.map((item) => ({ ...item, id: `${item.id}-copy-${suffix}` })),
          sites: source.sites.map((site) => ({ ...site, id: `${site.id}-copy-${suffix}` })),
        };
        persist(setQuotes, [copy, ...quotes]);
        return copy;
      },
    }),
    [quotes],
  );

  return <QuoteContext.Provider value={store}>{children}</QuoteContext.Provider>;
}

export function useQuotes() {
  const store = useContext(QuoteContext);

  if (!store) {
    throw new Error("useQuotes must be used within QuoteProvider");
  }

  return store;
}

export function draftFromQuote(quote: QuoteRecord): QuoteDraft {
  return {
    customerId: quote.customerId,
    opportunityId: quote.opportunityId,
    primaryContactName: quote.customer.primaryContact.name,
    quoteType: quote.quoteType,
    contractTerm: String(quote.contractTerm),
    paymentTerms: quote.paymentTerms,
    billingFrequency: quote.billingFrequency,
    validUntil: quote.validUntil,
    installationLeadTime: quote.terms.installationLeadTime,
    sla: quote.terms.sla,
    cancellationTerms: quote.terms.cancellationTerms,
    pricingNotes: quote.terms.pricingNotes,
    lineItems: quote.lineItems.map((item) => ({
      product: item.product,
      description: item.description,
      site: item.site,
      quantity: String(item.quantity),
      unit: item.unit,
      monthlyPrice: String(item.monthlyPrice),
      onceOffPrice: String(item.onceOffPrice),
    })),
  };
}

export function emptyLine(): QuoteLineDraft {
  return {
    product: "",
    description: "",
    site: "",
    quantity: "1",
    unit: "Service",
    monthlyPrice: "",
    onceOffPrice: "0",
  };
}

function persist(setQuotes: (quotes: QuoteRecord[]) => void, next: QuoteRecord[]) {
  setQuotes(next);
  sessionStorage.setItem(STORAGE_KEY, JSON.stringify(next));
}

function canReject(status: QuoteStatus) {
  return status !== "ACCEPTED" && status !== "REJECTED" && status !== "EXPIRED";
}

function withActivity(quote: QuoteRecord, status: QuoteStatus, summary: string, actorName: string): QuoteRecord {
  return {
    ...quote,
    status,
    updatedAt: new Date().toISOString(),
    lastActivityLabel: "Just now",
    activities: [
      {
        id: `act-${Date.now()}`,
        summary,
        actorName,
        occurredLabel: "Just now",
      },
      ...quote.activities,
    ],
  };
}

function linesFromDraft(draft: QuoteDraft): QuoteLineItem[] {
  return draft.lineItems.map((item, index) => ({
    id: `line-${index + 1}`,
    product: item.product.trim(),
    description: item.description.trim(),
    site: item.site.trim(),
    quantity: Number(item.quantity),
    unit: item.unit.trim() || "Service",
    monthlyPrice: amount(item.monthlyPrice),
    onceOffPrice: amount(item.onceOffPrice),
  }));
}

function amount(value: string) {
  return Number(value.trim().replace(/[R\s,]/g, ""));
}

function applyDraft(quote: QuoteRecord, draft: QuoteDraft): QuoteRecord {
  const lineItems = linesFromDraft(draft).map((item, index) => ({
    ...item,
    id: quote.lineItems[index]?.id ?? `${quote.id}-line-${index + 1}`,
  }));
  const term = Number(draft.contractTerm);
  const totals = summariseLines(lineItems, term);
  const commercialChanged =
    totals.mrr !== quote.mrr || totals.nrc !== quote.nrc || term !== quote.contractTerm;
  const subtotal = commercialChanged ? totals.subtotal : quote.subtotal;
  const customer = findCustomerSnapshot(draft.customerId) ?? quote.customer;
  const opportunity = findOpportunitySnapshot(draft.opportunityId) ?? quote.opportunity;

  return {
    ...quote,
    customerId: customer.id,
    customerName: customer.name,
    opportunityId: opportunity.id,
    opportunityName: opportunity.name,
    quoteType: draft.quoteType,
    validUntil: draft.validUntil,
    validUntilLabel: formatCloseDate(draft.validUntil),
    contractTerm: term,
    paymentTerms: draft.paymentTerms.trim(),
    billingFrequency: draft.billingFrequency.trim(),
    mrr: totals.mrr,
    nrc: totals.nrc,
    subtotal,
    vat: Math.round(subtotal * VAT_RATE),
    total: commercialChanged ? subtotal : quote.total,
    updatedAt: new Date().toISOString(),
    lastActivityLabel: "Just now",
    lineItems,
    terms: {
      installationLeadTime: draft.installationLeadTime.trim(),
      sla: draft.sla.trim(),
      cancellationTerms: draft.cancellationTerms.trim(),
      pricingNotes: draft.pricingNotes.trim(),
    },
    customer: {
      ...customer,
      primaryContact: {
        ...customer.primaryContact,
        name: draft.primaryContactName.trim(),
      },
    },
    opportunity,
    activities: [
      {
        id: `act-${Date.now()}`,
        summary: "Quote updated",
        actorName: quote.owner.name,
        occurredLabel: "Just now",
      },
      ...quote.activities,
    ],
  };
}

function createQuote(draft: QuoteDraft, quotes: QuoteRecord[]): QuoteRecord {
  const quoteNumber = nextQuoteNumber(quotes);
  const suffix = quoteNumber.slice(-4);
  const lineItems = linesFromDraft(draft).map((item, index) => ({
    ...item,
    id: `quo-session-${suffix}-line-${index + 1}`,
  }));
  const term = Number(draft.contractTerm);
  const totals = summariseLines(lineItems, term);
  const customer = findCustomerSnapshot(draft.customerId);
  const opportunity = findOpportunitySnapshot(draft.opportunityId);
  const owner = quoteCustomers.find((item) => item.id === draft.customerId)?.owner ?? {
    id: "owner-sarah",
    name: "Sarah M.",
  };

  if (!customer || !opportunity) {
    throw new Error("Select a customer and an opportunity.");
  }

  return {
    id: `quo-session-${suffix}`,
    organisationId: DEMO_ORGANISATION_ID,
    quoteNumber,
    customerId: customer.id,
    customerName: customer.name,
    opportunityId: opportunity.id,
    opportunityName: opportunity.name,
    quoteType: draft.quoteType,
    status: "DRAFT",
    currency: "ZAR",
    validUntil: draft.validUntil,
    validUntilLabel: formatCloseDate(draft.validUntil),
    contractTerm: term,
    paymentTerms: draft.paymentTerms.trim(),
    billingFrequency: draft.billingFrequency.trim(),
    mrr: totals.mrr,
    nrc: totals.nrc,
    subtotal: totals.subtotal,
    vat: totals.vat,
    total: totals.subtotal,
    owner,
    createdAt: new Date().toISOString(),
    createdLabel: "14 Oct 2026",
    updatedAt: new Date().toISOString(),
    lastActivityLabel: "Just now",
    executiveSummary: draft.pricingNotes.trim() || `${opportunity.name} for ${customer.name}.`,
    rejectionReason: null,
    lineItems,
    sites: uniqueSites(lineItems, suffix),
    activities: [
      {
        id: `act-${Date.now()}`,
        summary: "Quote created",
        actorName: owner.name,
        occurredLabel: "Just now",
      },
    ],
    approvals: [
      { id: `quo-session-${suffix}-appr-1`, area: "COMMERCIAL", status: "PENDING", actorName: owner.name },
      { id: `quo-session-${suffix}-appr-2`, area: "TECHNICAL", status: "PENDING", actorName: "Technical Team" },
      { id: `quo-session-${suffix}-appr-3`, area: "FINANCE", status: "PENDING", actorName: "Finance Team" },
    ],
    terms: {
      installationLeadTime: draft.installationLeadTime.trim(),
      sla: draft.sla.trim(),
      cancellationTerms: draft.cancellationTerms.trim(),
      pricingNotes: draft.pricingNotes.trim(),
    },
    customer: {
      ...customer,
      primaryContact: {
        ...customer.primaryContact,
        name: draft.primaryContactName.trim(),
      },
    },
    opportunity,
  };
}

function uniqueSites(items: QuoteLineItem[], suffix: string) {
  const names = [...new Set(items.map((item) => item.site).filter(Boolean))];

  return names.map((name, index) => ({
    id: `quo-session-${suffix}-site-${index + 1}`,
    name,
    address: "Address to be confirmed",
    service: items.find((item) => item.site === name)?.product ?? "Quoted service",
    accessStatus: "Pending",
    estimatedInstallLabel: "To be scheduled",
  }));
}
