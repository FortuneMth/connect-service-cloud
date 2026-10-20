"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

import { useSessionUser } from "@/components/shell/session-context";
import {
  blankChecklist,
  blankFieldChecklist,
  demoInstallations,
  nextInstallationNumber,
  readinessFromChecklist,
  summaryFromChecklist,
  type FieldCheck,
  type InstallationAcceptance,
  type InstallationNote,
  type InstallationRecord,
  type InstallationStatus,
  type InstallationTest,
  type ReadinessItem,
} from "@/data/installations";
import { formatCloseDate } from "@/data/sales";

const STORAGE_KEY = "csc-installation-book";

type InstallationBook = {
  installations: InstallationRecord[];
};

type CreateInstallationInput = {
  orderId: string;
  orderNumber: string;
  customerId: string;
  customerName: string;
  siteName: string;
  serviceId: string;
  serviceNumber: string;
  serviceName: string;
  scheduledDate: string;
  scheduledTime: string;
  technician: string;
  priority: InstallationRecord["priority"];
  status: InstallationStatus;
};

type InstallationStore = {
  installations: InstallationRecord[];
  hydrated: boolean;
  createInstallation: (input: CreateInstallationInput) => InstallationRecord;
  changeStatus: (id: string, status: InstallationStatus) => void;
  reschedule: (id: string, date: string, time: string, reason: string) => void;
  assignTechnician: (id: string, technician: string) => void;
  toggleReadiness: (id: string, itemId: string) => void;
  toggleFieldCheck: (id: string, itemId: string) => void;
  recordTest: (id: string, test: Omit<InstallationTest, "id">) => void;
  recordAcceptance: (id: string, acceptance: InstallationAcceptance) => void;
  addNote: (id: string, body: string) => void;
};

const InstallationContext = createContext<InstallationStore | null>(null);

function statusEvent(status: InstallationStatus) {
  if (status === "IN_PROGRESS") return "Installation started";
  if (status === "COMPLETED") return "Installation completed";
  if (status === "TESTING") return "Testing started";
  if (status === "CUSTOMER_ACCEPTANCE") return "Customer acceptance requested";
  if (status === "CANCELLED") return "Installation cancelled";
  if (status === "READY") return "Installation marked ready";
  if (status === "SCHEDULED") return "Installation scheduled";

  return "Installation moved to preparation";
}

function stamp(installation: InstallationRecord, summary: string, actorName: string, category: string): InstallationRecord {
  return {
    ...installation,
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
      ...installation.timeline,
    ],
  };
}

function applyReadiness(installation: InstallationRecord, checklist: ReadinessItem[]) {
  const derived = readinessFromChecklist(checklist);
  const summary = summaryFromChecklist(checklist);
  const workPermit = installation.workPermit === "Not Required" ? "Not Required" : summary.workPermit;

  return {
    ...installation,
    checklist,
    ...derived,
    ...summary,
    workPermit,
  };
}

export function InstallationProvider({ children }: { children: ReactNode }) {
  const user = useSessionUser();
  const [book, setBook] = useState<InstallationBook>({ installations: demoInstallations });
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const stored = window.sessionStorage.getItem(STORAGE_KEY);

    if (stored) {
      try {
        const parsed = JSON.parse(stored) as InstallationBook;

        if (Array.isArray(parsed.installations)) {
          setBook(parsed);
        }
      } catch {
        window.sessionStorage.removeItem(STORAGE_KEY);
      }
    }

    setHydrated(true);
  }, []);

  function persist(next: InstallationBook) {
    setBook(next);
    window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  }

  const value: InstallationStore = {
    installations: book.installations,
    hydrated,
    createInstallation(input) {
      const actorName = user.name;
      const installation: InstallationRecord = {
        id: `ins-session-${Date.now()}`,
        organisationId: "org-connect-service-demo",
        installationNumber: nextInstallationNumber(book.installations),
        orderId: input.orderId,
        orderNumber: input.orderNumber,
        customerId: input.customerId,
        customerName: input.customerName,
        siteId: `site-session-${Date.now()}`,
        siteName: input.siteName,
        address: input.siteName,
        city: "To be confirmed",
        siteContactName: "Site contact",
        siteContactPhone: "—",
        accessHours: "08:00–17:00",
        accessRequirements: "Confirm access before arrival.",
        parking: "To be confirmed.",
        technicalRoom: "To be confirmed.",
        serviceId: input.serviceId,
        serviceNumber: input.serviceNumber,
        serviceName: input.serviceName,
        scheduledDate: input.scheduledDate,
        scheduledLabel: formatCloseDate(input.scheduledDate),
        scheduledTime: input.scheduledTime,
        durationHours: 4,
        technician: input.technician,
        status: input.status,
        priority: input.priority,
        readiness: "AT_RISK",
        risk: "Site access pending.",
        siteAccess: "Pending",
        siteSurvey: "Pending",
        cpe: "Pending",
        materials: "Pending",
        customerContact: "Pending",
        workPermit: "Not Required",
        checklist: blankChecklist(input.technician),
        fieldChecklist: blankFieldChecklist(),
        tests: [],
        acceptance: { status: "Pending", contact: "Site contact", dateLabel: "—", method: "—", notes: "" },
        documents: [
          { id: "doc-survey", name: "Site Survey" },
          { id: "doc-photos", name: "Installation Photos" },
          { id: "doc-tests", name: "Test Results" },
          { id: "doc-report", name: "Completion Report" },
          { id: "doc-acceptance", name: "Customer Acceptance" },
        ],
        timeline: [],
        notes: [],
        createdAt: new Date().toISOString(),
        createdLabel: "Today",
        updatedAt: new Date().toISOString(),
        updatedLabel: "Today",
      };
      const stamped = stamp(installation, statusEvent(input.status), actorName, "Schedule");
      const ready = applyReadiness(stamped, stamped.checklist);

      persist({ installations: [ready, ...book.installations] });

      return ready;
    },
    changeStatus(id, status) {
      persist({
        installations: book.installations.map((item) =>
          item.id === id ? stamp({ ...item, status }, statusEvent(status), user.name, status === "TESTING" ? "Testing" : "Execution") : item,
        ),
      });
    },
    reschedule(id, date, time, reason) {
      const label = formatCloseDate(date);

      persist({
        installations: book.installations.map((item) =>
          item.id === id
            ? stamp(
                { ...item, scheduledDate: date, scheduledLabel: label, scheduledTime: time },
                `Installation rescheduled to ${label} ${time} — ${reason}`,
                user.name,
                "Schedule",
              )
            : item,
        ),
      });
    },
    assignTechnician(id, technician) {
      persist({
        installations: book.installations.map((item) => {
          if (item.id !== id) return item;

          const checklist = item.checklist.map((check) =>
            check.id === "technician" ? { ...check, done: true, ownerName: technician, updatedLabel: "Today" } : check,
          );

          return stamp(applyReadiness({ ...item, technician }, checklist), `Technician assigned to ${technician}`, user.name, "Assignment");
        }),
      });
    },
    toggleReadiness(id, itemId) {
      persist({
        installations: book.installations.map((item) => {
          if (item.id !== id) return item;

          const checklist = item.checklist.map((check) =>
            check.id === itemId ? { ...check, done: !check.done, updatedLabel: "Today" } : check,
          );
          const toggled = item.checklist.find((check) => check.id === itemId);

          return stamp(applyReadiness(item, checklist), `Readiness updated: ${toggled?.label ?? "checklist item"}`, user.name, "Access");
        }),
      });
    },
    toggleFieldCheck(id, itemId) {
      persist({
        installations: book.installations.map((item) => {
          if (item.id !== id) return item;

          const fieldChecklist: FieldCheck[] = item.fieldChecklist.map((check) =>
            check.id === itemId ? { ...check, done: !check.done, updatedLabel: "Today" } : check,
          );
          const toggled = item.fieldChecklist.find((check) => check.id === itemId);

          return stamp({ ...item, fieldChecklist }, `Field checklist updated: ${toggled?.label ?? "item"}`, user.name, "Execution");
        }),
      });
    },
    recordTest(id, test) {
      persist({
        installations: book.installations.map((item) =>
          item.id === id
            ? stamp(
                { ...item, tests: [{ ...test, id: `tst-${Date.now()}` }, ...item.tests] },
                `Test recorded: ${test.name}`,
                user.name,
                "Testing",
              )
            : item,
        ),
      });
    },
    recordAcceptance(id, acceptance) {
      const nextStatus: InstallationStatus = acceptance.status === "Rejected" ? "TESTING" : "COMPLETED";

      persist({
        installations: book.installations.map((item) =>
          item.id === id
            ? stamp(
                { ...item, acceptance, status: nextStatus },
                acceptance.status === "Rejected" ? "Customer acceptance rejected" : "Customer acceptance received",
                user.name,
                "Acceptance",
              )
            : item,
        ),
      });
    },
    addNote(id, body) {
      const note: InstallationNote = {
        id: `note-${Date.now()}`,
        body,
        actorName: user.name,
        occurredLabel: "Today",
      };

      persist({
        installations: book.installations.map((item) =>
          item.id === id ? stamp({ ...item, notes: [note, ...item.notes] }, "Internal note added", user.name, "Note") : item,
        ),
      });
    },
  };

  return <InstallationContext.Provider value={value}>{children}</InstallationContext.Provider>;
}

export function useInstallations() {
  const store = useContext(InstallationContext);

  if (!store) {
    throw new Error("Installations are only available inside the installations workspace.");
  }

  return store;
}

export function useInstallation(id: string) {
  const { installations } = useInstallations();

  return installations.find((item) => item.id === id);
}
