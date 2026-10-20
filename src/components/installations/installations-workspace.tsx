"use client";

import { useMemo, useState } from "react";

import { InstallationFilters, type InstallationFilterState } from "@/components/installations/installation-filters";
import { InstallationKpis } from "@/components/installations/installation-kpis";
import { InstallationPipeline } from "@/components/installations/installation-pipeline";
import { InstallationTable } from "@/components/installations/installation-table";
import { useInstallations } from "@/components/installations/installation-store";
import { InstallationsHeader } from "@/components/installations/installations-header";
import { ScheduleInstallationDialog } from "@/components/installations/schedule-installation-dialog";
import { UpcomingInstallations } from "@/components/installations/upcoming-installations";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { INSTALLATION_TODAY, type InstallationRecord } from "@/data/installations";

const priorityRank = { HIGH: 0, MEDIUM: 1, LOW: 2 };
const readinessRank = { BLOCKED: 0, AT_RISK: 1, READY: 2 };

function inWindow(date: string, window: InstallationFilterState["scheduled"]) {
  if (window === "ALL") return true;
  if (window === "WEEK") return date >= "2026-10-12" && date <= "2026-10-18";
  if (window === "MONTH") return date.startsWith("2026-10");
  if (window === "NEXT14") return date >= INSTALLATION_TODAY && date <= "2026-10-29";
  return date < INSTALLATION_TODAY;
}

function matches(item: InstallationRecord, filters: InstallationFilterState) {
  const query = filters.query.trim().toLowerCase();
  const haystack = [item.installationNumber, item.orderNumber, item.customerName, item.siteName, item.serviceName, item.technician]
    .join(" ")
    .toLowerCase();

  if (query && !haystack.includes(query)) return false;
  if (filters.status !== "ALL" && item.status !== filters.status) return false;
  if (filters.customer !== "ALL" && item.customerName !== filters.customer) return false;
  if (filters.technician !== "ALL" && item.technician !== filters.technician) return false;
  if (filters.priority !== "ALL" && item.priority !== filters.priority) return false;
  if (filters.readiness !== "ALL" && item.readiness !== filters.readiness) return false;
  if (filters.risk === "YES" && !item.risk) return false;
  if (filters.risk === "NO" && item.risk) return false;
  if (!inWindow(item.scheduledDate, filters.scheduled)) return false;

  return true;
}

export function InstallationsWorkspace() {
  const { installations, createInstallation } = useInstallations();
  const [filters, setFilters] = useState<InstallationFilterState>({
    query: "",
    status: "ALL",
    customer: "ALL",
    technician: "ALL",
    priority: "ALL",
    readiness: "ALL",
    risk: "ALL",
    scheduled: "ALL",
    sort: "date",
  });
  const [scheduleOpen, setScheduleOpen] = useState(false);
  const [createOpen, setCreateOpen] = useState(false);
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [exportOpen, setExportOpen] = useState(false);
  const [notice, setNotice] = useState("");

  const customers = useMemo(
    () => [...new Set(installations.map((item) => item.customerName))].sort(),
    [installations],
  );
  const technicians = useMemo(
    () => [...new Set(installations.map((item) => item.technician))].sort(),
    [installations],
  );
  const visible = installations.filter((item) => matches(item, filters)).sort((left, right) => {
    if (filters.sort === "priority") return priorityRank[left.priority] - priorityRank[right.priority];
    if (filters.sort === "updated") return right.updatedAt.localeCompare(left.updatedAt);
    if (filters.sort === "customer") return left.customerName.localeCompare(right.customerName);
    if (filters.sort === "readiness") return readinessRank[left.readiness] - readinessRank[right.readiness];

    return `${left.scheduledDate}T${left.scheduledTime}`.localeCompare(`${right.scheduledDate}T${right.scheduledTime}`);
  });
  const calendar = [...installations]
    .filter((item) => item.status !== "CANCELLED")
    .sort((left, right) => `${left.scheduledDate}T${left.scheduledTime}`.localeCompare(`${right.scheduledDate}T${right.scheduledTime}`));
  const days = [...new Set(calendar.map((item) => item.scheduledLabel))];

  return (
    <div className="flex min-w-0 flex-col gap-5">
      <InstallationsHeader
        onSchedule={() => setScheduleOpen(true)}
        onCreate={() => setCreateOpen(true)}
        onCalendar={() => setCalendarOpen(true)}
        onExport={() => setExportOpen(true)}
      />
      {notice ? <p className="text-sm text-emerald-700 dark:text-emerald-400">{notice}</p> : null}
      <InstallationKpis />
      <InstallationPipeline activeStatus={filters.status} onSelect={(status) => setFilters((current) => ({ ...current, status }))} />
      <UpcomingInstallations installations={installations} />
      <InstallationFilters filters={filters} customers={customers} technicians={technicians} onChange={setFilters} />
      <InstallationTable installations={visible} />

      <Dialog open={scheduleOpen} onOpenChange={setScheduleOpen}>
        <DialogContent className="max-h-[min(44rem,calc(100%-2rem))] w-[min(42rem,calc(100%-2rem))] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Schedule Installation</DialogTitle>
            <DialogDescription>Place a field visit against an existing order.</DialogDescription>
          </DialogHeader>
          <ScheduleInstallationDialog
            mode="schedule"
            onSubmit={(values) => {
              const created = createInstallation(values);
              setNotice(`${created.installationNumber} scheduled for ${created.scheduledLabel}.`);
              setScheduleOpen(false);
            }}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent className="max-h-[min(44rem,calc(100%-2rem))] w-[min(42rem,calc(100%-2rem))] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create Installation</DialogTitle>
            <DialogDescription>Open a site installation in preparation.</DialogDescription>
          </DialogHeader>
          <ScheduleInstallationDialog
            mode="create"
            onSubmit={(values) => {
              const created = createInstallation(values);
              setNotice(`${created.installationNumber} created for ${created.customerName}.`);
              setCreateOpen(false);
            }}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={calendarOpen} onOpenChange={setCalendarOpen}>
        <DialogContent className="max-h-[min(44rem,calc(100%-2rem))] w-[min(42rem,calc(100%-2rem))] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Calendar View</DialogTitle>
            <DialogDescription>Site visits grouped by scheduled date.</DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-4">
            {days.map((day) => (
              <section key={day}>
                <h3 className="text-sm font-medium">{day}</h3>
                <ul className="mt-2 flex flex-col gap-1">
                  {calendar.filter((item) => item.scheduledLabel === day).map((item) => (
                    <li key={item.id} className="text-sm text-muted-foreground">
                      <span className="tabular-nums text-foreground">{item.scheduledTime}</span> · {item.siteName} · {item.technician}
                    </li>
                  ))}
                </ul>
              </section>
            ))}
          </div>
          <div className="mt-4 flex justify-end">
            <Button type="button" variant="outline" size="sm" onClick={() => setCalendarOpen(false)}>Close</Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={exportOpen} onOpenChange={setExportOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Export</DialogTitle>
            <DialogDescription>Installation export will open when reporting is connected.</DialogDescription>
          </DialogHeader>
          <div className="flex justify-end">
            <Button type="button" variant="outline" size="sm" onClick={() => setExportOpen(false)}>Close</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
