import type { LucideIcon } from "lucide-react";
import {
  ArrowRight,
  CalendarClock,
  CircleCheck,
  MessageSquare,
  Receipt,
} from "lucide-react";

/**
 * Static operations data for the internal dashboard.
 * Field names follow the Prisma models and will be replaced by queries later.
 */

export type DemoOrderType = "ENTERPRISE" | "WHOLESALE" | "RESELLER" | "GOVERNMENT";

export type DemoOrderStatus =
  | "SUBMITTED"
  | "VALIDATION"
  | "FEASIBILITY"
  | "PLANNING"
  | "INSTALLATION"
  | "TESTING"
  | "ACTIVATION"
  | "BILLING"
  | "COMPLETED";

export type DemoPriority = "LOW" | "NORMAL" | "HIGH" | "URGENT";

export type PipelineStageKey = "NEW" | DemoOrderStatus;

export type InstallationStatus = "SCHEDULED" | "CONFIRMED";

export type ActivityAction =
  | "STATUS_CHANGED"
  | "MESSAGE_SENT"
  | "FEASIBILITY_APPROVED"
  | "INSTALLATION_SCHEDULED"
  | "INVOICE_ISSUED";

export const ORDER_TYPE_LABEL: Record<DemoOrderType, string> = {
  ENTERPRISE: "Enterprise",
  WHOLESALE: "Wholesale",
  RESELLER: "Reseller",
  GOVERNMENT: "Government",
};

export const ORDER_STATUS_LABEL: Record<DemoOrderStatus, string> = {
  SUBMITTED: "Submitted",
  VALIDATION: "Validation",
  FEASIBILITY: "Feasibility",
  PLANNING: "Planning",
  INSTALLATION: "Installation",
  TESTING: "Testing",
  ACTIVATION: "Activation",
  BILLING: "Billing",
  COMPLETED: "Completed",
};

export const PRIORITY_LABEL: Record<DemoPriority, string> = {
  LOW: "Low",
  NORMAL: "Normal",
  HIGH: "High",
  URGENT: "Urgent",
};

export const INSTALLATION_STATUS_LABEL: Record<InstallationStatus, string> = {
  SCHEDULED: "Scheduled",
  CONFIRMED: "Confirmed",
};

export type DashboardKpi = {
  id: string;
  label: string;
  value: string;
  context: string;
  contextTone: "neutral" | "positive" | "attention";
};

export const dashboardKpis: DashboardKpi[] = [
  {
    id: "active-orders",
    label: "Active Orders",
    value: "24",
    context: "+12% vs last month",
    contextTone: "positive",
  },
  {
    id: "orders-in-delivery",
    label: "Orders In Delivery",
    value: "11",
    context: "3 requiring attention",
    contextTone: "attention",
  },
  {
    id: "installations-this-week",
    label: "Installations This Week",
    value: "8",
    context: "2 scheduled today",
    contextTone: "neutral",
  },
  {
    id: "services-activated",
    label: "Services Activated",
    value: "6",
    context: "Completed this month",
    contextTone: "neutral",
  },
  {
    id: "mrr",
    label: "Monthly Recurring Revenue",
    value: "R 428,500",
    context: "+8.4% this month",
    contextTone: "positive",
  },
];

export type PipelineStage = {
  key: PipelineStageKey;
  label: string;
  count: number;
};

export const pipelineStages: PipelineStage[] = [
  { key: "NEW", label: "New", count: 4 },
  { key: "VALIDATION", label: "Validation", count: 3 },
  { key: "FEASIBILITY", label: "Feasibility", count: 5 },
  { key: "PLANNING", label: "Planning", count: 3 },
  { key: "INSTALLATION", label: "Installation", count: 4 },
  { key: "TESTING", label: "Testing", count: 2 },
  { key: "ACTIVATION", label: "Activation", count: 1 },
  { key: "BILLING", label: "Billing", count: 1 },
  { key: "COMPLETED", label: "Completed", count: 18 },
];

export type AttentionOrder = {
  orderNumber: string;
  customerName: string;
  orderType: DemoOrderType;
  status: DemoOrderStatus;
  issue: string;
  ownerName: string;
  dueLabel: string;
  priority: DemoPriority;
};

export const attentionOrders: AttentionOrder[] = [
  {
    orderNumber: "ORD-2026-0142",
    customerName: "ABC Manufacturing",
    orderType: "ENTERPRISE",
    status: "INSTALLATION",
    issue: "Site access not confirmed",
    ownerName: "Sarah M.",
    dueLabel: "Today",
    priority: "URGENT",
  },
  {
    orderNumber: "ORD-2026-0137",
    customerName: "Department of Education",
    orderType: "GOVERNMENT",
    status: "FEASIBILITY",
    issue: "Additional site information required",
    ownerName: "David K.",
    dueLabel: "Tomorrow",
    priority: "HIGH",
  },
  {
    orderNumber: "ORD-2026-0129",
    customerName: "XYZ Telecom",
    orderType: "WHOLESALE",
    status: "PLANNING",
    issue: "Capacity review pending",
    ownerName: "Michael R.",
    dueLabel: "16 Oct",
    priority: "NORMAL",
  },
];

export type RecentOrder = {
  orderNumber: string;
  customerName: string;
  productName: string;
  orderType: DemoOrderType;
  status: DemoOrderStatus;
  createdLabel: string;
  ownerName: string;
};

export const recentOrders: RecentOrder[] = [
  {
    orderNumber: "ORD-2026-0142",
    customerName: "ABC Manufacturing",
    productName: "1 Gbps Dedicated Fibre",
    orderType: "ENTERPRISE",
    status: "INSTALLATION",
    createdLabel: "14 Oct",
    ownerName: "Sarah M.",
  },
  {
    orderNumber: "ORD-2026-0141",
    customerName: "Horizon Retail Group",
    productName: "500 Mbps Business Fibre",
    orderType: "ENTERPRISE",
    status: "PLANNING",
    createdLabel: "14 Oct",
    ownerName: "Nomsa P.",
  },
  {
    orderNumber: "ORD-2026-0140",
    customerName: "XYZ Telecom",
    productName: "10 Gbps Wholesale Link",
    orderType: "WHOLESALE",
    status: "FEASIBILITY",
    createdLabel: "13 Oct",
    ownerName: "Michael R.",
  },
  {
    orderNumber: "ORD-2026-0139",
    customerName: "ConnectPro Resellers",
    productName: "200 Mbps Business Fibre",
    orderType: "RESELLER",
    status: "VALIDATION",
    createdLabel: "13 Oct",
    ownerName: "David K.",
  },
  {
    orderNumber: "ORD-2026-0138",
    customerName: "Department of Education",
    productName: "1 Gbps Dedicated Fibre",
    orderType: "GOVERNMENT",
    status: "TESTING",
    createdLabel: "12 Oct",
    ownerName: "Sarah M.",
  },
  {
    orderNumber: "ORD-2026-0137",
    customerName: "Department of Education",
    productName: "500 Mbps Business Fibre",
    orderType: "GOVERNMENT",
    status: "FEASIBILITY",
    createdLabel: "11 Oct",
    ownerName: "David K.",
  },
  {
    orderNumber: "ORD-2026-0136",
    customerName: "ABC Manufacturing",
    productName: "200 Mbps Business Fibre",
    orderType: "ENTERPRISE",
    status: "BILLING",
    createdLabel: "10 Oct",
    ownerName: "Nomsa P.",
  },
  {
    orderNumber: "ORD-2026-0135",
    customerName: "Horizon Retail Group",
    productName: "1 Gbps Dedicated Fibre",
    orderType: "ENTERPRISE",
    status: "ACTIVATION",
    createdLabel: "9 Oct",
    ownerName: "Michael R.",
  },
];

export type UpcomingInstallation = {
  id: string;
  customerName: string;
  siteName: string;
  serviceName: string;
  engineerName: string;
  dateLabel: string;
  status: InstallationStatus;
};

export const upcomingInstallations: UpcomingInstallation[] = [
  {
    id: "inst-0142",
    customerName: "ABC Manufacturing",
    siteName: "Johannesburg HQ",
    serviceName: "1 Gbps Dedicated Fibre",
    engineerName: "Thabo M.",
    dateLabel: "15 Oct",
    status: "SCHEDULED",
  },
  {
    id: "inst-0141",
    customerName: "Horizon Retail Group",
    siteName: "Sandton Branch",
    serviceName: "500 Mbps Business Fibre",
    engineerName: "Lerato N.",
    dateLabel: "16 Oct",
    status: "CONFIRMED",
  },
  {
    id: "inst-0138",
    customerName: "Department of Education",
    siteName: "Pretoria Campus",
    serviceName: "1 Gbps Dedicated Fibre",
    engineerName: "Sipho D.",
    dateLabel: "17 Oct",
    status: "SCHEDULED",
  },
  {
    id: "inst-0140",
    customerName: "XYZ Telecom",
    siteName: "Midrand PoP",
    serviceName: "10 Gbps Wholesale Link",
    engineerName: "Thabo M.",
    dateLabel: "20 Oct",
    status: "CONFIRMED",
  },
];

export type ActivityItem = {
  id: string;
  action: ActivityAction;
  summary: string;
  occurredLabel: string;
};

export const activityFeed: ActivityItem[] = [
  {
    id: "act-1",
    action: "STATUS_CHANGED",
    summary: "Sarah M. moved ORD-2026-0142 to Installation",
    occurredLabel: "10 minutes ago",
  },
  {
    id: "act-2",
    action: "MESSAGE_SENT",
    summary: "Customer ABC Manufacturing sent a message on ORD-2026-0142",
    occurredLabel: "32 minutes ago",
  },
  {
    id: "act-3",
    action: "FEASIBILITY_APPROVED",
    summary: "Feasibility approved for ORD-2026-0138",
    occurredLabel: "1 hour ago",
  },
  {
    id: "act-4",
    action: "INSTALLATION_SCHEDULED",
    summary: "Installation scheduled for Horizon Retail Group",
    occurredLabel: "2 hours ago",
  },
  {
    id: "act-5",
    action: "INVOICE_ISSUED",
    summary: "Invoice INV-2026-0087 issued",
    occurredLabel: "3 hours ago",
  },
];

export const ACTIVITY_ICON: Record<ActivityAction, LucideIcon> = {
  STATUS_CHANGED: ArrowRight,
  MESSAGE_SENT: MessageSquare,
  FEASIBILITY_APPROVED: CircleCheck,
  INSTALLATION_SCHEDULED: CalendarClock,
  INVOICE_ISSUED: Receipt,
};
