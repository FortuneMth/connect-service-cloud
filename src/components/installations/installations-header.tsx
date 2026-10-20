"use client";

import { CalendarDays, Download, Plus } from "lucide-react";

import { NotificationButton } from "@/components/shell/notification-button";
import { useSessionUser } from "@/components/shell/session-context";
import { UserMenu } from "@/components/shell/user-menu";
import { Button } from "@/components/ui/button";

export function InstallationsHeader({
  onSchedule,
  onCreate,
  onCalendar,
  onExport,
}: {
  onSchedule: () => void;
  onCreate: () => void;
  onCalendar: () => void;
  onExport: () => void;
}) {
  const user = useSessionUser();

  return (
    <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
      <div className="flex flex-col gap-1">
        <h1 className="font-heading text-xl font-semibold tracking-tight">Installations</h1>
        <p className="max-w-3xl text-sm text-muted-foreground">
          Schedule, prepare, execute, and complete customer site installations.
        </p>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <Button type="button" size="sm" onClick={onSchedule}>
          <CalendarDays />
          Schedule Installation
        </Button>
        <Button type="button" variant="outline" size="sm" onClick={onCreate}>
          <Plus />
          Create Installation
        </Button>
        <Button type="button" variant="outline" size="sm" onClick={onCalendar}>
          Calendar View
        </Button>
        <Button type="button" variant="outline" size="sm" onClick={onExport}>
          <Download />
          Export
        </Button>
        <NotificationButton />
        <UserMenu user={user} />
      </div>
    </div>
  );
}
