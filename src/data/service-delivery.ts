/**
 * Static service-delivery book.
 * Records point at existing orders and customers and will be replaced by queries later.
 * KPI and pipeline figures are portfolio snapshots, not counts of the working queue.
 */

import { DEMO_ORGANISATION_ID, demoOrders } from "@/data/orders";

export { DEMO_ORGANISATION_ID };

export const DELIVERY_TODAY = "2026-10-14";

export const DELIVERY_STAGES = [
  "VALIDATION",
  "FEASIBILITY",
  "PLANNING",
  "BUILD",
  "INSTALLATION",
  "TESTING",
  "ACTIVATION",
] as const;

export const TASK_STATUSES = ["OPEN", "IN_PROGRESS", "BLOCKED", "READY", "DONE"] as const;
export const TASK_PRIORITIES = ["HIGH", "MEDIUM", "LOW"] as const;
export const FEASIBILITY_STATUSES = ["PENDING", "IN_REVIEW", "APPROVED", "REJECTED", "BLOCKED"] as const;
export const BLOCKER_STATUSES = ["OPEN", "RESOLVED"] as const;
export const ACTIVITY_CATEGORIES = [
  "FEASIBILITY",
  "PLANNING",
  "INSTALLATION",
  "TESTING",
  "ACTIVATION",
  "EXCEPTION",
] as const;

export type DeliveryStage = (typeof DELIVERY_STAGES)[number];
export type TaskStatus = (typeof TASK_STATUSES)[number];
export type TaskPriority = (typeof TASK_PRIORITIES)[number];
export type FeasibilityStatus = (typeof FEASIBILITY_STATUSES)[number];
export type BlockerStatus = (typeof BLOCKER_STATUSES)[number];
export type ActivityCategory = (typeof ACTIVITY_CATEGORIES)[number];

export const DELIVERY_STAGE_LABEL: Record<DeliveryStage, string> = {
  VALIDATION: "Validation",
  FEASIBILITY: "Feasibility",
  PLANNING: "Planning",
  BUILD: "Build",
  INSTALLATION: "Installation",
  TESTING: "Testing",
  ACTIVATION: "Activation",
};

export const TASK_STATUS_LABEL: Record<TaskStatus, string> = {
  OPEN: "Open",
  IN_PROGRESS: "In Progress",
  BLOCKED: "Blocked",
  READY: "Ready",
  DONE: "Done",
};

export const TASK_PRIORITY_LABEL: Record<TaskPriority, string> = {
  HIGH: "High",
  MEDIUM: "Medium",
  LOW: "Low",
};

export const FEASIBILITY_STATUS_LABEL: Record<FeasibilityStatus, string> = {
  PENDING: "Pending",
  IN_REVIEW: "In Review",
  APPROVED: "Approved",
  REJECTED: "Rejected",
  BLOCKED: "Blocked",
};

export const BLOCKER_STATUS_LABEL: Record<BlockerStatus, string> = {
  OPEN: "Open",
  RESOLVED: "Resolved",
};

export const ACTIVITY_CATEGORY_LABEL: Record<ActivityCategory, string> = {
  FEASIBILITY: "Feasibility",
  PLANNING: "Planning",
  INSTALLATION: "Installation",
  TESTING: "Testing",
  ACTIVATION: "Activation",
  EXCEPTION: "Exception",
};

export const DELIVERY_OWNERS = [
  { id: "owner-sarah", name: "Sarah M." },
  { id: "owner-david", name: "David K." },
  { id: "owner-michael", name: "Michael R." },
  { id: "owner-nomsa", name: "Nomsa P." },
  { id: "team-installation", name: "Installation Team" },
  { id: "team-planning", name: "Network Planning" },
  { id: "team-activation", name: "Activation Team" },
] as const;

export type DeliveryKpi = {
  id: string;
  label: string;
  value: string;
  supporting: string;
  tone: "neutral" | "attention" | "positive";
};

export const deliveryKpis: DeliveryKpi[] = [
  {
    id: "delivery",
    label: "Orders in Delivery",
    value: "11",
    supporting: "Feasibility through Testing",
    tone: "neutral",
  },
  {
    id: "feasibility",
    label: "Feasibility Pending",
    value: "5",
    supporting: "2 require customer information",
    tone: "attention",
  },
  {
    id: "installs",
    label: "Installations This Week",
    value: "8",
    supporting: "3 high priority",
    tone: "neutral",
  },
  {
    id: "risk",
    label: "At Risk",
    value: "3",
    supporting: "Requires intervention",
    tone: "attention",
  },
];

export type DeliveryPipelineStage = {
  stage: DeliveryStage;
  orders: number;
  attention: number;
};

export const deliveryPipeline: DeliveryPipelineStage[] = [
  { stage: "VALIDATION", orders: 4, attention: 0 },
  { stage: "FEASIBILITY", orders: 3, attention: 1 },
  { stage: "PLANNING", orders: 2, attention: 1 },
  { stage: "BUILD", orders: 2, attention: 1 },
  { stage: "INSTALLATION", orders: 2, attention: 2 },
  { stage: "TESTING", orders: 2, attention: 0 },
  { stage: "ACTIVATION", orders: 2, attention: 1 },
];

export type DeliveryTask = {
  id: string;
  organisationId: string;
  orderId: string;
  orderNumber: string;
  customerId: string;
  customerName: string;
  stage: DeliveryStage;
  title: string;
  description: string;
  issue: string;
  needsAttention: boolean;
  atRisk: boolean;
  assignedUserId: string;
  ownerName: string;
  priority: TaskPriority;
  status: TaskStatus;
  dueDate: string;
  dueLabel: string;
  dependency: string;
  createdAt: string;
  createdLabel: string;
  updatedAt: string;
  updatedLabel: string;
};

export type FeasibilityItem = {
  id: string;
  organisationId: string;
  orderId: string;
  orderNumber: string;
  customerId: string;
  customerName: string;
  sites: string;
  technology: string;
  coverage: string;
  capacity: string;
  result: string;
  assignedUserId: string;
  ownerName: string;
  dueDate: string;
  dueLabel: string;
  status: FeasibilityStatus;
};

export type PlanningItem = {
  id: string;
  organisationId: string;
  orderId: string;
  orderNumber: string;
  customerId: string;
  customerName: string;
  service: string;
  designStatus: string;
  networkResource: string;
  handover: string;
  engineerName: string;
  assignedUserId: string;
  dueDate: string;
  dueLabel: string;
  status: string;
};

export type InstallationReadinessItem = {
  id: string;
  organisationId: string;
  orderId: string;
  orderNumber: string;
  customerId: string;
  customerName: string;
  site: string;
  scheduledDate: string;
  scheduledLabel: string;
  siteAccess: string;
  cpe: string;
  materials: string;
  technician: string;
  readiness: string;
  risk: string;
};

export type ActivationReadinessItem = {
  id: string;
  organisationId: string;
  orderId: string;
  orderNumber: string;
  customerId: string;
  customerName: string;
  serviceId: string;
  serviceNumber: string;
  service: string;
  testing: string;
  customerAcceptance: string;
  billingSetup: string;
  activation: string;
};

export type DeliveryBlocker = {
  id: string;
  organisationId: string;
  orderId: string;
  orderNumber: string;
  customerId: string;
  customerName: string;
  blocker: string;
  assignedUserId: string;
  ownerName: string;
  identifiedLabel: string;
  impact: string;
  targetResolution: string;
  targetLabel: string;
  status: BlockerStatus;
  updatedAt: string;
};

export type DeliveryActivity = {
  id: string;
  timeLabel: string;
  summary: string;
  category: ActivityCategory;
  occurredLabel: string;
  orderId: string | null;
  orderNumber: string | null;
};

type OrderRef = {
  orderId: string;
  orderNumber: string;
  customerId: string;
  customerName: string;
};

function orderRef(orderNumber: string): OrderRef {
  const order = demoOrders.find((item) => item.orderNumber === orderNumber);

  if (!order) {
    throw new Error(`Unknown order ${orderNumber}`);
  }

  return {
    orderId: order.id,
    orderNumber: order.orderNumber,
    customerId: order.customer.id,
    customerName: order.customer.name,
  };
}

function task(
  record: Omit<DeliveryTask, "organisationId" | "orderId" | "customerId" | "customerName"> & {
    orderNumber: string;
  },
): DeliveryTask {
  return { ...record, ...orderRef(record.orderNumber), organisationId: DEMO_ORGANISATION_ID };
}

export const deliveryTasks: DeliveryTask[] = [
  task({
    id: "tsk-2026-0201",
    orderNumber: "ORD-2026-0142",
    stage: "INSTALLATION",
    title: "Confirm site access",
    description: "The head-office riser access has not been confirmed for the 22 Oct installation window.",
    issue: "Site access not confirmed",
    needsAttention: true,
    atRisk: true,
    assignedUserId: "team-installation",
    ownerName: "Installation Team",
    priority: "HIGH",
    status: "BLOCKED",
    dueDate: "2026-10-14",
    dueLabel: "Today",
    dependency: "Customer confirmation",
    createdAt: "2026-10-10T08:00:00",
    createdLabel: "10 Oct 2026",
    updatedAt: "2026-10-14T11:03:00",
    updatedLabel: "Today",
  }),
  task({
    id: "tsk-2026-0202",
    orderNumber: "ORD-2026-0137",
    stage: "FEASIBILITY",
    title: "Validate additional sites",
    description: "Thirteen district sites still need a service address and site contact before the survey can close.",
    issue: "Additional site information required",
    needsAttention: true,
    atRisk: false,
    assignedUserId: "owner-david",
    ownerName: "David K.",
    priority: "HIGH",
    status: "IN_PROGRESS",
    dueDate: "2026-10-15",
    dueLabel: "Tomorrow",
    dependency: "Customer information",
    createdAt: "2026-10-06T09:00:00",
    createdLabel: "06 Oct 2026",
    updatedAt: "2026-10-14T08:20:00",
    updatedLabel: "Today",
  }),
  task({
    id: "tsk-2026-0203",
    orderNumber: "ORD-2026-0129",
    stage: "PLANNING",
    title: "Capacity review",
    description: "Wholesale 10 Gbps capacity on the Sandton interconnect is waiting for core approval.",
    issue: "Wholesale capacity review pending",
    needsAttention: true,
    atRisk: false,
    assignedUserId: "owner-michael",
    ownerName: "Michael R.",
    priority: "MEDIUM",
    status: "IN_PROGRESS",
    dueDate: "2026-10-16",
    dueLabel: "16 Oct 2026",
    dependency: "Network capacity",
    createdAt: "2026-10-04T10:00:00",
    createdLabel: "04 Oct 2026",
    updatedAt: "2026-10-13T16:10:00",
    updatedLabel: "Yesterday",
  }),
  task({
    id: "tsk-2026-0204",
    orderNumber: "ORD-2026-0134",
    stage: "TESTING",
    title: "Validate fibre test results",
    description: "Eighteen of twenty reseller sites have results. Two sites still need a retest.",
    issue: "Retest outstanding on two reseller sites",
    needsAttention: false,
    atRisk: false,
    assignedUserId: "owner-sarah",
    ownerName: "Sarah M.",
    priority: "MEDIUM",
    status: "IN_PROGRESS",
    dueDate: "2026-10-16",
    dueLabel: "16 Oct 2026",
    dependency: "Test completion",
    createdAt: "2026-10-12T11:00:00",
    createdLabel: "12 Oct 2026",
    updatedAt: "2026-10-14T07:40:00",
    updatedLabel: "Today",
  }),
  task({
    id: "tsk-2026-0205",
    orderNumber: "ORD-2026-0118",
    stage: "ACTIVATION",
    title: "Complete service activation",
    description: "Testing has passed. Customer acceptance is the remaining step before the activation window.",
    issue: "Customer acceptance pending",
    needsAttention: true,
    atRisk: false,
    assignedUserId: "owner-michael",
    ownerName: "Michael R.",
    priority: "LOW",
    status: "READY",
    dueDate: "2026-10-15",
    dueLabel: "15 Oct 2026",
    dependency: "Billing setup",
    createdAt: "2026-10-11T14:00:00",
    createdLabel: "11 Oct 2026",
    updatedAt: "2026-10-13T11:20:00",
    updatedLabel: "Yesterday",
  }),
  task({
    id: "tsk-2026-0206",
    orderNumber: "ORD-2026-0144",
    stage: "VALIDATION",
    title: "Confirm clinic site contacts",
    description: "Billing and site contacts for the Polokwane clinic still need a customer confirmation.",
    issue: "Site contacts unconfirmed",
    needsAttention: false,
    atRisk: false,
    assignedUserId: "owner-nomsa",
    ownerName: "Nomsa P.",
    priority: "HIGH",
    status: "OPEN",
    dueDate: "2026-10-17",
    dueLabel: "17 Oct 2026",
    dependency: "Customer details",
    createdAt: "2026-10-12T09:30:00",
    createdLabel: "12 Oct 2026",
    updatedAt: "2026-10-12T09:30:00",
    updatedLabel: "12 Oct 2026",
  }),
  task({
    id: "tsk-2026-0207",
    orderNumber: "ORD-2026-0148",
    stage: "FEASIBILITY",
    title: "Book shaft site survey",
    description: "The Witbank shaft site needs a physical survey before the fibre design can start.",
    issue: "Survey not booked",
    needsAttention: false,
    atRisk: false,
    assignedUserId: "owner-sarah",
    ownerName: "Sarah M.",
    priority: "MEDIUM",
    status: "OPEN",
    dueDate: "2026-10-21",
    dueLabel: "21 Oct 2026",
    dependency: "Site access window",
    createdAt: "2026-10-13T15:00:00",
    createdLabel: "13 Oct 2026",
    updatedAt: "2026-10-13T15:00:00",
    updatedLabel: "Yesterday",
  }),
  task({
    id: "tsk-2026-0208",
    orderNumber: "ORD-2026-0131",
    stage: "BUILD",
    title: "Reserve core port",
    description: "Campus backhaul is waiting on a core port at POP PTA-04.",
    issue: "Core port not reserved",
    needsAttention: true,
    atRisk: true,
    assignedUserId: "owner-michael",
    ownerName: "Michael R.",
    priority: "HIGH",
    status: "BLOCKED",
    dueDate: "2026-10-18",
    dueLabel: "18 Oct 2026",
    dependency: "Core capacity",
    createdAt: "2026-10-08T10:00:00",
    createdLabel: "08 Oct 2026",
    updatedAt: "2026-10-14T06:40:00",
    updatedLabel: "Today",
  }),
  task({
    id: "tsk-2026-0209",
    orderNumber: "ORD-2026-0104",
    stage: "INSTALLATION",
    title: "Confirm landlord access",
    description: "The depot riser approval is still outstanding for the 24 Oct crew.",
    issue: "Landlord access unconfirmed",
    needsAttention: true,
    atRisk: true,
    assignedUserId: "team-installation",
    ownerName: "Installation Team",
    priority: "HIGH",
    status: "BLOCKED",
    dueDate: "2026-10-16",
    dueLabel: "16 Oct 2026",
    dependency: "Landlord approval",
    createdAt: "2026-10-09T08:30:00",
    createdLabel: "09 Oct 2026",
    updatedAt: "2026-10-14T10:05:00",
    updatedLabel: "Today",
  }),
  task({
    id: "tsk-2026-0210",
    orderNumber: "ORD-2026-0126",
    stage: "BUILD",
    title: "Chase municipal wayleave",
    description: "The metro dark-fibre build cannot continue until the wayleave is issued.",
    issue: "Wayleave outstanding",
    needsAttention: true,
    atRisk: false,
    assignedUserId: "owner-michael",
    ownerName: "Michael R.",
    priority: "HIGH",
    status: "BLOCKED",
    dueDate: "2026-10-13",
    dueLabel: "13 Oct 2026",
    dependency: "Municipal wayleave",
    createdAt: "2026-10-01T09:00:00",
    createdLabel: "01 Oct 2026",
    updatedAt: "2026-10-13T13:40:00",
    updatedLabel: "Yesterday",
  }),
  task({
    id: "tsk-2026-0211",
    orderNumber: "ORD-2026-0136",
    stage: "PLANNING",
    title: "Design microwave path",
    description: "Line of sight for the Thohoyandou spur still needs an engineer sign-off.",
    issue: "Path design open",
    needsAttention: false,
    atRisk: false,
    assignedUserId: "owner-david",
    ownerName: "David K.",
    priority: "MEDIUM",
    status: "IN_PROGRESS",
    dueDate: "2026-10-28",
    dueLabel: "28 Oct 2026",
    dependency: "Line of sight",
    createdAt: "2026-10-08T12:00:00",
    createdLabel: "08 Oct 2026",
    updatedAt: "2026-10-08T12:15:00",
    updatedLabel: "08 Oct 2026",
  }),
  task({
    id: "tsk-2026-0212",
    orderNumber: "ORD-2026-0140",
    stage: "VALIDATION",
    title: "Validate redundant access scope",
    description: "Confirm the Plant 2 diverse path is separate from the head-office order.",
    issue: "Scope check open",
    needsAttention: false,
    atRisk: false,
    assignedUserId: "owner-sarah",
    ownerName: "Sarah M.",
    priority: "MEDIUM",
    status: "OPEN",
    dueDate: "2026-10-22",
    dueLabel: "22 Oct 2026",
    dependency: "Design pack",
    createdAt: "2026-10-11T09:00:00",
    createdLabel: "11 Oct 2026",
    updatedAt: "2026-10-11T09:30:00",
    updatedLabel: "11 Oct 2026",
  }),
  task({
    id: "tsk-2026-0213",
    orderNumber: "ORD-2026-0122",
    stage: "ACTIVATION",
    title: "Confirm activation handover",
    description: "The cold-store circuit is live. This handover task is complete.",
    issue: "Handover complete",
    needsAttention: false,
    atRisk: false,
    assignedUserId: "team-activation",
    ownerName: "Activation Team",
    priority: "LOW",
    status: "DONE",
    dueDate: "2026-10-08",
    dueLabel: "8 Oct 2026",
    dependency: "Service test",
    createdAt: "2026-10-06T08:00:00",
    createdLabel: "06 Oct 2026",
    updatedAt: "2026-10-08T15:00:00",
    updatedLabel: "08 Oct 2026",
  }),
  task({
    id: "tsk-2026-0214",
    orderNumber: "ORD-2026-0134",
    stage: "TESTING",
    title: "Schedule remaining retests",
    description: "Book the two outstanding reseller retests before the 17 Oct activation target.",
    issue: "Retest slots open",
    needsAttention: false,
    atRisk: false,
    assignedUserId: "owner-sarah",
    ownerName: "Sarah M.",
    priority: "MEDIUM",
    status: "READY",
    dueDate: "2026-10-15",
    dueLabel: "Tomorrow",
    dependency: "Technician roster",
    createdAt: "2026-10-14T07:45:00",
    createdLabel: "Today",
    updatedAt: "2026-10-14T07:50:00",
    updatedLabel: "Today",
  }),
];

export const feasibilityItems: FeasibilityItem[] = [
  {
    id: "fea-2026-0142",
    ...orderRef("ORD-2026-0142"),
    organisationId: DEMO_ORGANISATION_ID,
    sites: "Johannesburg",
    technology: "Fibre",
    coverage: "Available",
    capacity: "1 Gbps",
    result: "Approved",
    assignedUserId: "owner-sarah",
    ownerName: "Sarah M.",
    dueDate: "2026-10-06",
    dueLabel: "06 Oct 2026",
    status: "APPROVED",
  },
  {
    id: "fea-2026-0137",
    ...orderRef("ORD-2026-0137"),
    organisationId: DEMO_ORGANISATION_ID,
    sites: "25 sites",
    technology: "Fibre",
    coverage: "12 confirmed / 13 pending",
    capacity: "Multi-site",
    result: "Pending Information",
    assignedUserId: "owner-david",
    ownerName: "David K.",
    dueDate: "2026-10-15",
    dueLabel: "Tomorrow",
    status: "PENDING",
  },
  {
    id: "fea-2026-0129",
    ...orderRef("ORD-2026-0129"),
    organisationId: DEMO_ORGANISATION_ID,
    sites: "Wholesale",
    technology: "Fibre",
    coverage: "Metro route",
    capacity: "10 Gbps",
    result: "Capacity Review",
    assignedUserId: "owner-michael",
    ownerName: "Michael R.",
    dueDate: "2026-10-16",
    dueLabel: "16 Oct 2026",
    status: "IN_REVIEW",
  },
  {
    id: "fea-2026-0148",
    ...orderRef("ORD-2026-0148"),
    organisationId: DEMO_ORGANISATION_ID,
    sites: "Witbank shaft",
    technology: "Fibre",
    coverage: "Survey required",
    capacity: "100 Mbps",
    result: "Survey not booked",
    assignedUserId: "owner-sarah",
    ownerName: "Sarah M.",
    dueDate: "2026-10-21",
    dueLabel: "21 Oct 2026",
    status: "PENDING",
  },
  {
    id: "fea-2026-0144",
    ...orderRef("ORD-2026-0144"),
    organisationId: DEMO_ORGANISATION_ID,
    sites: "Polokwane clinic",
    technology: "Fibre",
    coverage: "Available",
    capacity: "200 Mbps",
    result: "In review",
    assignedUserId: "owner-nomsa",
    ownerName: "Nomsa P.",
    dueDate: "2026-10-17",
    dueLabel: "17 Oct 2026",
    status: "IN_REVIEW",
  },
  {
    id: "fea-2026-0126",
    ...orderRef("ORD-2026-0126"),
    organisationId: DEMO_ORGANISATION_ID,
    sites: "Rosebank to Sandton",
    technology: "Dark fibre",
    coverage: "Route blocked",
    capacity: "Fibre pair",
    result: "Wayleave outstanding",
    assignedUserId: "owner-michael",
    ownerName: "Michael R.",
    dueDate: "2026-10-13",
    dueLabel: "13 Oct 2026",
    status: "BLOCKED",
  },
  {
    id: "fea-2026-0116",
    ...orderRef("ORD-2026-0116"),
    organisationId: DEMO_ORGANISATION_ID,
    sites: "Sandton store",
    technology: "Wi-Fi",
    coverage: "In building",
    capacity: "Guest access",
    result: "Paused with the store refit",
    assignedUserId: "owner-michael",
    ownerName: "Michael R.",
    dueDate: "2026-10-09",
    dueLabel: "09 Oct 2026",
    status: "REJECTED",
  },
];

export const planningItems: PlanningItem[] = [
  {
    id: "pln-2026-0129",
    ...orderRef("ORD-2026-0129"),
    organisationId: DEMO_ORGANISATION_ID,
    service: "10 Gbps Wholesale Link",
    designStatus: "Design in Progress",
    networkResource: "Core POP JHB-01",
    handover: "Ethernet",
    engineerName: "Michael R.",
    assignedUserId: "owner-michael",
    dueDate: "2026-10-16",
    dueLabel: "16 Oct 2026",
    status: "In Progress",
  },
  {
    id: "pln-2026-0142",
    ...orderRef("ORD-2026-0142"),
    organisationId: DEMO_ORGANISATION_ID,
    service: "1 Gbps Dedicated Fibre",
    designStatus: "Design Complete",
    networkResource: "POP JHB-03",
    handover: "Ethernet",
    engineerName: "Network Planning",
    assignedUserId: "team-planning",
    dueDate: "2026-10-08",
    dueLabel: "08 Oct 2026",
    status: "Completed",
  },
  {
    id: "pln-2026-0137",
    ...orderRef("ORD-2026-0137"),
    organisationId: DEMO_ORGANISATION_ID,
    service: "Multi-site Business Fibre",
    designStatus: "Waiting on surveys",
    networkResource: "POP PTA-02",
    handover: "Fibre",
    engineerName: "David K.",
    assignedUserId: "owner-david",
    dueDate: "2026-11-04",
    dueLabel: "4 Nov 2026",
    status: "In Progress",
  },
  {
    id: "pln-2026-0131",
    ...orderRef("ORD-2026-0131"),
    organisationId: DEMO_ORGANISATION_ID,
    service: "Campus Backhaul",
    designStatus: "Design in Progress",
    networkResource: "POP PTA-04",
    handover: "Ethernet",
    engineerName: "Michael R.",
    assignedUserId: "owner-michael",
    dueDate: "2026-10-18",
    dueLabel: "18 Oct 2026",
    status: "Blocked",
  },
  {
    id: "pln-2026-0134",
    ...orderRef("ORD-2026-0134"),
    organisationId: DEMO_ORGANISATION_ID,
    service: "500 Mbps Business Fibre x 20",
    designStatus: "Design Complete",
    networkResource: "Aggregation JHB",
    handover: "Ethernet",
    engineerName: "Sarah M.",
    assignedUserId: "owner-sarah",
    dueDate: "2026-10-10",
    dueLabel: "10 Oct 2026",
    status: "Completed",
  },
  {
    id: "pln-2026-0104",
    ...orderRef("ORD-2026-0104"),
    organisationId: DEMO_ORGANISATION_ID,
    service: "Depot Fibre",
    designStatus: "Design Complete",
    networkResource: "POP JHB-05",
    handover: "Ethernet",
    engineerName: "Network Planning",
    assignedUserId: "team-planning",
    dueDate: "2026-10-07",
    dueLabel: "07 Oct 2026",
    status: "Completed",
  },
];

export const installationReadiness: InstallationReadinessItem[] = [
  {
    id: "ins-2026-0142",
    ...orderRef("ORD-2026-0142"),
    organisationId: DEMO_ORGANISATION_ID,
    site: "ABC Manufacturing HQ",
    scheduledDate: "2026-10-22",
    scheduledLabel: "22 Oct 2026",
    siteAccess: "Pending",
    cpe: "Ready",
    materials: "Ready",
    technician: "Assigned",
    readiness: "At Risk",
    risk: "Site access not confirmed",
  },
  {
    id: "ins-2026-0104",
    ...orderRef("ORD-2026-0104"),
    organisationId: DEMO_ORGANISATION_ID,
    site: "BlueWave Depot",
    scheduledDate: "2026-10-24",
    scheduledLabel: "24 Oct 2026",
    siteAccess: "Pending",
    cpe: "Ready",
    materials: "Ready",
    technician: "Assigned",
    readiness: "At Risk",
    risk: "Landlord approval outstanding",
  },
  {
    id: "ins-2026-0134",
    ...orderRef("ORD-2026-0134"),
    organisationId: DEMO_ORGANISATION_ID,
    site: "ConnectPro Johannesburg cluster",
    scheduledDate: "2026-10-17",
    scheduledLabel: "17 Oct 2026",
    siteAccess: "Confirmed",
    cpe: "Ready",
    materials: "Ready",
    technician: "Assigned",
    readiness: "Ready",
    risk: "Two sites still need a retest",
  },
  {
    id: "ins-2026-0142-b",
    ...orderRef("ORD-2026-0142"),
    organisationId: DEMO_ORGANISATION_ID,
    site: "ABC Manufacturing Plant 2",
    scheduledDate: "2026-11-26",
    scheduledLabel: "26 Nov 2026",
    siteAccess: "Confirmed",
    cpe: "Ordered",
    materials: "Pending",
    technician: "Unassigned",
    readiness: "Pending",
    risk: "Materials not yet picked",
  },
];

export const activationReadiness: ActivationReadinessItem[] = [
  {
    id: "act-2026-0118",
    ...orderRef("ORD-2026-0118"),
    organisationId: DEMO_ORGANISATION_ID,
    serviceId: "srv-2026-00490",
    serviceNumber: "SRV-2026-00490",
    service: "200 Mbps Business Fibre",
    testing: "Passed",
    customerAcceptance: "Pending",
    billingSetup: "Ready",
    activation: "Ready",
  },
  {
    id: "act-2026-0134",
    ...orderRef("ORD-2026-0134"),
    organisationId: DEMO_ORGANISATION_ID,
    serviceId: "srv-2026-00476",
    serviceNumber: "SRV-2026-00476",
    service: "500 Mbps Business Fibre x 20",
    testing: "In Progress",
    customerAcceptance: "Pending",
    billingSetup: "Pending",
    activation: "Pending",
  },
  {
    id: "act-2026-0122",
    ...orderRef("ORD-2026-0122"),
    organisationId: DEMO_ORGANISATION_ID,
    serviceId: "srv-2026-00455",
    serviceNumber: "SRV-2026-00455",
    service: "100 Mbps Business Fibre",
    testing: "Passed",
    customerAcceptance: "Accepted",
    billingSetup: "In Progress",
    activation: "Ready",
  },
];

export const deliveryBlockers: DeliveryBlocker[] = [
  {
    id: "blk-2026-0142",
    ...orderRef("ORD-2026-0142"),
    organisationId: DEMO_ORGANISATION_ID,
    blocker: "Site access unavailable",
    assignedUserId: "team-installation",
    ownerName: "Installation Team",
    identifiedLabel: "Today",
    impact: "22 Oct installation cannot start",
    targetResolution: "2026-10-15",
    targetLabel: "Tomorrow",
    status: "OPEN",
    updatedAt: "2026-10-14T11:03:00",
  },
  {
    id: "blk-2026-0137",
    ...orderRef("ORD-2026-0137"),
    organisationId: DEMO_ORGANISATION_ID,
    blocker: "Customer information incomplete",
    assignedUserId: "owner-david",
    ownerName: "David K.",
    identifiedLabel: "Today",
    impact: "13 sites cannot be surveyed",
    targetResolution: "2026-10-15",
    targetLabel: "Tomorrow",
    status: "OPEN",
    updatedAt: "2026-10-14T08:20:00",
  },
  {
    id: "blk-2026-0129",
    ...orderRef("ORD-2026-0129"),
    organisationId: DEMO_ORGANISATION_ID,
    blocker: "Network capacity approval pending",
    assignedUserId: "owner-michael",
    ownerName: "Michael R.",
    identifiedLabel: "Yesterday",
    impact: "Interconnect window may move",
    targetResolution: "2026-10-16",
    targetLabel: "16 Oct 2026",
    status: "OPEN",
    updatedAt: "2026-10-13T16:10:00",
  },
  {
    id: "blk-2026-0131",
    ...orderRef("ORD-2026-0131"),
    organisationId: DEMO_ORGANISATION_ID,
    blocker: "Equipment delivery delayed",
    assignedUserId: "team-planning",
    ownerName: "Network Planning",
    identifiedLabel: "12 Oct 2026",
    impact: "Core port reservation is late",
    targetResolution: "2026-10-18",
    targetLabel: "18 Oct 2026",
    status: "OPEN",
    updatedAt: "2026-10-14T06:40:00",
  },
  {
    id: "blk-2026-0118",
    ...orderRef("ORD-2026-0118"),
    organisationId: DEMO_ORGANISATION_ID,
    blocker: "Customer acceptance pending",
    assignedUserId: "owner-michael",
    ownerName: "Michael R.",
    identifiedLabel: "Yesterday",
    impact: "Activation window is tomorrow",
    targetResolution: "2026-10-15",
    targetLabel: "15 Oct 2026",
    status: "OPEN",
    updatedAt: "2026-10-13T11:20:00",
  },
];

export const deliveryActivity: DeliveryActivity[] = [
  {
    id: "dlv-act-1",
    timeLabel: "09:42",
    summary: "Feasibility approved for ORD-2026-0142",
    category: "FEASIBILITY",
    occurredLabel: "Today",
    orderId: orderRef("ORD-2026-0142").orderId,
    orderNumber: "ORD-2026-0142",
  },
  {
    id: "dlv-act-2",
    timeLabel: "10:15",
    summary: "Installation scheduled for ABC Manufacturing HQ",
    category: "INSTALLATION",
    occurredLabel: "Today",
    orderId: orderRef("ORD-2026-0142").orderId,
    orderNumber: "ORD-2026-0142",
  },
  {
    id: "dlv-act-3",
    timeLabel: "11:03",
    summary: "Site access issue flagged",
    category: "EXCEPTION",
    occurredLabel: "Today",
    orderId: orderRef("ORD-2026-0142").orderId,
    orderNumber: "ORD-2026-0142",
  },
  {
    id: "dlv-act-4",
    timeLabel: "11:30",
    summary: "Network design completed for XYZ Telecom",
    category: "PLANNING",
    occurredLabel: "Today",
    orderId: orderRef("ORD-2026-0129").orderId,
    orderNumber: "ORD-2026-0129",
  },
  {
    id: "dlv-act-5",
    timeLabel: "08:10",
    summary: "Fibre retest still open on two ConnectPro sites",
    category: "TESTING",
    occurredLabel: "Today",
    orderId: orderRef("ORD-2026-0134").orderId,
    orderNumber: "ORD-2026-0134",
  },
  {
    id: "dlv-act-6",
    timeLabel: "16:40",
    summary: "Horizon activation pack marked ready",
    category: "ACTIVATION",
    occurredLabel: "Yesterday",
    orderId: orderRef("ORD-2026-0118").orderId,
    orderNumber: "ORD-2026-0118",
  },
];

export type DeliveryBook = {
  tasks: DeliveryTask[];
  feasibility: FeasibilityItem[];
  planning: PlanningItem[];
  installations: InstallationReadinessItem[];
  activations: ActivationReadinessItem[];
  blockers: DeliveryBlocker[];
  activity: DeliveryActivity[];
};

export const deliveryBook: DeliveryBook = {
  tasks: deliveryTasks,
  feasibility: feasibilityItems,
  planning: planningItems,
  installations: installationReadiness,
  activations: activationReadiness,
  blockers: deliveryBlockers,
  activity: deliveryActivity,
};

export function getDemoTask(id: string) {
  return deliveryTasks.find((item) => item.id === id);
}

export function nextTaskNumber(tasks: DeliveryTask[]) {
  const highest = tasks.reduce((max, item) => {
    const suffix = Number(item.id.split("-").at(-1));

    return Number.isFinite(suffix) ? Math.max(max, suffix) : max;
  }, 0);

  return highest + 1;
}
