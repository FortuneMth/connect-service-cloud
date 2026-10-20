"use client";

import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

import {
  ACCOUNT_OWNERS,
  DEMO_ORGANISATION_ID,
  demoCustomers,
  type CustomerRecord,
  type CustomerType,
} from "@/data/customers";

const STORAGE_KEY = "csc-customer-book";

export type CustomerDraft = {
  name: string;
  type: CustomerType;
  industry: string;
  primaryContactName: string;
  email: string;
  phone: string;
  billingContactName: string;
  paymentTerms: string;
  accountOwnerName: string;
};

type CustomerStore = {
  customers: CustomerRecord[];
  addCustomer: (draft: CustomerDraft) => CustomerRecord;
  updateCustomer: (id: string, draft: CustomerDraft) => void;
};

const CustomerContext = createContext<CustomerStore | null>(null);

export function CustomerProvider({ children }: { children: ReactNode }) {
  const [customers, setCustomers] = useState(demoCustomers);

  useEffect(() => {
    const stored = sessionStorage.getItem(STORAGE_KEY);

    if (!stored) {
      return;
    }

    try {
      const parsed = JSON.parse(stored) as CustomerRecord[];

      if (Array.isArray(parsed) && parsed.length > 0) {
        setCustomers(parsed);
      }
    } catch {
      sessionStorage.removeItem(STORAGE_KEY);
    }
  }, []);

  const store = useMemo<CustomerStore>(
    () => ({
      customers,
      addCustomer(draft) {
        const record = createCustomer(draft, customers);
        const next = [record, ...customers];
        setCustomers(next);
        sessionStorage.setItem(STORAGE_KEY, JSON.stringify(next));
        return record;
      },
      updateCustomer(id, draft) {
        const next = customers.map((customer) =>
          customer.id === id ? applyDraft(customer, draft) : customer,
        );
        setCustomers(next);
        sessionStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      },
    }),
    [customers],
  );

  return <CustomerContext.Provider value={store}>{children}</CustomerContext.Provider>;
}

export function useCustomers() {
  const store = useContext(CustomerContext);

  if (!store) {
    throw new Error("Customer data is only available inside the customers workspace.");
  }

  return store;
}

export function draftFromCustomer(customer: CustomerRecord): CustomerDraft {
  return {
    name: customer.name,
    type: customer.type,
    industry: customer.industry,
    primaryContactName: customer.primaryContact.name,
    email: customer.primaryContact.email,
    phone: customer.primaryContact.phone,
    billingContactName: customer.billingContact.name,
    paymentTerms: customer.paymentTerms,
    accountOwnerName: customer.accountOwner.name,
  };
}

function applyDraft(customer: CustomerRecord, draft: CustomerDraft): CustomerRecord {
  const owner = ACCOUNT_OWNERS.find((item) => item.name === draft.accountOwnerName) ?? customer.accountOwner;

  return {
    ...customer,
    name: draft.name.trim(),
    type: draft.type,
    industry: draft.industry.trim(),
    paymentTerms: draft.paymentTerms,
    accountOwner: owner,
    primaryContact: {
      name: draft.primaryContactName.trim(),
      email: draft.email.trim(),
      phone: draft.phone.trim(),
    },
    billingContact: {
      ...customer.billingContact,
      name: draft.billingContactName.trim(),
    },
    lastActivityLabel: "Just now",
    updatedAt: new Date().toISOString(),
  };
}

function createCustomer(draft: CustomerDraft, existing: CustomerRecord[]): CustomerRecord {
  const owner = ACCOUNT_OWNERS.find((item) => item.name === draft.accountOwnerName) ?? ACCOUNT_OWNERS[0];
  const sequence = existing.reduce((max, customer) => {
    const match = customer.customerNumber.match(/(\d+)$/);
    return Math.max(max, match ? Number(match[1]) : 0);
  }, 0);
  const number = String(sequence + 1).padStart(4, "0");

  return applyDraft(
    {
      id: `cus-session-${number}`,
      organisationId: DEMO_ORGANISATION_ID,
      customerNumber: `CUS-2026-${number}`,
      name: draft.name,
      type: draft.type,
      status: "PENDING",
      industry: draft.industry,
      customerSince: "October 2026",
      paymentTerms: draft.paymentTerms,
      primaryContact: { name: "", email: "", phone: "" },
      billingContact: { name: "", email: draft.email.trim(), phone: draft.phone.trim() },
      accountOwner: owner,
      siteCount: 0,
      serviceCount: 0,
      monthlyRecurringRevenue: 0,
      lastActivityLabel: "Just now",
      updatedAt: new Date().toISOString(),
      sites: [],
      services: [],
      orders: [],
      quotes: [],
      documents: [],
      activity: [
        {
          id: `act-${number}`,
          action: "ORDER_CREATED",
          summary: "Customer record opened",
          actorName: owner.name,
          occurredLabel: "Just now",
        },
      ],
    },
    draft,
  );
}
