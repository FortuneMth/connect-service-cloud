import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const statusTone: Record<string, string> = {
  "In delivery": "bg-sky-600",
  "In progress": "bg-sky-600",
  "In Progress": "bg-sky-600",
  "In Review": "bg-sky-600",
  Ready: "bg-emerald-600",
  Resolved: "bg-emerald-600",
  Passed: "bg-emerald-600",
  Assigned: "bg-sky-600",
  Exception: "bg-amber-500",
  Preparation: "bg-zinc-400",
  "Customer Acceptance": "bg-sky-600",
  Restricted: "bg-amber-500",
  "Not Required": "bg-zinc-400",
  Delivered: "bg-emerald-600",
  Unassigned: "bg-zinc-400",
  "Accepted with Issues": "bg-amber-500",
  Complete: "bg-emerald-600",
  Pass: "bg-emerald-600",
  Fail: "bg-amber-500",
  Scheduled: "bg-amber-500",
  Confirmed: "bg-emerald-600",
  Pending: "bg-zinc-400",
  Active: "bg-emerald-600",
  Live: "bg-emerald-600",
  Healthy: "bg-emerald-600",
  Degraded: "bg-amber-500",
  Down: "bg-amber-500",
  Unknown: "bg-zinc-400",
  Activated: "bg-emerald-600",
  Open: "bg-sky-600",
  New: "bg-zinc-400",
  Submitted: "bg-zinc-400",
  Validation: "bg-zinc-400",
  Feasibility: "bg-sky-600",
  Planning: "bg-sky-600",
  Build: "bg-sky-600",
  "On Hold": "bg-amber-500",
  Blocked: "bg-amber-500",
  Installation: "bg-amber-500",
  Testing: "bg-sky-600",
  Activation: "bg-emerald-600",
  Billing: "bg-zinc-500",
  Completed: "bg-emerald-600",
  "At Risk": "bg-amber-500",
  Suspended: "bg-zinc-500",
  Provisioning: "bg-sky-600",
  Planned: "bg-zinc-400",
  Inactive: "bg-zinc-400",
  Draft: "bg-zinc-400",
  "Internal Review": "bg-amber-500",
  Sent: "bg-sky-600",
  "Customer Review": "bg-sky-600",
  Approved: "bg-emerald-600",
  Accepted: "bg-emerald-600",
  Expired: "bg-zinc-500",
  Rejected: "bg-zinc-500",
  Cancelled: "bg-zinc-500",
  Lead: "bg-zinc-400",
  Qualification: "bg-sky-600",
  "Solution Design": "bg-sky-600",
  Proposal: "bg-amber-500",
  Negotiation: "bg-amber-500",
  Won: "bg-emerald-600",
  Lost: "bg-zinc-500",
  Done: "bg-emerald-600",
  High: "bg-amber-500",
  Medium: "bg-sky-600",
  Low: "bg-zinc-400",
};

export function StatusBadge({ status }: { status: string }) {
  return (
    <Badge variant="outline" className="font-normal text-muted-foreground">
      <span
        className={cn("size-1.5 rounded-full", statusTone[status] ?? "bg-muted-foreground")}
      />
      {status}
    </Badge>
  );
}
