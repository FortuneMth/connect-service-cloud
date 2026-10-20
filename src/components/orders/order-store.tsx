"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

import {
  DEMO_ORGANISATION_ID,
  ORDER_STATUS_LABEL,
  STAGE_PROGRESS,
  demoOrders,
  isOrderStage,
  lifecycleStage,
  nextOrderNumber,
  nextOrderStage,
  type OrderPriority,
  type OrderRecord,
  type OrderStage,
  type OrderType,
} from "@/data/orders";
import { demoCustomers } from "@/data/customers";
import { formatCloseDate } from "@/data/sales";

const STORAGE_KEY = "csc-order-book";

export type OrderDraft = {
  customerId: string;
  quoteId: string;
  quoteNumber: string;
  orderType: OrderType;
  product: string;
  priority: OrderPriority;
  value: string;
  targetActivation: string;
  notes: string;
};

export type OrderEdit = {
  product: string;
  priority: OrderPriority;
  value: string;
  targetActivation: string;
  notes: string;
};

type OrderStore = {
  orders: OrderRecord[];
  addOrder: (draft: OrderDraft) => OrderRecord;
  updateOrder: (id: string, draft: OrderEdit) => void;
  advanceOrder: (id: string) => void;
  holdOrder: (id: string, reason: string) => void;
  resumeOrder: (id: string) => void;
  blockOrder: (id: string, reason: string) => void;
  unblockOrder: (id: string) => void;
  setOrderRisk: (id: string, atRisk: boolean, note: string) => void;
  cancelOrder: (id: string, reason: string) => void;
};

const OrderContext = createContext<OrderStore | null>(null);

function persist(setOrders: (orders: OrderRecord[]) => void, orders: OrderRecord[]) {
  sessionStorage.setItem(STORAGE_KEY, JSON.stringify(orders));
  setOrders(orders);
}

function customerSnapshot(customerId: string) {
  const customer = demoCustomers.find((item) => item.id === customerId);

  if (!customer) {
    throw new Error(`Unknown customer ${customerId}`);
  }

  return {
    id: customer.id,
    customerNumber: customer.customerNumber,
    name: customer.name,
    typeLabel: customer.type.charAt(0) + customer.type.slice(1).toLowerCase(),
    primaryContactName: customer.primaryContact.name,
    primaryContactEmail: customer.primaryContact.email,
    primaryContactPhone: customer.primaryContact.phone,
  };
}

function stamp(order: OrderRecord, summary: string, actorName: string): OrderRecord {
  return {
    ...order,
    updatedAt: new Date().toISOString(),
    lastActivityLabel: "Today",
    activity: [
      {
        id: `ord-act-${order.id}-${order.activity.length + 1}`,
        summary,
        actorName,
        occurredLabel: "Today",
      },
      ...order.activity,
    ],
  };
}

export function OrderProvider({ children }: { children: ReactNode }) {
  const [orders, setOrders] = useState(demoOrders);

  useEffect(() => {
    const stored = sessionStorage.getItem(STORAGE_KEY);

    if (!stored) {
      return;
    }

    try {
      const parsed = JSON.parse(stored) as OrderRecord[];

      if (Array.isArray(parsed) && parsed.length > 0) {
        setOrders(parsed);
      }
    } catch {
      sessionStorage.removeItem(STORAGE_KEY);
    }
  }, []);

  function replace(id: string, next: OrderRecord) {
    persist(
      setOrders,
      orders.map((item) => (item.id === id ? next : item)),
    );
  }

  const addOrder = (draft: OrderDraft) => {
    const customer = customerSnapshot(draft.customerId);
    const owner = demoCustomers.find((item) => item.id === draft.customerId)?.accountOwner;
    const number = nextOrderNumber(orders);
    const suffix = number.split("-").at(-1) ?? "0000";
    const record: OrderRecord = stamp(
      {
        id: `ord-session-${suffix}`,
        organisationId: DEMO_ORGANISATION_ID,
        orderNumber: number,
        customer,
        quoteId: draft.quoteId || null,
        quoteNumber: draft.quoteNumber || null,
        orderType: draft.orderType,
        product: draft.product.trim(),
        status: "NEW",
        priority: draft.priority,
        atRisk: false,
        riskNote: "",
        value: Number(draft.value),
        progress: STAGE_PROGRESS.NEW,
        ownerId: owner?.id ?? "owner-sarah",
        ownerName: owner?.name ?? "Sarah M.",
        targetActivation: draft.targetActivation,
        targetActivationLabel: formatCloseDate(draft.targetActivation),
        createdLabel: "Today",
        updatedAt: new Date().toISOString(),
        lastActivityLabel: "Today",
        notes: draft.notes.trim(),
        heldFrom: null,
        blockedFrom: null,
        holdReason: "",
        blockReason: "",
        cancelReason: "",
        sites: [
          {
            id: `ord-site-${suffix}-1`,
            name: customer.name,
            address: "Site to be confirmed",
            service: draft.product.trim(),
            accessStatus: "New",
            targetLabel: formatCloseDate(draft.targetActivation),
          },
        ],
        activity: [],
      },
      draft.quoteNumber ? `Order created from ${draft.quoteNumber}` : "Order created",
      owner?.name ?? "Sarah M.",
    );

    persist(setOrders, [record, ...orders]);

    return record;
  };

  const updateOrder = (id: string, draft: OrderEdit) => {
    const current = orders.find((item) => item.id === id);

    if (!current || current.status === "CANCELLED") {
      return;
    }

    replace(
      id,
      stamp(
        {
          ...current,
          product: draft.product.trim(),
          priority: draft.priority,
          value: Number(draft.value),
          targetActivation: draft.targetActivation,
          targetActivationLabel: formatCloseDate(draft.targetActivation),
          notes: draft.notes.trim(),
        },
        "Order updated",
        current.ownerName,
      ),
    );
  };

  const advanceOrder = (id: string) => {
    const current = orders.find((item) => item.id === id);

    if (!current || !isOrderStage(current.status) || current.status === "COMPLETED") {
      return;
    }

    const next = nextOrderStage(current.status);

    if (!next) {
      return;
    }

    replace(
      id,
      stamp(
        {
          ...current,
          status: next,
          progress: STAGE_PROGRESS[next],
          atRisk: next === "COMPLETED" ? false : current.atRisk,
        },
        next === "COMPLETED" ? "Order completed" : `Order moved to ${ORDER_STATUS_LABEL[next]}`,
        current.ownerName,
      ),
    );
  };

  const holdOrder = (id: string, reason: string) => {
    const current = orders.find((item) => item.id === id);

    if (!current || !isOrderStage(current.status) || current.status === "COMPLETED") {
      return;
    }

    replace(
      id,
      stamp(
        {
          ...current,
          status: "ON_HOLD",
          heldFrom: current.status,
          holdReason: reason.trim(),
        },
        "Order placed on hold",
        current.ownerName,
      ),
    );
  };

  const resumeOrder = (id: string) => {
    const current = orders.find((item) => item.id === id);

    if (!current || current.status !== "ON_HOLD" || !current.heldFrom) {
      return;
    }

    const stage: OrderStage = current.heldFrom;

    replace(
      id,
      stamp(
        {
          ...current,
          status: stage,
          heldFrom: null,
          holdReason: "",
        },
        `Order resumed at ${ORDER_STATUS_LABEL[stage]}`,
        current.ownerName,
      ),
    );
  };

  const blockOrder = (id: string, reason: string) => {
    const current = orders.find((item) => item.id === id);

    if (!current || !isOrderStage(current.status) || current.status === "COMPLETED") {
      return;
    }

    replace(
      id,
      stamp(
        {
          ...current,
          status: "BLOCKED",
          blockedFrom: current.status,
          blockReason: reason.trim(),
          atRisk: true,
          riskNote: current.riskNote || reason.trim(),
        },
        "Order blocked",
        current.ownerName,
      ),
    );
  };

  const unblockOrder = (id: string) => {
    const current = orders.find((item) => item.id === id);

    if (!current || current.status !== "BLOCKED" || !current.blockedFrom) {
      return;
    }

    const stage = current.blockedFrom;

    replace(
      id,
      stamp(
        {
          ...current,
          status: stage,
          blockedFrom: null,
          blockReason: "",
        },
        `Order unblocked at ${ORDER_STATUS_LABEL[stage]}`,
        current.ownerName,
      ),
    );
  };

  const setOrderRisk = (id: string, atRisk: boolean, note: string) => {
    const current = orders.find((item) => item.id === id);

    if (!current || current.status === "CANCELLED" || current.status === "COMPLETED") {
      return;
    }

    replace(
      id,
      stamp(
        {
          ...current,
          atRisk,
          riskNote: atRisk ? note.trim() : "",
        },
        atRisk ? "Order marked at risk" : "Risk flag cleared",
        current.ownerName,
      ),
    );
  };

  const cancelOrder = (id: string, reason: string) => {
    const current = orders.find((item) => item.id === id);

    if (!current || current.status === "CANCELLED" || current.status === "COMPLETED") {
      return;
    }

    const stage = lifecycleStage(current);

    replace(
      id,
      stamp(
        {
          ...current,
          status: "CANCELLED",
          heldFrom: stage,
          cancelReason: reason.trim(),
          atRisk: false,
        },
        "Order cancelled",
        current.ownerName,
      ),
    );
  };

  return (
    <OrderContext.Provider
      value={{
        orders,
        addOrder,
        updateOrder,
        advanceOrder,
        holdOrder,
        resumeOrder,
        blockOrder,
        unblockOrder,
        setOrderRisk,
        cancelOrder,
      }}
    >
      {children}
    </OrderContext.Provider>
  );
}

export function useOrders() {
  const context = useContext(OrderContext);

  if (!context) {
    throw new Error("useOrders must be used within OrderProvider");
  }

  return context;
}
