"use client";

import { Waypoints } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { hasPermission } from "@/auth/permissions";
import type { Role } from "@/auth/roles";
import { cn } from "@/lib/utils";
import type { ShellConfig } from "@/config/navigation";

export function AppSidebar({
  config,
  role,
  onNavigate,
}: {
  config: ShellConfig;
  role: Role;
  onNavigate?: () => void;
}) {
  const pathname = usePathname();
  const groups = config.groups
    .map((group) => ({
      ...group,
      items: group.items.filter((item) => hasPermission(role, item.href)),
    }))
    .filter((group) => group.items.length > 0);

  return (
    <div className="flex h-full flex-col bg-sidebar text-sidebar-foreground">
      <div className="flex h-14 items-center gap-2.5 border-b border-sidebar-border px-3">
        <div className="flex size-8 shrink-0 items-center justify-center rounded-md bg-foreground text-background">
          <Waypoints className="size-4" />
        </div>
        <div className="min-w-0 leading-tight">
          <p className="truncate text-sm font-semibold">Connect Service Cloud</p>
          <p className="truncate text-xs text-muted-foreground">{config.areaLabel}</p>
        </div>
      </div>
      <div className="min-h-0 flex-1 overflow-y-auto">
        <nav className="flex flex-col px-2 py-2" aria-label={config.areaLabel}>
          {groups.map((group) => (
            <div key={group.label} className="pb-2">
              <p className="px-2 pt-3 pb-1 text-[11px] font-medium tracking-wide text-muted-foreground uppercase">
                {group.label}
              </p>
              <ul className="flex flex-col gap-0.5">
                {group.items.map((item) => {
                  const active =
                    pathname === item.href ||
                    (item.href !== config.homeHref && pathname.startsWith(`${item.href}/`));
                  const Icon = item.icon;

                  return (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        onClick={onNavigate}
                        aria-current={active ? "page" : undefined}
                        className={cn(
                          "flex h-8 items-center gap-2 rounded-md px-2 text-sm text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                          active &&
                            "bg-sidebar-accent font-medium text-sidebar-accent-foreground",
                        )}
                      >
                        <Icon className="size-4 shrink-0" />
                        <span className="truncate">{item.title}</span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </nav>
      </div>
    </div>
  );
}
