"use client";

import { useMemo, useState } from "react";

import { ActivationQueue } from "@/components/services/activation-queue";
import { ProvisionServiceDialog } from "@/components/services/provision-service-dialog";
import { ServiceFilters, type ServiceFilterState } from "@/components/services/service-filters";
import { ServiceKpis } from "@/components/services/service-kpis";
import { ServicePipeline } from "@/components/services/service-pipeline";
import { useServices, type CreateServiceInput } from "@/components/services/service-store";
import { ServiceTable } from "@/components/services/service-table";
import { ServicesHeader } from "@/components/services/services-header";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { HEALTH_LABEL, SERVICE_STATUS_LABEL, type ServiceRecord, type ServiceStatus } from "@/data/services";

const dialogClass = "max-h-[min(44rem,calc(100%-2rem))] w-[min(42rem,calc(100%-2rem))] overflow-y-auto";

const statusRank: Record<ServiceStatus, number> = {
  AT_RISK: 0,
  SUSPENDED: 1,
  TESTING: 2,
  PROVISIONING: 3,
  PENDING: 4,
  LIVE: 5,
  CANCELLED: 6,
};

const initialFilters: ServiceFilterState = {
  query: "",
  status: "ALL",
  customer: "ALL",
  health: "ALL",
  access: "ALL",
  sort: "updated",
};

function matches(item: ServiceRecord, filters: ServiceFilterState) {
  const query = filters.query.trim().toLowerCase();
  const haystack = [item.serviceNumber, item.customerName, item.siteName, item.product, item.orderNumber, item.circuitId]
    .join(" ")
    .toLowerCase();

  if (query && !haystack.includes(query)) return false;
  if (filters.status !== "ALL" && item.status !== filters.status) return false;
  if (filters.customer !== "ALL" && item.customerName !== filters.customer) return false;
  if (filters.health !== "ALL" && item.health !== filters.health) return false;
  if (filters.access !== "ALL" && item.accessType !== filters.access) return false;

  return true;
}

export function ServicesWorkspace() {
  const { services, createService } = useServices();
  const [filters, setFilters] = useState<ServiceFilterState>(initialFilters);
  const [dialog, setDialog] = useState<"provision" | "create" | "health" | "export" | null>(null);
  const [notice, setNotice] = useState("");

  const customers = useMemo(
    () => [...new Set(services.map((item) => item.customerName))].sort(),
    [services],
  );
  const visible = services.filter((item) => matches(item, filters)).sort((left, right) => {
    if (filters.sort === "customer") return left.customerName.localeCompare(right.customerName);
    if (filters.sort === "monthly") return right.monthly - left.monthly;
    if (filters.sort === "status") return statusRank[left.status] - statusRank[right.status];
    if (filters.sort === "activated") return (right.activatedDate || "").localeCompare(left.activatedDate || "");

    return right.updatedAt.localeCompare(left.updatedAt);
  });
  const attention = services.filter((item) => item.status === "AT_RISK" || item.health === "DEGRADED" || item.health === "DOWN");

  function submit(input: CreateServiceInput) {
    const created = createService(input);

    setDialog(null);
    setNotice(`${created.serviceNumber} ${input.status === "PROVISIONING" ? "provisioning started" : "created"}.`);
  }

  return (
    <div className="flex min-w-0 flex-col gap-4">
      <ServicesHeader
        onProvision={() => setDialog("provision")}
        onCreate={() => setDialog("create")}
        onHealth={() => setDialog("health")}
        onExport={() => setDialog("export")}
      />
      {notice ? <p className="text-sm text-emerald-700 dark:text-emerald-400">{notice}</p> : null}
      <ServiceKpis />
      <ServicePipeline activeStatus={filters.status} onSelect={(status) => setFilters({ ...filters, status })} />
      <ActivationQueue services={services} />
      <ServiceFilters filters={filters} customers={customers} onChange={setFilters} />
      <ServiceTable services={visible} />
      <Dialog open={dialog === "provision" || dialog === "create"} onOpenChange={(open) => setDialog(open ? dialog : null)}>
        <DialogContent className={dialogClass}>
          <DialogHeader>
            <DialogTitle>{dialog === "create" ? "Create Service" : "Provision Service"}</DialogTitle>
            <DialogDescription>
              {dialog === "create"
                ? "Add a pending service against an open order."
                : "Start provisioning a service against an open order."}
            </DialogDescription>
          </DialogHeader>
          {dialog === "provision" || dialog === "create" ? (
            <ProvisionServiceDialog mode={dialog === "create" ? "create" : "provision"} onSubmit={submit} />
          ) : null}
        </DialogContent>
      </Dialog>
      <Dialog open={dialog === "health"} onOpenChange={(open) => setDialog(open ? "health" : null)}>
        <DialogContent className={dialogClass}>
          <DialogHeader>
            <DialogTitle>Health View</DialogTitle>
            <DialogDescription>Services that are at risk, degraded, or down.</DialogDescription>
          </DialogHeader>
          <ul className="flex flex-col gap-2">
            {attention.map((item) => (
              <li key={item.id} className="rounded-lg border px-3 py-2">
                <p className="font-mono text-xs">{item.serviceNumber}</p>
                <p className="text-sm">{item.siteName}</p>
                <p className="text-xs text-muted-foreground">
                  {SERVICE_STATUS_LABEL[item.status]} · {HEALTH_LABEL[item.health]}
                  {item.risk ? ` · ${item.risk}` : ""}
                </p>
              </li>
            ))}
          </ul>
        </DialogContent>
      </Dialog>
      <Dialog open={dialog === "export"} onOpenChange={(open) => setDialog(open ? "export" : null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Export</DialogTitle>
            <DialogDescription>Service export will open when reporting is connected.</DialogDescription>
          </DialogHeader>
          <div className="flex justify-end">
            <Button type="button" variant="outline" size="sm" onClick={() => setDialog(null)}>Close</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
