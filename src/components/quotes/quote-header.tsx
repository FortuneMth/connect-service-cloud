"use client";

import { Download, Plus } from "lucide-react";

import { NotificationButton } from "@/components/shell/notification-button";
import { useSessionUser } from "@/components/shell/session-context";
import { UserMenu } from "@/components/shell/user-menu";
import { Button } from "@/components/ui/button";

export function QuoteHeader({ onCreate, onExport }: { onCreate: () => void; onExport: () => void }) {
  const user = useSessionUser();

  return (
    <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
      <div className="flex flex-col gap-1">
        <h1 className="font-heading text-xl font-semibold tracking-tight">Quotes</h1>
        <p className="max-w-3xl text-sm text-muted-foreground">
          Create, manage, and track connectivity proposals from draft to acceptance.
        </p>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <Button type="button" size="sm" onClick={onCreate}>
          <Plus />
          Create Quote
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
