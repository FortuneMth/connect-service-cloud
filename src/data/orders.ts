/**
 * Static order book for the Orders workspace.
 * Shapes follow the future order record and will be replaced by queries later.
 * Portfolio KPI and pipeline figures are snapshots, not counts of the working list.
 */

import { DEMO_ORGANISATION_ID, demoCustomers, formatRand } from "@/data/customers";

export { DEMO_ORGANISATION_ID, formatRand };

export const ORDER_TODAY = "2026-10-14";

export const ORDER_STAGES = [
  "NEW",
  "VALIDATION",
  "FEASIBILITY",
  "PLANNING",
  "BUILD",
  "INSTALLATION",
  "TESTING",
  "ACTIVATION",
  "BILLING",
  "COMPLETED",
] as const;

export const ORDER_EXCEPTIONS = ["ON_HOLD", "BLOCKED", "CANCELLED"] as const;

export const ORDER_STATUSES = [...ORDER_STAGES, ...ORDER_EXCEPTIONS] as const;

export const ORDER_TYPES = ["ENTERPRISE", "WHOLESALE", "RESELLER", "GOVERNMENT"] as const;
export const ORDER_PRIORITIES = ["HIGH", "MEDIUM", "LOW"] as const;

export type OrderStage = (typeof ORDER_STAGES)[number];
export type OrderStatus = (typeof ORDER_STATUSES)[number];
export type OrderType = (typeof ORDER_TYPES)[number];
export type OrderPriority = (typeof ORDER_PRIORITIES)[number];

export const ORDER_STATUS_LABEL: Record<OrderStatus, string> = {
  NEW: "New",
  VALIDATION: "Validation",
  FEASIBILITY: "Feasibility",
  PLANNING: "Planning",
  BUILD: "Build",
  INSTALLATION: "Installation",
  TESTING: "Testing",
  ACTIVATION: "Activation",
  BILLING: "Billing",
  COMPLETED: "Completed",
  ON_HOLD: "On Hold",
  BLOCKED: "Blocked",
  CANCELLED: "Cancelled",
};

export const ORDER_STAGE_DETAIL: Record<OrderStage, string> = {
  NEW: "Quote accepted",
  VALIDATION: "Order validation",
  FEASIBILITY: "Feasibility",
  PLANNING: "Planning",
  BUILD: "Build / provisioning",
  INSTALLATION: "Installation",
  TESTING: "Testing",
  ACTIVATION: "Activation",
  BILLING: "Billing",
  COMPLETED: "Completed",
};

export const ORDER_TYPE_LABEL: Record<OrderType, string> = {
  ENTERPRISE: "Enterprise",
  WHOLESALE: "Wholesale",
  RESELLER: "Reseller",
  GOVERNMENT: "Government",
};

export const ORDER_PRIORITY_LABEL: Record<OrderPriority, string> = {
  HIGH: "High",
  MEDIUM: "Medium",
  LOW: "Low",
};

export const STAGE_PROGRESS: Record<OrderStage, number> = {
  NEW: 5,
  VALIDATION: 15,
  FEASIBILITY: 25,
  PLANNING: 40,
  BUILD: 55,
  INSTALLATION: 75,
  TESTING: 85,
  ACTIVATION: 95,
  BILLING: 98,
  COMPLETED: 100,
};

export type OrderSite = {
  id: string;
  name: string;
  address: string;
  service: string;
  accessStatus: string;
  targetLabel: string;
};

export type OrderActivity = {
  id: string;
  summary: string;
  actorName: string;
  occurredLabel: string;
};

export type OrderCustomer = {
  id: string;
  customerNumber: string;
  name: string;
  typeLabel: string;
  primaryContactName: string;
  primaryContactEmail: string;
  primaryContactPhone: string;
};

export type OrderRecord = {
  id: string;
  organisationId: string;
  orderNumber: string;
  customer: OrderCustomer;
  quoteId: string | null;
  quoteNumber: string | null;
  orderType: OrderType;
  product: string;
  status: OrderStatus;
  priority: OrderPriority;
  atRisk: boolean;
  riskNote: string;
  value: number;
  progress: number;
  ownerId: string;
  ownerName: string;
  targetActivation: string;
  targetActivationLabel: string;
  createdLabel: string;
  updatedAt: string;
  lastActivityLabel: string;
  notes: string;
  heldFrom: OrderStage | null;
  blockedFrom: OrderStage | null;
  holdReason: string;
  blockReason: string;
  cancelReason: string;
  sites: OrderSite[];
  activity: OrderActivity[];
};

export type OrderKpi = {
  id: string;
  label: string;
  value: string;
  supporting: string;
  tone: "neutral" | "attention" | "positive";
};

export const orderKpis: OrderKpi[] = [
  {
    id: "active",
    label: "Active Orders",
    value: "24",
    supporting: "Across all delivery stages",
    tone: "neutral",
  },
  {
    id: "delivery",
    label: "Orders In Delivery",
    value: "11",
    supporting: "Feasibility through Installation",
    tone: "neutral",
  },
  {
    id: "risk",
    label: "At Risk",
    value: "3",
    supporting: "Require operational attention",
    tone: "attention",
  },
  {
    id: "completed",
    label: "Completed This Month",
    value: "8",
    supporting: "Successfully activated",
    tone: "positive",
  },
];

export type OrderPipelineStage = {
  status: OrderStage;
  count: number;
  value: number;
};

export const orderPipeline: OrderPipelineStage[] = [
  { status: "NEW", count: 3, value: 860000 },
  { status: "VALIDATION", count: 4, value: 1240000 },
  { status: "FEASIBILITY", count: 3, value: 4100000 },
  { status: "PLANNING", count: 3, value: 2680000 },
  { status: "BUILD", count: 2, value: 1540000 },
  { status: "INSTALLATION", count: 3, value: 2215000 },
  { status: "TESTING", count: 2, value: 1420000 },
  { status: "ACTIVATION", count: 2, value: 980000 },
  { status: "BILLING", count: 2, value: 640000 },
  { status: "COMPLETED", count: 8, value: 3120000 },
];

function customerSnapshot(id: string): OrderCustomer {
  const customer = demoCustomers.find((item) => item.id === id);

  if (!customer) {
    throw new Error(`Unknown customer ${id}`);
  }

  return {
    id: customer.id,
    customerNumber: customer.customerNumber,
    name: customer.name,
    typeLabel: ORDER_TYPE_LABEL[customer.type],
    primaryContactName: customer.primaryContact.name,
    primaryContactEmail: customer.primaryContact.email,
    primaryContactPhone: customer.primaryContact.phone,
  };
}

function order(
  record: Omit<OrderRecord, "organisationId" | "customer"> & { customerId: string },
): OrderRecord {
  const { customerId, ...rest } = record;

  return {
    ...rest,
    organisationId: DEMO_ORGANISATION_ID,
    customer: customerSnapshot(customerId),
  };
}

export const demoOrders: OrderRecord[] = [
  order({
    id: "ord-2026-0142",
    customerId: "cus-2026-0018",
    orderNumber: "ORD-2026-0142",
    quoteId: "quo-2026-0098",
    quoteNumber: "QUO-2026-0098",
    orderType: "ENTERPRISE",
    product: "1 Gbps Dedicated Fibre",
    status: "INSTALLATION",
    priority: "HIGH",
    atRisk: false,
    riskNote: "",
    value: 1415000,
    progress: 75,
    ownerId: "owner-sarah",
    ownerName: "Sarah M.",
    targetActivation: "2026-10-22",
    targetActivationLabel: "22 Oct 2026",
    createdLabel: "02 Oct 2026",
    updatedAt: "2026-10-14T09:40:00",
    lastActivityLabel: "Today",
    notes: "Diverse access and managed router are included. Plant 2 follows the head office circuit.",
    heldFrom: null,
    blockedFrom: null,
    holdReason: "",
    blockReason: "",
    cancelReason: "",
    sites: [
      {
        id: "ord-site-0142-1",
        name: "ABC Manufacturing HQ",
        address: "14 Main Reef Road, Johannesburg",
        service: "1 Gbps dedicated fibre",
        accessStatus: "Installation",
        targetLabel: "22 Oct 2026",
      },
      {
        id: "ord-site-0142-2",
        name: "ABC Manufacturing Plant 2",
        address: "88 Industrial Avenue, Pretoria",
        service: "500 Mbps business fibre",
        accessStatus: "Planned",
        targetLabel: "26 Nov 2026",
      },
    ],
    activity: [
      { id: "ord-act-0142-4", summary: "Installation window confirmed with the site contact", actorName: "Sarah M.", occurredLabel: "Today" },
      { id: "ord-act-0142-3", summary: "Order moved to Installation", actorName: "Sarah M.", occurredLabel: "10 Oct 2026" },
      { id: "ord-act-0142-2", summary: "Feasibility confirmed for both sites", actorName: "David K.", occurredLabel: "06 Oct 2026" },
      { id: "ord-act-0142-1", summary: "Order created from QUO-2026-0098", actorName: "Sarah M.", occurredLabel: "02 Oct 2026" },
    ],
  }),
  order({
    id: "ord-2026-0137",
    customerId: "cus-2026-0007",
    orderNumber: "ORD-2026-0137",
    quoteId: "quo-2026-0093",
    quoteNumber: "QUO-2026-0093",
    orderType: "GOVERNMENT",
    product: "Multi-site Business Fibre",
    status: "FEASIBILITY",
    priority: "HIGH",
    atRisk: false,
    riskNote: "",
    value: 3240000,
    progress: 25,
    ownerId: "owner-david",
    ownerName: "David K.",
    targetActivation: "2026-11-18",
    targetActivationLabel: "18 Nov 2026",
    createdLabel: "28 Sep 2026",
    updatedAt: "2026-10-14T08:15:00",
    lastActivityLabel: "Today",
    notes: "Provincial sites are being surveyed in two waves. Activation stays on the November target.",
    heldFrom: null,
    blockedFrom: null,
    holdReason: "",
    blockReason: "",
    cancelReason: "",
    sites: [
      {
        id: "ord-site-0137-1",
        name: "Department of Education Head Office",
        address: "222 Struben Street, Pretoria",
        service: "1 Gbps business fibre",
        accessStatus: "Feasibility",
        targetLabel: "18 Nov 2026",
      },
      {
        id: "ord-site-0137-2",
        name: "District Office Polokwane",
        address: "15 Landdros Mare Street, Polokwane",
        service: "200 Mbps business fibre",
        accessStatus: "Survey booked",
        targetLabel: "18 Nov 2026",
      },
    ],
    activity: [
      { id: "ord-act-0137-3", summary: "Site survey booked for the Polokwane district office", actorName: "David K.", occurredLabel: "Today" },
      { id: "ord-act-0137-2", summary: "Order moved to Feasibility", actorName: "David K.", occurredLabel: "06 Oct 2026" },
      { id: "ord-act-0137-1", summary: "Order created from QUO-2026-0093", actorName: "David K.", occurredLabel: "28 Sep 2026" },
    ],
  }),
  order({
    id: "ord-2026-0129",
    customerId: "cus-2026-0012",
    orderNumber: "ORD-2026-0129",
    quoteId: "quo-2026-0096",
    quoteNumber: "QUO-2026-0096",
    orderType: "WHOLESALE",
    product: "10 Gbps Wholesale Link",
    status: "PLANNING",
    priority: "MEDIUM",
    atRisk: false,
    riskNote: "",
    value: 2180000,
    progress: 40,
    ownerId: "owner-michael",
    ownerName: "Michael R.",
    targetActivation: "2026-10-30",
    targetActivationLabel: "30 Oct 2026",
    createdLabel: "18 Sep 2026",
    updatedAt: "2026-10-13T16:20:00",
    lastActivityLabel: "Yesterday",
    notes: "Metro capacity is reserved. The handover date depends on the interconnect window.",
    heldFrom: null,
    blockedFrom: null,
    holdReason: "",
    blockReason: "",
    cancelReason: "",
    sites: [
      {
        id: "ord-site-0129-1",
        name: "XYZ Telecom Metro PoP",
        address: "1 Fredman Drive, Sandton",
        service: "10 Gbps wholesale link",
        accessStatus: "Planning",
        targetLabel: "30 Oct 2026",
      },
    ],
    activity: [
      { id: "ord-act-0129-3", summary: "Interconnect window requested for 28 Oct", actorName: "Michael R.", occurredLabel: "Yesterday" },
      { id: "ord-act-0129-2", summary: "Order moved to Planning", actorName: "Michael R.", occurredLabel: "04 Oct 2026" },
      { id: "ord-act-0129-1", summary: "Order created from QUO-2026-0096", actorName: "Michael R.", occurredLabel: "18 Sep 2026" },
    ],
  }),
  order({
    id: "ord-2026-0134",
    customerId: "cus-2026-0021",
    orderNumber: "ORD-2026-0134",
    quoteId: "quo-2026-0091",
    quoteNumber: "QUO-2026-0091",
    orderType: "RESELLER",
    product: "500 Mbps Business Fibre x 20",
    status: "TESTING",
    priority: "MEDIUM",
    atRisk: false,
    riskNote: "",
    value: 975000,
    progress: 85,
    ownerId: "owner-sarah",
    ownerName: "Sarah M.",
    targetActivation: "2026-10-17",
    targetActivationLabel: "17 Oct 2026",
    createdLabel: "22 Sep 2026",
    updatedAt: "2026-10-14T07:50:00",
    lastActivityLabel: "Today",
    notes: "Eighteen of twenty reseller sites have passed the acceptance test.",
    heldFrom: null,
    blockedFrom: null,
    holdReason: "",
    blockReason: "",
    cancelReason: "",
    sites: [
      {
        id: "ord-site-0134-1",
        name: "ConnectPro Johannesburg cluster",
        address: "Multiple reseller sites, Gauteng",
        service: "500 Mbps business fibre",
        accessStatus: "Testing",
        targetLabel: "17 Oct 2026",
      },
    ],
    activity: [
      { id: "ord-act-0134-3", summary: "Acceptance tests passed on 18 of 20 sites", actorName: "Sarah M.", occurredLabel: "Today" },
      { id: "ord-act-0134-2", summary: "Order moved to Testing", actorName: "Sarah M.", occurredLabel: "12 Oct 2026" },
      { id: "ord-act-0134-1", summary: "Order created from QUO-2026-0091", actorName: "Sarah M.", occurredLabel: "22 Sep 2026" },
    ],
  }),
  order({
    id: "ord-2026-0118",
    customerId: "cus-2026-0027",
    orderNumber: "ORD-2026-0118",
    quoteId: "quo-2026-0087",
    quoteNumber: "QUO-2026-0087",
    orderType: "ENTERPRISE",
    product: "200 Mbps Business Fibre",
    status: "ACTIVATION",
    priority: "LOW",
    atRisk: false,
    riskNote: "",
    value: 620000,
    progress: 95,
    ownerId: "owner-michael",
    ownerName: "Michael R.",
    targetActivation: "2026-10-15",
    targetActivationLabel: "15 Oct 2026",
    createdLabel: "08 Sep 2026",
    updatedAt: "2026-10-13T11:05:00",
    lastActivityLabel: "Yesterday",
    notes: "The store circuit is ready for the activation window tomorrow.",
    heldFrom: null,
    blockedFrom: null,
    holdReason: "",
    blockReason: "",
    cancelReason: "",
    sites: [
      {
        id: "ord-site-0118-1",
        name: "Horizon Sandton",
        address: "Sandton City, Johannesburg",
        service: "200 Mbps business fibre",
        accessStatus: "Activation",
        targetLabel: "15 Oct 2026",
      },
    ],
    activity: [
      { id: "ord-act-0118-3", summary: "Activation window set for 15 Oct", actorName: "Michael R.", occurredLabel: "Yesterday" },
      { id: "ord-act-0118-2", summary: "Order moved to Activation", actorName: "Michael R.", occurredLabel: "11 Oct 2026" },
      { id: "ord-act-0118-1", summary: "Order created from QUO-2026-0087", actorName: "Michael R.", occurredLabel: "08 Sep 2026" },
    ],
  }),
  order({
    id: "ord-2026-0148",
    customerId: "cus-2026-0015",
    orderNumber: "ORD-2026-0148",
    quoteId: "quo-2026-0099",
    quoteNumber: "QUO-2026-0099",
    orderType: "ENTERPRISE",
    product: "Shaft Site Fibre",
    status: "NEW",
    priority: "MEDIUM",
    atRisk: false,
    riskNote: "",
    value: 890000,
    progress: 5,
    ownerId: "owner-sarah",
    ownerName: "Sarah M.",
    targetActivation: "2026-12-04",
    targetActivationLabel: "4 Dec 2026",
    createdLabel: "13 Oct 2026",
    updatedAt: "2026-10-13T15:10:00",
    lastActivityLabel: "Yesterday",
    notes: "Accepted quote is waiting for order validation.",
    heldFrom: null,
    blockedFrom: null,
    holdReason: "",
    blockReason: "",
    cancelReason: "",
    sites: [
      {
        id: "ord-site-0148-1",
        name: "Highveld Shaft Site",
        address: "Witbank industrial belt",
        service: "100 Mbps dedicated fibre",
        accessStatus: "New",
        targetLabel: "4 Dec 2026",
      },
    ],
    activity: [
      { id: "ord-act-0148-1", summary: "Order created from QUO-2026-0099", actorName: "Sarah M.", occurredLabel: "Yesterday" },
    ],
  }),
  order({
    id: "ord-2026-0144",
    customerId: "cus-2026-0009",
    orderNumber: "ORD-2026-0144",
    quoteId: "quo-2026-0090",
    quoteNumber: "QUO-2026-0090",
    orderType: "ENTERPRISE",
    product: "Clinic Connectivity",
    status: "VALIDATION",
    priority: "HIGH",
    atRisk: false,
    riskNote: "",
    value: 540000,
    progress: 15,
    ownerId: "owner-nomsa",
    ownerName: "Nomsa P.",
    targetActivation: "2026-11-27",
    targetActivationLabel: "27 Nov 2026",
    createdLabel: "09 Oct 2026",
    updatedAt: "2026-10-12T10:00:00",
    lastActivityLabel: "12 Oct 2026",
    notes: "Site contacts and billing details are being confirmed.",
    heldFrom: null,
    blockedFrom: null,
    holdReason: "",
    blockReason: "",
    cancelReason: "",
    sites: [
      {
        id: "ord-site-0144-1",
        name: "Northern Clinics Polokwane",
        address: "Hospital Street, Polokwane",
        service: "200 Mbps business fibre",
        accessStatus: "Validation",
        targetLabel: "27 Nov 2026",
      },
    ],
    activity: [
      { id: "ord-act-0144-2", summary: "Order moved to Validation", actorName: "Nomsa P.", occurredLabel: "12 Oct 2026" },
      { id: "ord-act-0144-1", summary: "Order created from QUO-2026-0090", actorName: "Nomsa P.", occurredLabel: "09 Oct 2026" },
    ],
  }),
  order({
    id: "ord-2026-0140",
    customerId: "cus-2026-0018",
    orderNumber: "ORD-2026-0140",
    quoteId: "quo-2026-0100",
    quoteNumber: "QUO-2026-0100",
    orderType: "ENTERPRISE",
    product: "Plant 2 Redundant Access",
    status: "VALIDATION",
    priority: "MEDIUM",
    atRisk: false,
    riskNote: "",
    value: 410000,
    progress: 15,
    ownerId: "owner-sarah",
    ownerName: "Sarah M.",
    targetActivation: "2026-11-20",
    targetActivationLabel: "20 Nov 2026",
    createdLabel: "07 Oct 2026",
    updatedAt: "2026-10-11T09:30:00",
    lastActivityLabel: "11 Oct 2026",
    notes: "Second access path for Plant 2. Kept separate from the head-office order.",
    heldFrom: null,
    blockedFrom: null,
    holdReason: "",
    blockReason: "",
    cancelReason: "",
    sites: [
      {
        id: "ord-site-0140-1",
        name: "ABC Manufacturing Plant 2",
        address: "88 Industrial Avenue, Pretoria",
        service: "Diverse access",
        accessStatus: "Validation",
        targetLabel: "20 Nov 2026",
      },
    ],
    activity: [
      { id: "ord-act-0140-1", summary: "Order created from QUO-2026-0100", actorName: "Sarah M.", occurredLabel: "07 Oct 2026" },
    ],
  }),
  order({
    id: "ord-2026-0131",
    customerId: "cus-2026-0024",
    orderNumber: "ORD-2026-0131",
    quoteId: "quo-2026-0094",
    quoteNumber: "QUO-2026-0094",
    orderType: "ENTERPRISE",
    product: "Campus Backhaul",
    status: "BUILD",
    priority: "MEDIUM",
    atRisk: true,
    riskNote: "Core port availability is tight for the requested handover week.",
    value: 760000,
    progress: 55,
    ownerId: "owner-michael",
    ownerName: "Michael R.",
    targetActivation: "2026-11-06",
    targetActivationLabel: "6 Nov 2026",
    createdLabel: "16 Sep 2026",
    updatedAt: "2026-10-14T06:40:00",
    lastActivityLabel: "Today",
    notes: "Provisioning is underway. The core port reservation is the open risk.",
    heldFrom: null,
    blockedFrom: null,
    holdReason: "",
    blockReason: "",
    cancelReason: "",
    sites: [
      {
        id: "ord-site-0131-1",
        name: "UrbanGrid Campus",
        address: "Lynnwood, Pretoria",
        service: "1 Gbps campus backhaul",
        accessStatus: "Build",
        targetLabel: "6 Nov 2026",
      },
    ],
    activity: [
      { id: "ord-act-0131-3", summary: "Marked at risk: core port availability", actorName: "Michael R.", occurredLabel: "Today" },
      { id: "ord-act-0131-2", summary: "Order moved to Build", actorName: "Michael R.", occurredLabel: "08 Oct 2026" },
      { id: "ord-act-0131-1", summary: "Order created from QUO-2026-0094", actorName: "Michael R.", occurredLabel: "16 Sep 2026" },
    ],
  }),
  order({
    id: "ord-2026-0122",
    customerId: "cus-2026-0033",
    orderNumber: "ORD-2026-0122",
    quoteId: "quo-2026-0089",
    quoteNumber: "QUO-2026-0089",
    orderType: "ENTERPRISE",
    product: "Cold Chain Link",
    status: "BILLING",
    priority: "LOW",
    atRisk: false,
    riskNote: "",
    value: 280000,
    progress: 98,
    ownerId: "owner-david",
    ownerName: "David K.",
    targetActivation: "2026-10-08",
    targetActivationLabel: "8 Oct 2026",
    createdLabel: "12 Aug 2026",
    updatedAt: "2026-10-10T14:00:00",
    lastActivityLabel: "10 Oct 2026",
    notes: "Service is live. The first invoice is being prepared.",
    heldFrom: null,
    blockedFrom: null,
    holdReason: "",
    blockReason: "",
    cancelReason: "",
    sites: [
      {
        id: "ord-site-0122-1",
        name: "East Cape Cold Store",
        address: "Deal Party, Gqeberha",
        service: "100 Mbps business fibre",
        accessStatus: "Activated",
        targetLabel: "8 Oct 2026",
      },
    ],
    activity: [
      { id: "ord-act-0122-3", summary: "Order moved to Billing", actorName: "David K.", occurredLabel: "10 Oct 2026" },
      { id: "ord-act-0122-2", summary: "Service activated", actorName: "David K.", occurredLabel: "08 Oct 2026" },
      { id: "ord-act-0122-1", summary: "Order created from QUO-2026-0089", actorName: "David K.", occurredLabel: "12 Aug 2026" },
    ],
  }),
  order({
    id: "ord-2026-0110",
    customerId: "cus-2026-0011",
    orderNumber: "ORD-2026-0110",
    quoteId: "quo-2026-0097",
    quoteNumber: "QUO-2026-0097",
    orderType: "GOVERNMENT",
    product: "School Fibre Phase 2",
    status: "COMPLETED",
    priority: "LOW",
    atRisk: false,
    riskNote: "",
    value: 450000,
    progress: 100,
    ownerId: "owner-david",
    ownerName: "David K.",
    targetActivation: "2026-09-30",
    targetActivationLabel: "30 Sep 2026",
    createdLabel: "04 Jul 2026",
    updatedAt: "2026-10-02T09:00:00",
    lastActivityLabel: "02 Oct 2026",
    notes: "Activated in September and closed after the first billing cycle.",
    heldFrom: null,
    blockedFrom: null,
    holdReason: "",
    blockReason: "",
    cancelReason: "",
    sites: [
      {
        id: "ord-site-0110-1",
        name: "KwaZulu Schools cluster",
        address: "Pinetown, KwaZulu-Natal",
        service: "100 Mbps school fibre",
        accessStatus: "Completed",
        targetLabel: "30 Sep 2026",
      },
    ],
    activity: [
      { id: "ord-act-0110-2", summary: "Order completed", actorName: "David K.", occurredLabel: "02 Oct 2026" },
      { id: "ord-act-0110-1", summary: "Order created from QUO-2026-0097", actorName: "David K.", occurredLabel: "04 Jul 2026" },
    ],
  }),
  order({
    id: "ord-2026-0104",
    customerId: "cus-2026-0031",
    orderNumber: "ORD-2026-0104",
    quoteId: "quo-2026-0086",
    quoteNumber: "QUO-2026-0086",
    orderType: "ENTERPRISE",
    product: "Depot Fibre",
    status: "INSTALLATION",
    priority: "HIGH",
    atRisk: true,
    riskNote: "Landlord access for the depot riser is still unconfirmed.",
    value: 360000,
    progress: 70,
    ownerId: "owner-sarah",
    ownerName: "Sarah M.",
    targetActivation: "2026-10-24",
    targetActivationLabel: "24 Oct 2026",
    createdLabel: "20 Aug 2026",
    updatedAt: "2026-10-14T10:05:00",
    lastActivityLabel: "Today",
    notes: "Installation crew is ready. The riser access approval is the open item.",
    heldFrom: null,
    blockedFrom: null,
    holdReason: "",
    blockReason: "",
    cancelReason: "",
    sites: [
      {
        id: "ord-site-0104-1",
        name: "BlueWave Depot",
        address: "Isando, Kempton Park",
        service: "200 Mbps business fibre",
        accessStatus: "Access pending",
        targetLabel: "24 Oct 2026",
      },
    ],
    activity: [
      { id: "ord-act-0104-3", summary: "Marked at risk: landlord access unconfirmed", actorName: "Sarah M.", occurredLabel: "Today" },
      { id: "ord-act-0104-2", summary: "Order moved to Installation", actorName: "Sarah M.", occurredLabel: "09 Oct 2026" },
      { id: "ord-act-0104-1", summary: "Order created from QUO-2026-0086", actorName: "Sarah M.", occurredLabel: "20 Aug 2026" },
    ],
  }),
  order({
    id: "ord-2026-0126",
    customerId: "cus-2026-0004",
    orderNumber: "ORD-2026-0126",
    quoteId: null,
    quoteNumber: null,
    orderType: "WHOLESALE",
    product: "Metro Dark Fibre Pair",
    status: "BLOCKED",
    priority: "HIGH",
    atRisk: true,
    riskNote: "Wayleave approval has stopped the build.",
    value: 1280000,
    progress: 45,
    ownerId: "owner-michael",
    ownerName: "Michael R.",
    targetActivation: "2026-11-12",
    targetActivationLabel: "12 Nov 2026",
    createdLabel: "14 Sep 2026",
    updatedAt: "2026-10-13T13:40:00",
    lastActivityLabel: "Yesterday",
    notes: "Build cannot continue until the municipal wayleave is issued.",
    heldFrom: null,
    blockedFrom: "BUILD",
    holdReason: "",
    blockReason: "Municipal wayleave for the metro route has not been issued.",
    cancelReason: "",
    sites: [
      {
        id: "ord-site-0126-1",
        name: "SignalPath Metro Route",
        address: "Rosebank to Sandton",
        service: "Dark fibre pair",
        accessStatus: "Blocked",
        targetLabel: "12 Nov 2026",
      },
    ],
    activity: [
      { id: "ord-act-0126-2", summary: "Order blocked: municipal wayleave outstanding", actorName: "Michael R.", occurredLabel: "Yesterday" },
      { id: "ord-act-0126-1", summary: "Order created", actorName: "Michael R.", occurredLabel: "14 Sep 2026" },
    ],
  }),
  order({
    id: "ord-2026-0116",
    customerId: "cus-2026-0027",
    orderNumber: "ORD-2026-0116",
    quoteId: null,
    quoteNumber: null,
    orderType: "ENTERPRISE",
    product: "Guest Access Wi-Fi",
    status: "ON_HOLD",
    priority: "LOW",
    atRisk: false,
    riskNote: "",
    value: 180000,
    progress: 30,
    ownerId: "owner-michael",
    ownerName: "Michael R.",
    targetActivation: "2026-12-15",
    targetActivationLabel: "15 Dec 2026",
    createdLabel: "01 Sep 2026",
    updatedAt: "2026-10-09T11:20:00",
    lastActivityLabel: "09 Oct 2026",
    notes: "The customer asked to pause the guest network until the store refit is finished.",
    heldFrom: "PLANNING",
    blockedFrom: null,
    holdReason: "Customer requested a pause until the Sandton store refit is complete.",
    blockReason: "",
    cancelReason: "",
    sites: [
      {
        id: "ord-site-0116-1",
        name: "Horizon Sandton",
        address: "Sandton City, Johannesburg",
        service: "Guest Wi-Fi",
        accessStatus: "On hold",
        targetLabel: "15 Dec 2026",
      },
    ],
    activity: [
      { id: "ord-act-0116-2", summary: "Order placed on hold", actorName: "Michael R.", occurredLabel: "09 Oct 2026" },
      { id: "ord-act-0116-1", summary: "Order created", actorName: "Michael R.", occurredLabel: "01 Sep 2026" },
    ],
  }),
  order({
    id: "ord-2026-0108",
    customerId: "cus-2026-0021",
    orderNumber: "ORD-2026-0108",
    quoteId: null,
    quoteNumber: null,
    orderType: "RESELLER",
    product: "Temporary LTE Failover",
    status: "CANCELLED",
    priority: "LOW",
    atRisk: false,
    riskNote: "",
    value: 95000,
    progress: 10,
    ownerId: "owner-sarah",
    ownerName: "Sarah M.",
    targetActivation: "2026-10-31",
    targetActivationLabel: "31 Oct 2026",
    createdLabel: "18 Aug 2026",
    updatedAt: "2026-09-22T08:00:00",
    lastActivityLabel: "22 Sep 2026",
    notes: "The reseller withdrew the temporary failover request.",
    heldFrom: "VALIDATION",
    blockedFrom: null,
    holdReason: "",
    blockReason: "",
    cancelReason: "Reseller withdrew the temporary failover request.",
    sites: [
      {
        id: "ord-site-0108-1",
        name: "ConnectPro overflow site",
        address: "Midrand",
        service: "LTE failover",
        accessStatus: "Cancelled",
        targetLabel: "31 Oct 2026",
      },
    ],
    activity: [
      { id: "ord-act-0108-2", summary: "Order cancelled", actorName: "Sarah M.", occurredLabel: "22 Sep 2026" },
      { id: "ord-act-0108-1", summary: "Order created", actorName: "Sarah M.", occurredLabel: "18 Aug 2026" },
    ],
  }),
  order({
    id: "ord-2026-0136",
    customerId: "cus-2026-0007",
    orderNumber: "ORD-2026-0136",
    quoteId: null,
    quoteNumber: null,
    orderType: "GOVERNMENT",
    product: "District Microwave Spur",
    status: "PLANNING",
    priority: "MEDIUM",
    atRisk: false,
    riskNote: "",
    value: 510000,
    progress: 40,
    ownerId: "owner-david",
    ownerName: "David K.",
    targetActivation: "2026-12-02",
    targetActivationLabel: "2 Dec 2026",
    createdLabel: "25 Sep 2026",
    updatedAt: "2026-10-08T12:15:00",
    lastActivityLabel: "08 Oct 2026",
    notes: "Microwave spur for a district office that fibre cannot reach this year.",
    heldFrom: null,
    blockedFrom: null,
    holdReason: "",
    blockReason: "",
    cancelReason: "",
    sites: [
      {
        id: "ord-site-0136-1",
        name: "District Office Thohoyandou",
        address: "Thohoyandou",
        service: "100 Mbps microwave",
        accessStatus: "Planning",
        targetLabel: "2 Dec 2026",
      },
    ],
    activity: [
      { id: "ord-act-0136-2", summary: "Order moved to Planning", actorName: "David K.", occurredLabel: "08 Oct 2026" },
      { id: "ord-act-0136-1", summary: "Order created", actorName: "David K.", occurredLabel: "25 Sep 2026" },
    ],
  }),
];

export function getDemoOrder(id: string) {
  return demoOrders.find((item) => item.id === id);
}

export function isOrderStage(status: OrderStatus): status is OrderStage {
  return (ORDER_STAGES as readonly string[]).includes(status);
}

export function lifecycleStage(order: Pick<OrderRecord, "status" | "heldFrom" | "blockedFrom">): OrderStage {
  if (order.status === "ON_HOLD" && order.heldFrom) {
    return order.heldFrom;
  }

  if (order.status === "BLOCKED" && order.blockedFrom) {
    return order.blockedFrom;
  }

  if (order.status === "CANCELLED" && order.heldFrom) {
    return order.heldFrom;
  }

  if (isOrderStage(order.status)) {
    return order.status;
  }

  return "NEW";
}

export function nextOrderStage(stage: OrderStage) {
  const index = ORDER_STAGES.indexOf(stage);

  return ORDER_STAGES[index + 1] ?? null;
}

export function nextOrderNumber(orders: OrderRecord[]) {
  const highest = orders.reduce((max, item) => {
    const suffix = Number(item.orderNumber.split("-").at(-1));

    return Number.isFinite(suffix) ? Math.max(max, suffix) : max;
  }, 0);

  return `ORD-2026-${String(highest + 1).padStart(4, "0")}`;
}

export function orderCustomers(orders: OrderRecord[]) {
  return [...new Set(orders.map((item) => item.customer.name))].sort((a, b) => a.localeCompare(b));
}

export function orderOwners(orders: OrderRecord[]) {
  return [...new Set(orders.map((item) => item.ownerName))].sort((a, b) => a.localeCompare(b));
}
