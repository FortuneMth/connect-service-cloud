"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";

import type { SessionUser } from "@/auth/roles";
import { AppSidebar } from "@/components/shell/app-sidebar";
import { PageHeader } from "@/components/shell/page-header";
import { Topbar } from "@/components/shell/topbar";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { buildBreadcrumbs, findNavItem, type ShellConfig } from "@/config/navigation";

export function ShellFrame({
  config,
  user,
  children,
}: {
  config: ShellConfig;
  user: SessionUser;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const current = findNavItem(config, pathname);
  const crumbs = buildBreadcrumbs(config, pathname);
  const ownsHeader = current?.ownsHeader === true;

  return (
    <div className="flex h-dvh bg-muted/40">
      <aside className="hidden w-60 shrink-0 border-r border-sidebar-border lg:block">
        <AppSidebar config={config} role={user.role} />
      </aside>
      <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
        {menuOpen ? (
          <SheetContent
            side="left"
            className="w-72 gap-0 p-0 data-[side=left]:sm:max-w-72"
          >
            <SheetTitle className="sr-only">Navigation</SheetTitle>
            <AppSidebar
              config={config}
              role={user.role}
              onNavigate={() => setMenuOpen(false)}
            />
          </SheetContent>
        ) : null}
      </Sheet>
      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar
          user={user}
          crumbs={crumbs}
          onMenu={() => setMenuOpen(true)}
          showAccountControls={!ownsHeader}
        />
        <main className="min-h-0 min-w-0 flex-1 overflow-y-auto">
          <div className="mx-auto flex w-full min-w-0 max-w-[1600px] flex-col gap-6 px-4 py-6 sm:px-6">
            {current && !ownsHeader ? (
              <PageHeader title={current.title} description={current.description} />
            ) : null}
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
