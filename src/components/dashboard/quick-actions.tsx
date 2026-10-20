"use client";

import { Building2, CalendarPlus, ClipboardPlus, FileText, type LucideIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const actions: { id: string; label: string; icon: LucideIcon; detail: string }[] = [
  {
    id: "create-quote",
    label: "Create Quote",
    icon: FileText,
    detail: "Quote preparation will open here once commercial workflows are connected.",
  },
  {
    id: "create-order",
    label: "Create Order",
    icon: ClipboardPlus,
    detail: "New orders will be captured here once order intake is connected.",
  },
  {
    id: "add-customer",
    label: "Add Customer",
    icon: Building2,
    detail: "Customer accounts will be created here once customer records are connected.",
  },
  {
    id: "schedule-installation",
    label: "Schedule Installation",
    icon: CalendarPlus,
    detail: "Installation scheduling will open here once field work is connected.",
  },
];

export function QuickActions() {
  return (
    <div className="flex flex-wrap gap-2">
      {actions.map((action) => {
        const Icon = action.icon;

        return (
          <Dialog key={action.id}>
            <DialogTrigger render={<Button variant="outline" size="sm" />}>
              <Icon />
              {action.label}
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{action.label}</DialogTitle>
                <DialogDescription>{action.detail} Nothing is saved from this screen.</DialogDescription>
              </DialogHeader>
            </DialogContent>
          </Dialog>
        );
      })}
    </div>
  );
}
