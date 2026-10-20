"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

import {
  DELIVERY_OWNERS,
  FEASIBILITY_STATUS_LABEL,
  TASK_PRIORITY_LABEL,
  TASK_STATUS_LABEL,
  deliveryBook,
  nextTaskNumber,
  type ActivityCategory,
  type DeliveryBook,
  type DeliveryStage,
  type DeliveryTask,
  type FeasibilityStatus,
  type TaskPriority,
  type TaskStatus,
} from "@/data/service-delivery";
import { DEMO_ORGANISATION_ID, demoOrders } from "@/data/orders";
import { formatCloseDate } from "@/data/sales";

const STORAGE_KEY = "csc-delivery-book";

export type TaskDraft = {
  orderId: string;
  stage: DeliveryStage;
  title: string;
  description: string;
  ownerId: string;
  priority: TaskPriority;
  dueDate: string;
  dependency: string;
};

type DeliveryStore = {
  book: DeliveryBook;
  addTask: (draft: TaskDraft) => DeliveryTask;
  setTaskStatus: (id: string, status: TaskStatus) => void;
  reassignTask: (id: string, ownerId: string) => void;
  setTaskPriority: (id: string, priority: TaskPriority) => void;
  completeTask: (id: string) => void;
  setFeasibilityStatus: (id: string, status: FeasibilityStatus) => void;
  resolveBlocker: (id: string) => void;
  assignBlocker: (id: string, ownerId: string) => void;
};

const DeliveryContext = createContext<DeliveryStore | null>(null);

function persist(setBook: (book: DeliveryBook) => void, book: DeliveryBook) {
  sessionStorage.setItem(STORAGE_KEY, JSON.stringify(book));
  setBook(book);
}

function clockLabel() {
  const now = new Date();

  return `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
}

function ownerName(ownerId: string) {
  return DELIVERY_OWNERS.find((owner) => owner.id === ownerId)?.name ?? "Unassigned";
}

function withActivity(
  book: DeliveryBook,
  summary: string,
  category: ActivityCategory,
  orderId: string | null,
  orderNumber: string | null,
): DeliveryBook {
  return {
    ...book,
    activity: [
      {
        id: `dlv-act-${book.activity.length + 1}`,
        timeLabel: clockLabel(),
        summary,
        category,
        occurredLabel: "Today",
        orderId,
        orderNumber,
      },
      ...book.activity,
    ],
  };
}

export function DeliveryProvider({ children }: { children: ReactNode }) {
  const [book, setBook] = useState(deliveryBook);

  useEffect(() => {
    const stored = sessionStorage.getItem(STORAGE_KEY);

    if (!stored) {
      return;
    }

    try {
      const parsed = JSON.parse(stored) as DeliveryBook;

      if (parsed && Array.isArray(parsed.tasks) && parsed.tasks.length > 0) {
        setBook(parsed);
      }
    } catch {
      sessionStorage.removeItem(STORAGE_KEY);
    }
  }, []);

  const addTask = (draft: TaskDraft) => {
    const known = demoOrders.find((item) => item.id === draft.orderId);

    if (!known) {
      throw new Error("Unknown order");
    }

    const suffix = nextTaskNumber(book.tasks);
    const record: DeliveryTask = {
      id: `tsk-session-${suffix}`,
      organisationId: DEMO_ORGANISATION_ID,
      orderId: known.id,
      orderNumber: known.orderNumber,
      customerId: known.customer.id,
      customerName: known.customer.name,
      stage: draft.stage,
      title: draft.title.trim(),
      description: draft.description.trim(),
      issue: draft.title.trim(),
      needsAttention: false,
      atRisk: false,
      assignedUserId: draft.ownerId,
      ownerName: ownerName(draft.ownerId),
      priority: draft.priority,
      status: "OPEN",
      dueDate: draft.dueDate,
      dueLabel: formatCloseDate(draft.dueDate),
      dependency: draft.dependency.trim(),
      createdAt: new Date().toISOString(),
      createdLabel: "Today",
      updatedAt: new Date().toISOString(),
      updatedLabel: "Today",
    };
    const next = withActivity(
      { ...book, tasks: [record, ...book.tasks] },
      `Delivery task created for ${record.orderNumber}`,
      "EXCEPTION",
      record.orderId,
      record.orderNumber,
    );

    persist(setBook, next);

    return record;
  };

  const setTaskStatus = (id: string, status: TaskStatus) => {
    const current = book.tasks.find((item) => item.id === id);

    if (!current || current.status === status) {
      return;
    }

    const tasks = book.tasks.map((item) =>
      item.id === id
        ? { ...item, status, atRisk: status === "DONE" ? false : item.atRisk, updatedAt: new Date().toISOString(), updatedLabel: "Today" }
        : item,
    );

    persist(
      setBook,
      withActivity(
        { ...book, tasks },
        `${current.orderNumber} task moved to ${TASK_STATUS_LABEL[status]}`,
        status === "BLOCKED" ? "EXCEPTION" : stageCategory(current.stage),
        current.orderId,
        current.orderNumber,
      ),
    );
  };

  const reassignTask = (id: string, ownerId: string) => {
    const current = book.tasks.find((item) => item.id === id);

    if (!current) {
      return;
    }

    const name = ownerName(ownerId);
    const tasks = book.tasks.map((item) =>
      item.id === id
        ? { ...item, assignedUserId: ownerId, ownerName: name, updatedAt: new Date().toISOString(), updatedLabel: "Today" }
        : item,
    );

    persist(
      setBook,
      withActivity(
        { ...book, tasks },
        `${current.orderNumber} task reassigned to ${name}`,
        stageCategory(current.stage),
        current.orderId,
        current.orderNumber,
      ),
    );
  };

  const setTaskPriority = (id: string, priority: TaskPriority) => {
    const current = book.tasks.find((item) => item.id === id);

    if (!current || current.priority === priority) {
      return;
    }

    const tasks = book.tasks.map((item) =>
      item.id === id
        ? { ...item, priority, updatedAt: new Date().toISOString(), updatedLabel: "Today" }
        : item,
    );

    persist(
      setBook,
      withActivity(
        { ...book, tasks },
        `${current.orderNumber} priority set to ${TASK_PRIORITY_LABEL[priority]}`,
        stageCategory(current.stage),
        current.orderId,
        current.orderNumber,
      ),
    );
  };

  const completeTask = (id: string) => {
    setTaskStatus(id, "DONE");
  };

  const setFeasibilityStatus = (id: string, status: FeasibilityStatus) => {
    const current = book.feasibility.find((item) => item.id === id);

    if (!current || current.status === status) {
      return;
    }

    const feasibility = book.feasibility.map((item) => (item.id === id ? { ...item, status } : item));

    persist(
      setBook,
      withActivity(
        { ...book, feasibility },
        `Feasibility for ${current.orderNumber} set to ${FEASIBILITY_STATUS_LABEL[status]}`,
        "FEASIBILITY",
        current.orderId,
        current.orderNumber,
      ),
    );
  };

  const resolveBlocker = (id: string) => {
    const current = book.blockers.find((item) => item.id === id);

    if (!current || current.status === "RESOLVED") {
      return;
    }

    const blockers = book.blockers.map((item) =>
      item.id === id ? { ...item, status: "RESOLVED" as const, updatedAt: new Date().toISOString() } : item,
    );

    persist(
      setBook,
      withActivity(
        { ...book, blockers },
        `Blocker resolved on ${current.orderNumber}: ${current.blocker}`,
        "EXCEPTION",
        current.orderId,
        current.orderNumber,
      ),
    );
  };

  const assignBlocker = (id: string, ownerId: string) => {
    const current = book.blockers.find((item) => item.id === id);

    if (!current || current.status === "RESOLVED") {
      return;
    }

    const name = ownerName(ownerId);
    const blockers = book.blockers.map((item) =>
      item.id === id
        ? { ...item, assignedUserId: ownerId, ownerName: name, updatedAt: new Date().toISOString() }
        : item,
    );

    persist(
      setBook,
      withActivity(
        { ...book, blockers },
        `Blocker on ${current.orderNumber} assigned to ${name}`,
        "EXCEPTION",
        current.orderId,
        current.orderNumber,
      ),
    );
  };

  return (
    <DeliveryContext.Provider
      value={{
        book,
        addTask,
        setTaskStatus,
        reassignTask,
        setTaskPriority,
        completeTask,
        setFeasibilityStatus,
        resolveBlocker,
        assignBlocker,
      }}
    >
      {children}
    </DeliveryContext.Provider>
  );
}

function stageCategory(stage: DeliveryStage): ActivityCategory {
  if (stage === "VALIDATION" || stage === "FEASIBILITY") {
    return "FEASIBILITY";
  }

  if (stage === "PLANNING" || stage === "BUILD") {
    return "PLANNING";
  }

  if (stage === "INSTALLATION") {
    return "INSTALLATION";
  }

  if (stage === "TESTING") {
    return "TESTING";
  }

  return "ACTIVATION";
}

export function useDelivery() {
  const context = useContext(DeliveryContext);

  if (!context) {
    throw new Error("useDelivery must be used within DeliveryProvider");
  }

  return context;
}
