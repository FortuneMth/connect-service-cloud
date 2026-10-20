"use client";

import { UserRound } from "lucide-react";

import { signOutAction } from "@/auth/actions";
import { hasPermission } from "@/auth/permissions";
import { ROLE_LABELS, type SessionUser } from "@/auth/roles";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function UserMenu({ user }: { user: SessionUser }) {
  const roleLabel = ROLE_LABELS[user.role];
  const profileHref = hasPermission(user.role, "/portal/profile")
    ? "/portal/profile"
    : hasPermission(user.role, "/settings")
      ? "/settings"
      : null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={<Button variant="ghost" className="h-9 max-w-64 gap-2 px-1.5" />}
      >
        <Avatar size="sm">
          <AvatarFallback>
            <UserRound />
          </AvatarFallback>
        </Avatar>
        <span className="hidden min-w-0 text-left sm:block">
          <span className="block truncate text-sm leading-none font-medium">{user.name}</span>
          <span className="mt-1 block truncate text-xs font-normal text-muted-foreground">
            {roleLabel}
          </span>
        </span>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64">
        <DropdownMenuGroup>
          <DropdownMenuLabel>
            <span className="block truncate text-sm text-foreground">{user.name}</span>
            <span className="block truncate font-normal">{user.email}</span>
            <span className="block truncate font-normal">{roleLabel}</span>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          {profileHref ? (
            <DropdownMenuItem
              onClick={() => {
                window.location.assign(profileHref);
              }}
            >
              Profile
            </DropdownMenuItem>
          ) : null}
          <DropdownMenuItem onClick={() => void signOutAction()}>Sign out</DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
