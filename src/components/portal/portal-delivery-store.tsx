"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

import { useSessionUser } from "@/components/shell/session-context";
import {
  demoPortalDeliveries,
  demoPortalEscalations,
  nextEscalationReference,
  type ContactPreference,
  type EscalationReason,
  type EscalationStatus,
  type PortalDelivery,
  type PortalEscalation,
} from "@/data/portal";

const STORAGE_KEY = "csc-portal-delivery";

type PortalBook = {
  deliveries: PortalDelivery[];
  escalations: PortalEscalation[];
};

type PortalDeliveryStore = {
  deliveries: PortalDelivery[];
  escalations: PortalEscalation[];
  hydrated: boolean;
  submitEscalation: (input: {
    orderId: string;
    reason: EscalationReason;
    message: string;
    contactPreference: ContactPreference;
  }) => PortalEscalation;
  updateEscalation: (
    id: string,
    patch: Partial<Pick<PortalEscalation, "status" | "priority" | "assignedTo">>,
  ) => void;
  addEscalationNote: (id: string, body: string, customerVisible: boolean) => void;
  addCustomerUpdate: (orderId: string, summary: string) => void;
};

const PortalDeliveryContext = createContext<PortalDeliveryStore | null>(null);

export function PortalDeliveryProvider({ children }: { children: ReactNode }) {
  const user = useSessionUser();
  const [book, setBook] = useState<PortalBook>({
    deliveries: demoPortalDeliveries,
    escalations: demoPortalEscalations,
  });
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const stored = window.sessionStorage.getItem(STORAGE_KEY);

    if (stored) {
      try {
        const parsed = JSON.parse(stored) as PortalBook;

        if (Array.isArray(parsed.deliveries) && Array.isArray(parsed.escalations)) {
          setBook(parsed);
        }
      } catch {
        window.sessionStorage.removeItem(STORAGE_KEY);
      }
    }

    setHydrated(true);
  }, []);

  function persist(next: PortalBook) {
    setBook(next);
    window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  }

  const value: PortalDeliveryStore = {
    deliveries: book.deliveries,
    escalations: book.escalations,
    hydrated,
    submitEscalation(input) {
      const delivery = book.deliveries.find((item) => item.orderId === input.orderId);

      if (!delivery) {
        throw new Error("Delivery not found for escalation.");
      }

      const escalation: PortalEscalation = {
        id: `esc-session-${Date.now()}`,
        reference: nextEscalationReference(book.escalations),
        orderId: delivery.orderId,
        orderNumber: delivery.orderNumber,
        customerId: delivery.customerId,
        customerName: delivery.customerName,
        stage: delivery.currentStage,
        reason: input.reason,
        message: input.message,
        contactPreference: input.contactPreference,
        priority: "HIGH",
        status: "OPEN",
        assignedTo: "Service Delivery Manager",
        expectedResponse: "Within 4 business hours",
        submittedAt: new Date().toISOString(),
        submittedLabel: "Today",
        notes: [],
      };

      persist({
        deliveries: book.deliveries,
        escalations: [escalation, ...book.escalations],
      });

      return escalation;
    },
    updateEscalation(id, patch) {
      persist({
        deliveries: book.deliveries,
        escalations: book.escalations.map((item) => (item.id === id ? { ...item, ...patch } : item)),
      });
    },
    addEscalationNote(id, body, customerVisible) {
      const note = {
        id: `esc-note-${Date.now()}`,
        body,
        actorName: user.name,
        occurredLabel: "Today",
        customerVisible,
      };
      const escalation = book.escalations.find((item) => item.id === id);

      persist({
        deliveries:
          customerVisible && escalation
            ? book.deliveries.map((delivery) => {
                if (delivery.orderId !== escalation.orderId) return delivery;

                return {
                  ...delivery,
                  lastUpdatedAt: new Date().toISOString(),
                  lastUpdatedLabel: "Today",
                  updates: [
                    {
                      id: `upd-${Date.now()}`,
                      occurredAt: new Date().toISOString(),
                      occurredLabel: "Today",
                      summary: body,
                      actorName: user.name,
                      customerVisible: true,
                    },
                    ...delivery.updates,
                  ],
                };
              })
            : book.deliveries,
        escalations: book.escalations.map((item) =>
          item.id === id ? { ...item, notes: [note, ...item.notes] } : item,
        ),
      });
    },
    addCustomerUpdate(orderId, summary) {
      persist({
        escalations: book.escalations,
        deliveries: book.deliveries.map((delivery) => {
          if (delivery.orderId !== orderId) return delivery;

          return {
            ...delivery,
            lastUpdatedAt: new Date().toISOString(),
            lastUpdatedLabel: "Today",
            updates: [
              {
                id: `upd-${Date.now()}`,
                occurredAt: new Date().toISOString(),
                occurredLabel: "Today",
                summary,
                actorName: user.name,
                customerVisible: true,
              },
              ...delivery.updates,
            ],
          };
        }),
      });
    },
  };

  return <PortalDeliveryContext.Provider value={value}>{children}</PortalDeliveryContext.Provider>;
}

export function usePortalDelivery() {
  const store = useContext(PortalDeliveryContext);

  if (!store) {
    throw new Error("Portal delivery is only available inside a PortalDeliveryProvider.");
  }

  return store;
}

export function usePortalOrder(orderId: string) {
  const { deliveries } = usePortalDelivery();

  return deliveries.find((item) => item.orderId === orderId || item.id === orderId);
}
