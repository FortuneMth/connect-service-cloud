"use client";

import { Download, FileText, Plus } from "lucide-react";

import { NotificationButton } from "@/components/shell/notification-button";
import { useSessionUser } from "@/components/shell/session-context";
import { UserMenu } from "@/components/shell/user-menu";
import { Button } from "@/components/ui/button";

export function SalesHeader({
  onCreate,
  onQuote,
  onExport,
}: {
  onCreate: () => void;
  onQuote: () => void;
  onExport: () => void;
}) {
  const user = useSessionUser();

  return (
    <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
      <div className="flex flex-col gap-1">
        <h1 className="font-heading text-xl font-semibold tracking-tight">Sales</h1>
        <p className="max-w-3xl text-sm text-muted-foreground">
          Manage opportunities, pipeline value, and commercial activity.
        </p>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <Button type="button" variant="outline" size="sm" onClick={onExport}>
          <Download />
          Export
        </Button>
        <Button type="button" variant="outline" size="sm" onClick={onQuote}>
          <FileText />
          Create Quote
        </Button>
        <Button type="button" size="sm" onClick={onCreate}>
          <Plus />
          New Opportunity
        </Button>
        <NotificationButton />
        <UserMenu user={user} />
      </div>
    </div>
  );
}
