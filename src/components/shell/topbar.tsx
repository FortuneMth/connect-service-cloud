"use client";

import { Menu } from "lucide-react";

import type { SessionUser } from "@/auth/roles";
import { Breadcrumbs } from "@/components/shell/breadcrumbs";
import { NotificationButton } from "@/components/shell/notification-button";
import { UserMenu } from "@/components/shell/user-menu";
import { Button } from "@/components/ui/button";

export function Topbar({
  user,
  crumbs,
  onMenu,
  showAccountControls = true,
}: {
  user: SessionUser;
  crumbs: { label: string; href: string }[];
  onMenu: () => void;
  showAccountControls?: boolean;
}) {
  return (
    <header className="flex h-14 shrink-0 items-center gap-2 border-b bg-background px-3 sm:px-4">
      <Button
        variant="ghost"
        size="icon"
        className="lg:hidden"
        aria-label="Open navigation"
        onClick={onMenu}
      >
        <Menu />
      </Button>
      <Breadcrumbs items={crumbs} />
      {showAccountControls ? (
        <div className="ml-auto flex items-center gap-1">
          <NotificationButton />
          <UserMenu user={user} />
        </div>
      ) : null}
    </header>
  );
}
