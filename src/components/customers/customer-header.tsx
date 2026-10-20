"use client";

import { Plus, Upload } from "lucide-react";

import { NotificationButton } from "@/components/shell/notification-button";
import { useSessionUser } from "@/components/shell/session-context";
import { UserMenu } from "@/components/shell/user-menu";
import { Button } from "@/components/ui/button";

export function CustomerHeader({
  onAdd,
  onImport,
}: {
  onAdd: () => void;
  onImport: () => void;
}) {
  const user = useSessionUser();

  return (
    <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
      <div className="flex flex-col gap-1">
        <h1 className="font-heading text-xl font-semibold tracking-tight">Customers</h1>
        <p className="max-w-3xl text-sm text-muted-foreground">
          Manage organisations, contacts, sites, and customer relationships.
        </p>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <Button type="button" variant="outline" size="sm" onClick={onImport}>
          <Upload />
          Import Customers
        </Button>
        <Button type="button" size="sm" onClick={onAdd}>
          <Plus />
          Add Customer
        </Button>
        <NotificationButton />
        <UserMenu user={user} />
      </div>
    </div>
  );
}
