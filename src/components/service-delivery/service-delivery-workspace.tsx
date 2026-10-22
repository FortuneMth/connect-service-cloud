"use client";

import { useMemo, useState } from "react";

import { ActivationReadiness } from "@/components/service-delivery/activation-readiness";
import { DeliveryAttention } from "@/components/service-delivery/delivery-attention";
import { DeliveryBlockers } from "@/components/service-delivery/delivery-blockers";
import { DeliveryEscalations } from "@/components/service-delivery/delivery-escalations";
import { DeliveryFilters, type DeliveryFilterState } from "@/components/service-delivery/delivery-filters";
import { DeliveryKpis } from "@/components/service-delivery/delivery-kpis";
import { DeliveryPipeline } from "@/components/service-delivery/delivery-pipeline";
import { useDelivery } from "@/components/service-delivery/delivery-store";
import { DeliveryTaskDialog } from "@/components/service-delivery/delivery-task-dialog";
import { DeliveryTimeline } from "@/components/service-delivery/delivery-timeline";
import { DeliveryWorkQueue } from "@/components/service-delivery/delivery-work-queue";
import { FeasibilityWorkspace } from "@/components/service-delivery/feasibility-workspace";
import { InstallationReadiness } from "@/components/service-delivery/installation-readiness";
import { PlanningWorkspace } from "@/components/service-delivery/planning-workspace";
import { ServiceDeliveryHeader } from "@/components/service-delivery/service-delivery-header";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { DELIVERY_STAGES, DELIVERY_TODAY, type DeliveryTask } from "@/data/service-delivery";

const WEEK_END = "2026-10-21";

const initialFilters: DeliveryFilterState = {
  query: "",
  stage: "ALL",
  status: "ALL",
  priority: "ALL",
  owner: "ALL",
  customer: "ALL",
  due: "ALL",
  atRisk: "ALL",
  blocked: "ALL",
  sort: "due",
};

const priorityRank = { HIGH: 0, MEDIUM: 1, LOW: 2 };

export function ServiceDeliveryWorkspace() {
  const { book, addTask } = useDelivery();
  const [filters, setFilters] = useState<DeliveryFilterState>(initialFilters);
  const [adding, setAdding] = useState(false);
  const [added, setAdded] = useState<DeliveryTask | null>(null);
  const [exporting, setExporting] = useState(false);
  const owners = useMemo(() => [...new Set(book.tasks.map((task) => task.ownerName))].sort(), [book.tasks]);
  const customers = useMemo(() => [...new Set(book.tasks.map((task) => task.customerName))].sort(), [book.tasks]);
  const visible = useMemo(() => applyFilters(book.tasks, filters), [book.tasks, filters]);

  return (
    <div className="flex min-w-0 flex-col gap-6">
      <ServiceDeliveryHeader
        onCreate={() => {
          setAdded(null);
          setAdding(true);
        }}
        onExport={() => setExporting(true)}
      />
      <DeliveryKpis />
      <DeliveryPipeline
        activeStage={filters.stage}
        onSelect={(stage) => setFilters((current) => ({ ...current, stage }))}
      />
      <DeliveryAttention tasks={book.tasks} />
      <DeliveryEscalations />
      <div className="flex min-w-0 flex-col gap-3">
        <div className="flex items-baseline justify-between gap-3">
          <h2 className="text-sm font-medium">Delivery work queue</h2>
          <p className="text-xs text-muted-foreground">
            {visible.length} {visible.length === 1 ? "work item" : "work items"}
          </p>
        </div>
        <DeliveryFilters filters={filters} owners={owners} customers={customers} onChange={setFilters} />
        <DeliveryWorkQueue tasks={visible} />
      </div>
      <FeasibilityWorkspace items={book.feasibility} />
      <PlanningWorkspace items={book.planning} />
      <div className="grid min-w-0 gap-6 xl:grid-cols-2">
        <InstallationReadiness items={book.installations} />
        <ActivationReadiness items={book.activations} />
      </div>
      <DeliveryBlockers blockers={book.blockers} />
      <DeliveryTimeline activity={book.activity} />

      <Dialog open={adding} onOpenChange={setAdding}>
        <DialogContent className="max-h-[min(44rem,calc(100%-2rem))] w-[min(42rem,calc(100%-2rem))] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create Delivery Task</DialogTitle>
            <DialogDescription>
              {added
                ? `${added.title} was added to ${added.orderNumber}. Nothing was written to a database.`
                : "Add the next operational step for an order. It is stored in this browser session only."}
            </DialogDescription>
          </DialogHeader>
          {added ? (
            <div className="flex justify-end">
              <Button type="button" onClick={() => setAdding(false)}>Close</Button>
            </div>
          ) : (
            <DeliveryTaskDialog
              onSubmit={(values) => {
                setAdded(addTask(values));
              }}
            />
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={exporting} onOpenChange={setExporting}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Export</DialogTitle>
            <DialogDescription>
              Delivery export will be available when the delivery data service is connected. No file is downloaded
              from this screen.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end">
            <Button type="button" onClick={() => setExporting(false)}>Close</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function applyFilters(tasks: DeliveryTask[], filters: DeliveryFilterState) {
  const query = filters.query.trim().toLowerCase();
  const filtered = tasks.filter((task) => {
    if (filters.stage !== "ALL" && task.stage !== filters.stage) {
      return false;
    }

    if (filters.status !== "ALL" && task.status !== filters.status) {
      return false;
    }

    if (filters.priority !== "ALL" && task.priority !== filters.priority) {
      return false;
    }

    if (filters.owner !== "ALL" && task.ownerName !== filters.owner) {
      return false;
    }

    if (filters.customer !== "ALL" && task.customerName !== filters.customer) {
      return false;
    }

    if (filters.atRisk === "YES" && !task.atRisk) {
      return false;
    }

    if (filters.blocked === "YES" && task.status !== "BLOCKED") {
      return false;
    }

    if (!matchesDue(task, filters.due)) {
      return false;
    }

    if (!query) {
      return true;
    }

    return [task.orderNumber, task.customerName, task.title, task.ownerName, task.dependency, task.issue]
      .join(" ")
      .toLowerCase()
      .includes(query);
  });

  return filtered.sort((a, b) => {
    if (filters.sort === "priority") {
      return priorityRank[a.priority] - priorityRank[b.priority] || a.dueDate.localeCompare(b.dueDate);
    }

    if (filters.sort === "updated") {
      return b.updatedAt.localeCompare(a.updatedAt);
    }

    if (filters.sort === "customer") {
      return a.customerName.localeCompare(b.customerName);
    }

    if (filters.sort === "stage") {
      return DELIVERY_STAGES.indexOf(a.stage) - DELIVERY_STAGES.indexOf(b.stage);
    }

    return a.dueDate.localeCompare(b.dueDate);
  });
}

function matchesDue(task: DeliveryTask, due: DeliveryFilterState["due"]) {
  if (due === "ALL") {
    return true;
  }

  if (due === "TODAY") {
    return task.dueDate === DELIVERY_TODAY;
  }

  if (due === "WEEK") {
    return task.dueDate >= DELIVERY_TODAY && task.dueDate <= WEEK_END;
  }

  if (due === "MONTH") {
    return task.dueDate.startsWith("2026-10");
  }

  return task.dueDate < DELIVERY_TODAY && task.status !== "DONE";
}
