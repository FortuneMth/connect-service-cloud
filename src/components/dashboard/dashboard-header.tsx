"use client";

import { useEffect, useState } from "react";
import { RefreshCw } from "lucide-react";

import { NotificationButton } from "@/components/shell/notification-button";
import { useSessionUser } from "@/components/shell/session-context";
import { UserMenu } from "@/components/shell/user-menu";
import { Button } from "@/components/ui/button";

const dateTimeFormat = new Intl.DateTimeFormat("en-ZA", {
  weekday: "long",
  day: "numeric",
  month: "long",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
  hourCycle: "h23",
});

export function DashboardHeader() {
  const user = useSessionUser();
  const [asOf, setAsOf] = useState<Date | null>(null);

  useEffect(() => {
    setAsOf(new Date());
  }, []);

  return (
    <div className="flex min-w-0 flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
      <div className="flex flex-col gap-1">
        <h1 className="font-heading text-xl font-semibold tracking-tight">Operations Dashboard</h1>
        <p className="max-w-3xl text-sm text-muted-foreground">
          Monitor orders, service delivery, installations, activations and operational performance.
        </p>
      </div>
      <div className="flex flex-wrap items-center gap-2 lg:justify-end">
        <time
          dateTime={asOf ? asOf.toISOString() : undefined}
          className="text-xs text-muted-foreground tabular-nums"
        >
          {asOf ? dateTimeFormat.format(asOf) : "Current date"}
        </time>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => setAsOf(new Date())}
        >
          <RefreshCw />
          Refresh
        </Button>
        <NotificationButton />
        <UserMenu user={user} />
      </div>
    </div>
  );
}
