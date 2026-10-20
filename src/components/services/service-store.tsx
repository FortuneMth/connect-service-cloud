"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

import { useSessionUser } from "@/components/shell/session-context";
import {
  demoServices,
  nextServiceNumber,
  serviceStatusSummary,
  type AccessType,
  type CheckOutcome,
  type ServiceNote,
  type ServiceRecord,
  type ServiceStatus,
} from "@/data/services";

const STORAGE_KEY = "csc-service-book";

type ServiceBook = {
  services: ServiceRecord[];
};

export type CreateServiceInput = {
  orderId: string;
  orderNumber: string;
  customerId: string;
  customerName: string;
  siteId: string;
  siteName: string;
  address: string;
  product: string;
  bandwidth: string;
  accessType: AccessType;
  monthly: number;
  termMonths: number;
  status: Extract<ServiceStatus, "PENDING" | "PROVISIONING">;
};

type ServiceStore = {
  services: ServiceRecord[];
  hydrated: boolean;
  createService: (input: CreateServiceInput) => ServiceRecord;
  changeStatus: (id: string, status: ServiceStatus) => void;
  suspendService: (id: string, reason: string) => void;
  recordCheck: (id: string, check: { name: string; result: string; outcome: CheckOutcome; notes: string }) => void;
  addNote: (id: string, body: string) => void;
};

const ServiceContext = createContext<ServiceStore | null>(null);

function stamp(service: ServiceRecord, summary: string, actorName: string, category: string): ServiceRecord {
  return {
    ...service,
    updatedAt: new Date().toISOString(),
    updatedLabel: "Today",
    timeline: [
      {
        id: `evt-${Date.now()}`,
        summary,
        actorName,
        occurredLabel: "Today",
        category,
      },
      ...service.timeline,
    ],
  };
}

export function ServiceProvider({ children }: { children: ReactNode }) {
  const user = useSessionUser();
  const [book, setBook] = useState<ServiceBook>({ services: demoServices });
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const stored = window.sessionStorage.getItem(STORAGE_KEY);

    if (stored) {
      try {
        const parsed = JSON.parse(stored) as ServiceBook;

        if (Array.isArray(parsed.services)) {
          setBook(parsed);
        }
      } catch {
        window.sessionStorage.removeItem(STORAGE_KEY);
      }
    }

    setHydrated(true);
  }, []);

  function persist(next: ServiceBook) {
    setBook(next);
    window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  }

  const value: ServiceStore = {
    services: book.services,
    hydrated,
    createService(input) {
      const actorName = user.name;
      const serviceNumber = nextServiceNumber(book.services);
      const created: ServiceRecord = {
        id: `srv-session-${Date.now()}`,
        organisationId: "org-connect-service-demo",
        serviceNumber,
        customerId: input.customerId,
        customerName: input.customerName,
        siteId: input.siteId,
        siteName: input.siteName,
        address: input.address,
        orderId: input.orderId,
        orderNumber: input.orderNumber,
        installationId: "",
        installationNumber: "",
        product: input.product,
        bandwidth: input.bandwidth,
        accessType: input.accessType,
        monthly: input.monthly,
        termMonths: input.termMonths,
        status: input.status,
        health: "UNKNOWN",
        risk: "",
        circuitId: "—",
        pop: "Unassigned",
        vlan: "—",
        ipAddress: "—",
        cpe: "Pending",
        activatedDate: "",
        activatedLabel: "—",
        ownerName: actorName,
        checks: [],
        timeline: [],
        notes: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        updatedLabel: "Today",
      };
      const ready = stamp(
        created,
        input.status === "PROVISIONING" ? "Provisioning started" : "Service created",
        actorName,
        "Provisioning",
      );

      persist({ services: [ready, ...book.services] });

      return ready;
    },
    changeStatus(id, status) {
      persist({
        services: book.services.map((item) => {
          if (item.id !== id || item.status === status) return item;

          const goingLive = status === "LIVE";

          return stamp(
            {
              ...item,
              status,
              health: goingLive && item.health === "UNKNOWN" ? "HEALTHY" : status === "AT_RISK" && item.health === "UNKNOWN" ? "DEGRADED" : item.health,
              activatedDate: goingLive && !item.activatedDate ? SERVICE_DATE() : item.activatedDate,
              activatedLabel: goingLive && !item.activatedDate ? "Today" : item.activatedLabel,
            },
            serviceStatusSummary(status),
            user.name,
            "Status",
          );
        }),
      });
    },
    suspendService(id, reason) {
      persist({
        services: book.services.map((item) => {
          if (item.id !== id) return item;

          return stamp({ ...item, status: "SUSPENDED" }, `Service suspended — ${reason}`, user.name, "Status");
        }),
      });
    },
    recordCheck(id, check) {
      persist({
        services: book.services.map((item) => {
          if (item.id !== id) return item;

          return stamp(
            {
              ...item,
              health: check.outcome,
              checks: [{ id: `chk-${Date.now()}`, ...check }, ...item.checks],
            },
            `Health check recorded: ${check.name}`,
            user.name,
            "Health",
          );
        }),
      });
    },
    addNote(id, body) {
      const note: ServiceNote = {
        id: `note-${Date.now()}`,
        body,
        actorName: user.name,
        occurredLabel: "Today",
      };

      persist({
        services: book.services.map((item) => {
          if (item.id !== id) return item;

          return stamp({ ...item, notes: [note, ...item.notes] }, "Internal note added", user.name, "Note");
        }),
      });
    },
  };

  return <ServiceContext.Provider value={value}>{children}</ServiceContext.Provider>;
}

function SERVICE_DATE() {
  return new Date().toISOString().slice(0, 10);
}

export function useServices() {
  const store = useContext(ServiceContext);

  if (!store) {
    throw new Error("Services are only available inside the services workspace.");
  }

  return store;
}

export function useService(id: string) {
  const { services } = useServices();

  return services.find((item) => item.id === id);
}
