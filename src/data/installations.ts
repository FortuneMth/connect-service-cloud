/**
 * Static installation book for field execution.
 * Records point at existing orders and customers and will be replaced by queries later.
 * KPI and pipeline figures are portfolio snapshots, not counts of the working list.
 */

import { DEMO_ORGANISATION_ID, demoOrders } from "@/data/orders";

export { DEMO_ORGANISATION_ID };

export const INSTALLATION_TODAY = "2026-10-15";

export const INSTALLATION_STATUSES = [
  "PREPARATION",
  "READY",
  "SCHEDULED",
  "IN_PROGRESS",
  "TESTING",
  "CUSTOMER_ACCEPTANCE",
  "COMPLETED",
  "CANCELLED",
] as const;

export const INSTALLATION_PRIORITIES = ["HIGH", "MEDIUM", "LOW"] as const;
export const READINESS_STATES = ["READY", "AT_RISK", "BLOCKED"] as const;

export type InstallationStatus = (typeof INSTALLATION_STATUSES)[number];
export type InstallationPriority = (typeof INSTALLATION_PRIORITIES)[number];
export type ReadinessState = (typeof READINESS_STATES)[number];

export const INSTALLATION_STATUS_LABEL: Record<InstallationStatus, string> = {
  PREPARATION: "Preparation",
  READY: "Ready",
  SCHEDULED: "Scheduled",
  IN_PROGRESS: "In Progress",
  TESTING: "Testing",
  CUSTOMER_ACCEPTANCE: "Customer Acceptance",
  COMPLETED: "Completed",
  CANCELLED: "Cancelled",
};

export const INSTALLATION_PRIORITY_LABEL: Record<InstallationPriority, string> = {
  HIGH: "High",
  MEDIUM: "Medium",
  LOW: "Low",
};

export const READINESS_LABEL: Record<ReadinessState, string> = {
  READY: "Ready",
  AT_RISK: "At Risk",
  BLOCKED: "Blocked",
};

export const INSTALLATION_TECHNICIANS = [
  "Installation Team",
  "Field Team 1",
  "Field Team 2",
  "Technician A",
  "Technician B",
  "Technician C",
] as const;

export const RESCHEDULE_REASONS = [
  "Customer unavailable",
  "Site access issue",
  "Technician unavailable",
  "Materials delayed",
  "Network dependency",
  "Other",
] as const;

export const ACCEPTANCE_RESULTS = ["Accepted", "Accepted with Issues", "Rejected"] as const;

export type InstallationKpi = {
  id: string;
  label: string;
  value: string;
  supporting: string;
  tone: "neutral" | "attention" | "positive";
};

export const installationKpis: InstallationKpi[] = [
  { id: "week", label: "Scheduled This Week", value: "8", supporting: "3 high priority", tone: "neutral" },
  { id: "ready", label: "Ready for Installation", value: "5", supporting: "2 awaiting site access", tone: "neutral" },
  { id: "progress", label: "In Progress", value: "3", supporting: "1 requires attention", tone: "attention" },
  { id: "completed", label: "Completed This Month", value: "14", supporting: "R 4.8M order value", tone: "positive" },
];

export type InstallationPipelineStage = {
  status: InstallationStatus;
  count: number;
  highPriority: number;
};

export const installationPipeline: InstallationPipelineStage[] = [
  { status: "PREPARATION", count: 4, highPriority: 1 },
  { status: "READY", count: 5, highPriority: 2 },
  { status: "SCHEDULED", count: 6, highPriority: 3 },
  { status: "IN_PROGRESS", count: 3, highPriority: 1 },
  { status: "TESTING", count: 2, highPriority: 0 },
  { status: "CUSTOMER_ACCEPTANCE", count: 2, highPriority: 0 },
  { status: "COMPLETED", count: 14, highPriority: 0 },
  { status: "CANCELLED", count: 1, highPriority: 0 },
];

export type ReadinessItem = {
  id: string;
  label: string;
  critical: boolean;
  blocks: boolean;
  done: boolean;
  ownerName: string;
  updatedLabel: string;
};

export type FieldCheck = {
  id: string;
  section: "Before Arrival" | "On Site" | "Testing" | "Completion";
  label: string;
  done: boolean;
  updatedLabel: string;
};

export type InstallationTest = {
  id: string;
  name: string;
  result: string;
  unit: string;
  outcome: "Pass" | "Fail";
  notes: string;
};

export type InstallationAcceptance = {
  status: "Pending" | "Accepted" | "Accepted with Issues" | "Rejected";
  contact: string;
  dateLabel: string;
  method: string;
  notes: string;
};

export type InstallationEvent = {
  id: string;
  summary: string;
  actorName: string;
  occurredLabel: string;
  category: string;
};

export type InstallationNote = {
  id: string;
  body: string;
  actorName: string;
  occurredLabel: string;
};

export type InstallationDocument = {
  id: string;
  name: string;
};

export type InstallationRecord = {
  id: string;
  organisationId: string;
  installationNumber: string;
  orderId: string;
  orderNumber: string;
  customerId: string;
  customerName: string;
  siteId: string;
  siteName: string;
  address: string;
  city: string;
  siteContactName: string;
  siteContactPhone: string;
  accessHours: string;
  accessRequirements: string;
  parking: string;
  technicalRoom: string;
  serviceId: string;
  serviceNumber: string;
  serviceName: string;
  scheduledDate: string;
  scheduledLabel: string;
  scheduledTime: string;
  durationHours: number;
  technician: string;
  status: InstallationStatus;
  priority: InstallationPriority;
  readiness: ReadinessState;
  risk: string;
  siteAccess: string;
  siteSurvey: string;
  cpe: string;
  materials: string;
  customerContact: string;
  workPermit: string;
  checklist: ReadinessItem[];
  fieldChecklist: FieldCheck[];
  tests: InstallationTest[];
  acceptance: InstallationAcceptance;
  documents: InstallationDocument[];
  timeline: InstallationEvent[];
  notes: InstallationNote[];
  createdAt: string;
  createdLabel: string;
  updatedAt: string;
  updatedLabel: string;
};

const READINESS_TEMPLATE: Array<Omit<ReadinessItem, "done" | "ownerName" | "updatedLabel">> = [
  { id: "access", label: "Site access confirmed", critical: true, blocks: false },
  { id: "contact", label: "Customer contact confirmed", critical: false, blocks: false },
  { id: "survey", label: "Site survey complete", critical: false, blocks: false },
  { id: "route", label: "Fibre route confirmed", critical: false, blocks: false },
  { id: "cpe", label: "CPE available", critical: false, blocks: false },
  { id: "materials", label: "Installation materials available", critical: false, blocks: false },
  { id: "technician", label: "Technician assigned", critical: true, blocks: false },
  { id: "permit", label: "Work permit approved", critical: true, blocks: true },
  { id: "date", label: "Installation date confirmed", critical: false, blocks: false },
];

const FIELD_TEMPLATE: Array<Pick<FieldCheck, "id" | "section" | "label">> = [
  { id: "appt", section: "Before Arrival", label: "Confirm customer appointment" },
  { id: "access-check", section: "Before Arrival", label: "Confirm site access" },
  { id: "equipment-check", section: "Before Arrival", label: "Confirm equipment" },
  { id: "materials-check", section: "Before Arrival", label: "Confirm materials" },
  { id: "route-check", section: "Before Arrival", label: "Confirm route" },
  { id: "arrived", section: "On Site", label: "Technician arrived" },
  { id: "induction", section: "On Site", label: "Site induction complete" },
  { id: "fibre-route", section: "On Site", label: "Fibre route inspected" },
  { id: "cpe-installed", section: "On Site", label: "CPE installed" },
  { id: "terminated", section: "On Site", label: "Fibre terminated" },
  { id: "powered", section: "On Site", label: "Equipment powered" },
  { id: "optical", section: "Testing", label: "Optical power test" },
  { id: "link", section: "Testing", label: "Link test" },
  { id: "throughput", section: "Testing", label: "Throughput test" },
  { id: "latency", section: "Testing", label: "Latency test" },
  { id: "failover", section: "Testing", label: "Failover test if applicable" },
  { id: "walkthrough", section: "Completion", label: "Customer walkthrough" },
  { id: "acceptance", section: "Completion", label: "Customer acceptance" },
  { id: "photos", section: "Completion", label: "Installation photos" },
  { id: "report", section: "Completion", label: "Completion report" },
];

export function readinessFromChecklist(checklist: ReadinessItem[]) {
  const open = checklist.filter((item) => !item.done);

  if (open.length === 0) {
    return { readiness: "READY" as const, risk: "" };
  }

  const blocking = open.find((item) => item.blocks);
  const critical = open.find((item) => item.critical);

  if (blocking) {
    return { readiness: "BLOCKED" as const, risk: `${blocking.label.replace(/ approved| confirmed| complete| available| assigned/, "")} outstanding.` };
  }

  if (critical) {
    return { readiness: "AT_RISK" as const, risk: critical.id === "access" ? "Site access pending." : `${critical.label} is still open.` };
  }

  return { readiness: "AT_RISK" as const, risk: `${open[0].label} is still open.` };
}

export function summaryFromChecklist(checklist: ReadinessItem[]) {
  const done = (id: string) => checklist.find((item) => item.id === id)?.done === true;
  const permit = checklist.find((item) => item.id === "permit");

  return {
    siteAccess: done("access") ? "Confirmed" : "Pending",
    siteSurvey: done("survey") ? "Complete" : "Pending",
    cpe: done("cpe") ? "Ready" : "Pending",
    materials: done("materials") ? "Ready" : "Pending",
    customerContact: done("contact") ? "Confirmed" : "Pending",
    workPermit: permit?.done ? "Approved" : "Pending",
  };
}

function checklist(doneIds: string[], ownerName: string, updatedLabel: string, permitNotRequired = false): ReadinessItem[] {
  return READINESS_TEMPLATE.map((item) => ({
    ...item,
    blocks: item.id === "permit" && permitNotRequired ? false : item.blocks,
    critical: item.id === "permit" && permitNotRequired ? false : item.critical,
    done: permitNotRequired && item.id === "permit" ? true : doneIds.includes(item.id),
    ownerName,
    updatedLabel,
  }));
}

function fieldChecklist(doneIds: string[], updatedLabel: string): FieldCheck[] {
  return FIELD_TEMPLATE.map((item) => ({
    ...item,
    done: doneIds.includes(item.id),
    updatedLabel,
  }));
}

function orderRef(orderNumber: string) {
  const order = demoOrders.find((item) => item.orderNumber === orderNumber);

  if (!order) {
    throw new Error(`Unknown order ${orderNumber}`);
  }

  return {
    orderId: order.id,
    orderNumber: order.orderNumber,
    customerId: order.customer.id,
    customerName: order.customer.name,
    organisationId: DEMO_ORGANISATION_ID,
  };
}

const defaultDocuments: InstallationDocument[] = [
  { id: "doc-survey", name: "Site Survey" },
  { id: "doc-photos", name: "Installation Photos" },
  { id: "doc-tests", name: "Test Results" },
  { id: "doc-report", name: "Completion Report" },
  { id: "doc-acceptance", name: "Customer Acceptance" },
];

function build(
  partial: Omit<InstallationRecord, "organisationId" | "orderId" | "customerId" | "customerName" | "readiness" | "risk" | "siteAccess" | "siteSurvey" | "cpe" | "materials" | "customerContact" | "workPermit"> & {
    orderNumber: string;
    permitNotRequired?: boolean;
  },
): InstallationRecord {
  const { orderNumber, permitNotRequired, checklist: items, ...rest } = partial;
  const derived = readinessFromChecklist(items);
  const summary = summaryFromChecklist(items);
  const workPermit = permitNotRequired ? "Not Required" : summary.workPermit;

  return {
    ...rest,
    ...orderRef(orderNumber),
    checklist: items,
    ...derived,
    ...summary,
    workPermit,
  };
}

const abcChecks = checklist(
  ["contact", "survey", "route", "cpe", "materials", "technician", "permit", "date"],
  "Installation Team",
  "Today",
  true,
);

export const demoInstallations: InstallationRecord[] = [
  build({
    id: "ins-2026-00231",
    installationNumber: "INS-2026-00231",
    orderNumber: "ORD-2026-0142",
    siteId: "site-abc-hq",
    siteName: "ABC Manufacturing HQ",
    address: "14 Main Reef Road, Johannesburg",
    city: "Johannesburg, Gauteng",
    siteContactName: "Thabo Mokoena",
    siteContactPhone: "+27 11 555 0182",
    accessHours: "07:00–17:00",
    accessRequirements: "Security clearance required at reception.",
    parking: "Loading bay access required for equipment delivery.",
    technicalRoom: "Ground floor communications room.",
    serviceId: "srv-2026-00421",
    serviceNumber: "SRV-2026-00421",
    serviceName: "1 Gbps Dedicated Fibre",
    scheduledDate: "2026-10-22",
    scheduledLabel: "22 Oct 2026",
    scheduledTime: "08:00",
    durationHours: 4,
    technician: "Installation Team",
    status: "SCHEDULED",
    priority: "HIGH",
    checklist: abcChecks,
    permitNotRequired: true,
    fieldChecklist: fieldChecklist(["appt"], "Today"),
    tests: [
      { id: "tst-231-1", name: "Optical Power", result: "-18.4", unit: "dBm", outcome: "Pass", notes: "" },
      { id: "tst-231-2", name: "Link", result: "1", unit: "Gbps", outcome: "Pass", notes: "" },
      { id: "tst-231-3", name: "Throughput", result: "947", unit: "Mbps", outcome: "Pass", notes: "" },
      { id: "tst-231-4", name: "Latency", result: "4", unit: "ms", outcome: "Pass", notes: "" },
      { id: "tst-231-5", name: "Packet Loss", result: "0.1", unit: "%", outcome: "Pass", notes: "" },
    ],
    acceptance: { status: "Pending", contact: "Thabo Mokoena", dateLabel: "—", method: "—", notes: "" },
    documents: defaultDocuments,
    timeline: [
      { id: "evt-231-2", summary: "Technician assigned", actorName: "Sarah M.", occurredLabel: "10 Oct 2026 14:20", category: "Assignment" },
      { id: "evt-231-1", summary: "Installation scheduled", actorName: "Sarah M.", occurredLabel: "10 Oct 2026 09:05", category: "Schedule" },
    ],
    notes: [
      { id: "note-231-1", body: "Customer requested installation outside normal loading-bay hours.", actorName: "Sarah M.", occurredLabel: "14 Oct 2026" },
    ],
    createdAt: "2026-10-10T09:05:00",
    createdLabel: "10 Oct 2026",
    updatedAt: "2026-10-15T08:10:00",
    updatedLabel: "Today",
  }),
  build({
    id: "ins-2026-00232",
    installationNumber: "INS-2026-00232",
    orderNumber: "ORD-2026-0118",
    siteId: "site-horizon-sandton",
    siteName: "Horizon Retail Group — Sandton Branch",
    address: "Sandton City, Johannesburg",
    city: "Johannesburg, Gauteng",
    siteContactName: "Aisha Patel",
    siteContactPhone: "+27 11 555 0270",
    accessHours: "08:00–18:00",
    accessRequirements: "Mall contractor pass required.",
    parking: "Service road parking is booked.",
    technicalRoom: "Retail riser behind the store.",
    serviceId: "srv-2026-00490",
    serviceNumber: "SRV-2026-00490",
    serviceName: "200 Mbps Business Fibre",
    scheduledDate: "2026-10-15",
    scheduledLabel: "15 Oct 2026",
    scheduledTime: "09:00",
    durationHours: 3,
    technician: "Installation Team",
    status: "SCHEDULED",
    priority: "LOW",
    checklist: checklist(["access", "contact", "survey", "route", "cpe", "materials", "technician", "permit", "date"], "Installation Team", "Yesterday", true),
    permitNotRequired: true,
    fieldChecklist: fieldChecklist(["appt", "access-check", "equipment-check", "materials-check", "route-check"], "Yesterday"),
    tests: [],
    acceptance: { status: "Pending", contact: "Aisha Patel", dateLabel: "—", method: "—", notes: "" },
    documents: defaultDocuments,
    timeline: [
      { id: "evt-232-1", summary: "Installation scheduled", actorName: "Michael R.", occurredLabel: "11 Oct 2026 11:00", category: "Schedule" },
    ],
    notes: [],
    createdAt: "2026-10-11T11:00:00",
    createdLabel: "11 Oct 2026",
    updatedAt: "2026-10-14T16:00:00",
    updatedLabel: "Yesterday",
  }),
  build({
    id: "ins-2026-00233",
    installationNumber: "INS-2026-00233",
    orderNumber: "ORD-2026-0134",
    siteId: "site-connectpro-durban",
    siteName: "ConnectPro Resellers — Durban POP",
    address: "Umhlanga Ridge, Durban",
    city: "Durban, KwaZulu-Natal",
    siteContactName: "Jason Naidoo",
    siteContactPhone: "+27 31 555 0210",
    accessHours: "08:00–16:00",
    accessRequirements: "Reseller escort from the POP lobby.",
    parking: "Basement bay 12.",
    technicalRoom: "Level 2 meet-me room.",
    serviceId: "srv-2026-00476",
    serviceNumber: "SRV-2026-00476",
    serviceName: "500 Mbps Business Fibre",
    scheduledDate: "2026-10-17",
    scheduledLabel: "17 Oct 2026",
    scheduledTime: "10:00",
    durationHours: 5,
    technician: "Field Team 2",
    status: "SCHEDULED",
    priority: "MEDIUM",
    checklist: checklist(["access", "contact", "survey", "route", "cpe", "materials", "technician", "permit", "date"], "Field Team 2", "Today", true),
    permitNotRequired: true,
    fieldChecklist: fieldChecklist(["appt", "equipment-check"], "Today"),
    tests: [],
    acceptance: { status: "Pending", contact: "Jason Naidoo", dateLabel: "—", method: "—", notes: "" },
    documents: defaultDocuments,
    timeline: [
      { id: "evt-233-2", summary: "Technician assigned", actorName: "Sarah M.", occurredLabel: "12 Oct 2026 15:10", category: "Assignment" },
      { id: "evt-233-1", summary: "Installation scheduled", actorName: "Sarah M.", occurredLabel: "12 Oct 2026 09:40", category: "Schedule" },
    ],
    notes: [],
    createdAt: "2026-10-12T09:40:00",
    createdLabel: "12 Oct 2026",
    updatedAt: "2026-10-15T07:30:00",
    updatedLabel: "Today",
  }),
  build({
    id: "ins-2026-00228",
    installationNumber: "INS-2026-00228",
    orderNumber: "ORD-2026-0104",
    siteId: "site-bluewave-depot",
    siteName: "BlueWave Depot",
    address: "Isando, Kempton Park",
    city: "Kempton Park, Gauteng",
    siteContactName: "Pieter Botha",
    siteContactPhone: "+27 11 555 0311",
    accessHours: "06:00–15:00",
    accessRequirements: "Landlord riser approval.",
    parking: "Yard access from the north gate.",
    technicalRoom: "Warehouse comms cupboard.",
    serviceId: "srv-2026-00462",
    serviceNumber: "SRV-2026-00462",
    serviceName: "200 Mbps Business Fibre",
    scheduledDate: "2026-10-24",
    scheduledLabel: "24 Oct 2026",
    scheduledTime: "07:30",
    durationHours: 4,
    technician: "Field Team 1",
    status: "PREPARATION",
    priority: "HIGH",
    checklist: checklist(["contact", "survey", "cpe", "materials", "technician"], "Field Team 1", "Today"),
    fieldChecklist: fieldChecklist([], "Today"),
    tests: [],
    acceptance: { status: "Pending", contact: "Pieter Botha", dateLabel: "—", method: "—", notes: "" },
    documents: defaultDocuments,
    timeline: [
      { id: "evt-228-1", summary: "Installation scheduled", actorName: "Sarah M.", occurredLabel: "09 Oct 2026 10:00", category: "Schedule" },
    ],
    notes: [],
    createdAt: "2026-10-09T10:00:00",
    createdLabel: "09 Oct 2026",
    updatedAt: "2026-10-15T06:50:00",
    updatedLabel: "Today",
  }),
  build({
    id: "ins-2026-00225",
    installationNumber: "INS-2026-00225",
    orderNumber: "ORD-2026-0131",
    siteId: "site-urbangrid",
    siteName: "UrbanGrid Campus",
    address: "Lynnwood, Pretoria",
    city: "Pretoria, Gauteng",
    siteContactName: "Campus Facilities",
    siteContactPhone: "+27 12 555 0244",
    accessHours: "08:00–16:00",
    accessRequirements: "Campus security desk sign-in.",
    parking: "Visitor parking at the west gate.",
    technicalRoom: "Building C basement.",
    serviceId: "srv-2026-00458",
    serviceNumber: "SRV-2026-00458",
    serviceName: "1 Gbps Campus Backhaul",
    scheduledDate: "2026-10-16",
    scheduledLabel: "16 Oct 2026",
    scheduledTime: "08:30",
    durationHours: 6,
    technician: "Technician A",
    status: "IN_PROGRESS",
    priority: "MEDIUM",
    checklist: checklist(["access", "contact", "survey", "route", "cpe", "materials", "technician", "date"], "Technician A", "Today", true),
    permitNotRequired: true,
    fieldChecklist: fieldChecklist(["appt", "access-check", "equipment-check", "materials-check", "route-check", "arrived", "induction"], "Today"),
    tests: [],
    acceptance: { status: "Pending", contact: "Campus Facilities", dateLabel: "—", method: "—", notes: "" },
    documents: defaultDocuments,
    timeline: [
      { id: "evt-225-2", summary: "Installation started", actorName: "Technician A", occurredLabel: "16 Oct 2026 08:40", category: "Execution" },
      { id: "evt-225-1", summary: "Technician arrived", actorName: "Technician A", occurredLabel: "16 Oct 2026 08:25", category: "Arrival" },
    ],
    notes: [],
    createdAt: "2026-10-08T09:00:00",
    createdLabel: "08 Oct 2026",
    updatedAt: "2026-10-16T08:40:00",
    updatedLabel: "16 Oct 2026",
  }),
  build({
    id: "ins-2026-00220",
    installationNumber: "INS-2026-00220",
    orderNumber: "ORD-2026-0144",
    siteId: "site-clinics",
    siteName: "Northern Clinics Polokwane",
    address: "Hospital Street, Polokwane",
    city: "Polokwane, Limpopo",
    siteContactName: "Clinic Manager",
    siteContactPhone: "+27 15 555 0190",
    accessHours: "07:00–16:00",
    accessRequirements: "Hospital visitor pass.",
    parking: "Staff parking is not available.",
    technicalRoom: "Admin wing comms room.",
    serviceId: "srv-2026-00470",
    serviceNumber: "SRV-2026-00470",
    serviceName: "200 Mbps Business Fibre",
    scheduledDate: "2026-10-21",
    scheduledLabel: "21 Oct 2026",
    scheduledTime: "09:00",
    durationHours: 3,
    technician: "Technician B",
    status: "READY",
    priority: "HIGH",
    checklist: checklist(["access", "contact", "survey", "route", "cpe", "materials", "technician", "permit", "date"], "Nomsa P.", "12 Oct 2026", true),
    permitNotRequired: true,
    fieldChecklist: fieldChecklist(["appt", "access-check", "equipment-check"], "12 Oct 2026"),
    tests: [],
    acceptance: { status: "Pending", contact: "Clinic Manager", dateLabel: "—", method: "—", notes: "" },
    documents: defaultDocuments,
    timeline: [
      { id: "evt-220-1", summary: "Installation marked ready", actorName: "Nomsa P.", occurredLabel: "12 Oct 2026 16:00", category: "Schedule" },
    ],
    notes: [],
    createdAt: "2026-10-12T10:00:00",
    createdLabel: "12 Oct 2026",
    updatedAt: "2026-10-12T16:00:00",
    updatedLabel: "12 Oct 2026",
  }),
  build({
    id: "ins-2026-00218",
    installationNumber: "INS-2026-00218",
    orderNumber: "ORD-2026-0129",
    siteId: "site-xyz-pop",
    siteName: "XYZ Telecom Metro PoP",
    address: "1 Fredman Drive, Sandton",
    city: "Sandton, Gauteng",
    siteContactName: "Lerato Nkosi",
    siteContactPhone: "+27 11 555 0122",
    accessHours: "00:00–24:00",
    accessRequirements: "PoP access card.",
    parking: "Basement contractor bay.",
    technicalRoom: "Meet-me room A.",
    serviceId: "srv-2026-00440",
    serviceNumber: "SRV-2026-00440",
    serviceName: "10 Gbps Wholesale Link",
    scheduledDate: "2026-10-14",
    scheduledLabel: "14 Oct 2026",
    scheduledTime: "13:00",
    durationHours: 4,
    technician: "Technician C",
    status: "TESTING",
    priority: "MEDIUM",
    checklist: checklist(["access", "contact", "survey", "route", "cpe", "materials", "technician", "permit", "date"], "Technician C", "Yesterday", true),
    permitNotRequired: true,
    fieldChecklist: fieldChecklist(["appt", "access-check", "equipment-check", "materials-check", "route-check", "arrived", "induction", "fibre-route", "cpe-installed", "terminated", "powered", "optical", "link"], "Yesterday"),
    tests: [
      { id: "tst-218-1", name: "Optical Power", result: "-16.2", unit: "dBm", outcome: "Pass", notes: "" },
      { id: "tst-218-2", name: "Link", result: "10", unit: "Gbps", outcome: "Pass", notes: "" },
    ],
    acceptance: { status: "Pending", contact: "Lerato Nkosi", dateLabel: "—", method: "—", notes: "" },
    documents: defaultDocuments,
    timeline: [
      { id: "evt-218-1", summary: "Testing started", actorName: "Technician C", occurredLabel: "14 Oct 2026 15:10", category: "Testing" },
    ],
    notes: [],
    createdAt: "2026-10-04T09:00:00",
    createdLabel: "04 Oct 2026",
    updatedAt: "2026-10-14T15:10:00",
    updatedLabel: "Yesterday",
  }),
  build({
    id: "ins-2026-00215",
    installationNumber: "INS-2026-00215",
    orderNumber: "ORD-2026-0137",
    siteId: "site-doe-hq",
    siteName: "Department of Education Head Office",
    address: "222 Struben Street, Pretoria",
    city: "Pretoria, Gauteng",
    siteContactName: "Nomsa Dlamini",
    siteContactPhone: "+27 12 555 0007",
    accessHours: "08:00–16:00",
    accessRequirements: "Government site induction.",
    parking: "Visitor parking on the south side.",
    technicalRoom: "Third floor network room.",
    serviceId: "srv-2026-00433",
    serviceNumber: "SRV-2026-00433",
    serviceName: "Multi-site Business Fibre",
    scheduledDate: "2026-10-13",
    scheduledLabel: "13 Oct 2026",
    scheduledTime: "08:00",
    durationHours: 5,
    technician: "Field Team 1",
    status: "CUSTOMER_ACCEPTANCE",
    priority: "HIGH",
    checklist: checklist(["access", "contact", "survey", "route", "cpe", "materials", "technician", "permit", "date"], "David K.", "13 Oct 2026"),
    fieldChecklist: fieldChecklist(["appt", "access-check", "equipment-check", "materials-check", "route-check", "arrived", "induction", "fibre-route", "cpe-installed", "terminated", "powered", "optical", "link", "throughput", "latency"], "13 Oct 2026"),
    tests: [
      { id: "tst-215-1", name: "Throughput", result: "940", unit: "Mbps", outcome: "Pass", notes: "Head office only." },
    ],
    acceptance: { status: "Pending", contact: "Nomsa Dlamini", dateLabel: "—", method: "—", notes: "" },
    documents: defaultDocuments,
    timeline: [
      { id: "evt-215-1", summary: "Testing completed", actorName: "Field Team 1", occurredLabel: "13 Oct 2026 14:30", category: "Testing" },
    ],
    notes: [],
    createdAt: "2026-10-02T08:00:00",
    createdLabel: "02 Oct 2026",
    updatedAt: "2026-10-13T14:30:00",
    updatedLabel: "13 Oct 2026",
  }),
  build({
    id: "ins-2026-00210",
    installationNumber: "INS-2026-00210",
    orderNumber: "ORD-2026-0122",
    siteId: "site-eastcape",
    siteName: "East Cape Cold Store",
    address: "Deal Party, Gqeberha",
    city: "Gqeberha, Eastern Cape",
    siteContactName: "Store Supervisor",
    siteContactPhone: "+27 41 555 0330",
    accessHours: "05:00–14:00",
    accessRequirements: "Cold-store PPE required.",
    parking: "Loading yard.",
    technicalRoom: "Office mezzanine.",
    serviceId: "srv-2026-00455",
    serviceNumber: "SRV-2026-00455",
    serviceName: "100 Mbps Business Fibre",
    scheduledDate: "2026-10-08",
    scheduledLabel: "8 Oct 2026",
    scheduledTime: "06:00",
    durationHours: 4,
    technician: "Technician A",
    status: "COMPLETED",
    priority: "LOW",
    checklist: checklist(["access", "contact", "survey", "route", "cpe", "materials", "technician", "permit", "date"], "David K.", "08 Oct 2026", true),
    permitNotRequired: true,
    fieldChecklist: fieldChecklist(FIELD_TEMPLATE.map((item) => item.id), "08 Oct 2026"),
    tests: [
      { id: "tst-210-1", name: "Link", result: "100", unit: "Mbps", outcome: "Pass", notes: "" },
    ],
    acceptance: { status: "Accepted", contact: "Store Supervisor", dateLabel: "8 Oct 2026", method: "On site", notes: "Accepted after the walkthrough." },
    documents: defaultDocuments,
    timeline: [
      { id: "evt-210-3", summary: "Installation completed", actorName: "Technician A", occurredLabel: "08 Oct 2026 11:20", category: "Completion" },
      { id: "evt-210-2", summary: "Customer acceptance received", actorName: "Store Supervisor", occurredLabel: "08 Oct 2026 11:05", category: "Acceptance" },
      { id: "evt-210-1", summary: "Installation started", actorName: "Technician A", occurredLabel: "08 Oct 2026 06:15", category: "Execution" },
    ],
    notes: [],
    createdAt: "2026-09-20T08:00:00",
    createdLabel: "20 Sep 2026",
    updatedAt: "2026-10-08T11:20:00",
    updatedLabel: "08 Oct 2026",
  }),
  build({
    id: "ins-2026-00208",
    installationNumber: "INS-2026-00208",
    orderNumber: "ORD-2026-0110",
    siteId: "site-kzn-schools",
    siteName: "KwaZulu Schools cluster",
    address: "Pinetown, KwaZulu-Natal",
    city: "Pinetown, KwaZulu-Natal",
    siteContactName: "District Office",
    siteContactPhone: "+27 31 555 0110",
    accessHours: "07:30–15:00",
    accessRequirements: "School access during term.",
    parking: "Street parking.",
    technicalRoom: "Admin office.",
    serviceId: "srv-2026-00412",
    serviceNumber: "SRV-2026-00412",
    serviceName: "100 Mbps School Fibre",
    scheduledDate: "2026-09-30",
    scheduledLabel: "30 Sep 2026",
    scheduledTime: "08:00",
    durationHours: 6,
    technician: "Field Team 2",
    status: "COMPLETED",
    priority: "LOW",
    checklist: checklist(["access", "contact", "survey", "route", "cpe", "materials", "technician", "permit", "date"], "David K.", "30 Sep 2026", true),
    permitNotRequired: true,
    fieldChecklist: fieldChecklist(FIELD_TEMPLATE.map((item) => item.id), "30 Sep 2026"),
    tests: [],
    acceptance: { status: "Accepted", contact: "District Office", dateLabel: "30 Sep 2026", method: "Email", notes: "" },
    documents: defaultDocuments,
    timeline: [
      { id: "evt-208-1", summary: "Installation completed", actorName: "Field Team 2", occurredLabel: "30 Sep 2026 15:00", category: "Completion" },
    ],
    notes: [],
    createdAt: "2026-09-01T08:00:00",
    createdLabel: "01 Sep 2026",
    updatedAt: "2026-09-30T15:00:00",
    updatedLabel: "30 Sep 2026",
  }),
  build({
    id: "ins-2026-00205",
    installationNumber: "INS-2026-00205",
    orderNumber: "ORD-2026-0108",
    siteId: "site-connectpro-lte",
    siteName: "ConnectPro overflow site",
    address: "Midrand",
    city: "Midrand, Gauteng",
    siteContactName: "Jason Naidoo",
    siteContactPhone: "+27 11 555 0211",
    accessHours: "08:00–17:00",
    accessRequirements: "None.",
    parking: "On site.",
    technicalRoom: "Not allocated.",
    serviceId: "srv-2026-00390",
    serviceNumber: "SRV-2026-00390",
    serviceName: "Temporary LTE Failover",
    scheduledDate: "2026-09-18",
    scheduledLabel: "18 Sep 2026",
    scheduledTime: "11:00",
    durationHours: 2,
    technician: "Unassigned",
    status: "CANCELLED",
    priority: "LOW",
    checklist: checklist([], "Sarah M.", "22 Sep 2026", true),
    permitNotRequired: true,
    fieldChecklist: fieldChecklist([], "22 Sep 2026"),
    tests: [],
    acceptance: { status: "Pending", contact: "Jason Naidoo", dateLabel: "—", method: "—", notes: "" },
    documents: defaultDocuments,
    timeline: [
      { id: "evt-205-1", summary: "Installation cancelled", actorName: "Sarah M.", occurredLabel: "22 Sep 2026 08:10", category: "Schedule" },
    ],
    notes: [{ id: "note-205-1", body: "Reseller withdrew the temporary failover request.", actorName: "Sarah M.", occurredLabel: "22 Sep 2026" }],
    createdAt: "2026-08-18T08:00:00",
    createdLabel: "18 Aug 2026",
    updatedAt: "2026-09-22T08:10:00",
    updatedLabel: "22 Sep 2026",
  }),
  build({
    id: "ins-2026-00234",
    installationNumber: "INS-2026-00234",
    orderNumber: "ORD-2026-0148",
    siteId: "site-highveld",
    siteName: "Highveld Shaft Site",
    address: "Witbank industrial belt",
    city: "Emalahleni, Mpumalanga",
    siteContactName: "Shaft Supervisor",
    siteContactPhone: "+27 13 555 0148",
    accessHours: "06:00–14:00",
    accessRequirements: "Mine induction and PPE.",
    parking: "Contractor yard.",
    technicalRoom: "Shaft office.",
    serviceId: "srv-2026-00480",
    serviceNumber: "SRV-2026-00480",
    serviceName: "100 Mbps Dedicated Fibre",
    scheduledDate: "2026-11-06",
    scheduledLabel: "6 Nov 2026",
    scheduledTime: "06:30",
    durationHours: 6,
    technician: "Unassigned",
    status: "PREPARATION",
    priority: "MEDIUM",
    checklist: checklist(["survey"], "Sarah M.", "Yesterday"),
    fieldChecklist: fieldChecklist([], "Yesterday"),
    tests: [],
    acceptance: { status: "Pending", contact: "Shaft Supervisor", dateLabel: "—", method: "—", notes: "" },
    documents: defaultDocuments,
    timeline: [
      { id: "evt-234-1", summary: "Installation opened for preparation", actorName: "Sarah M.", occurredLabel: "13 Oct 2026 15:30", category: "Schedule" },
    ],
    notes: [],
    createdAt: "2026-10-13T15:30:00",
    createdLabel: "13 Oct 2026",
    updatedAt: "2026-10-14T09:00:00",
    updatedLabel: "Yesterday",
  }),
];

export function getDemoInstallation(id: string) {
  return demoInstallations.find((item) => item.id === id);
}

export function nextInstallationNumber(installations: InstallationRecord[]) {
  const highest = installations.reduce((max, item) => {
    const suffix = Number(item.installationNumber.split("-").at(-1));

    return Number.isFinite(suffix) ? Math.max(max, suffix) : max;
  }, 0);

  return `INS-2026-${String(highest + 1).padStart(5, "0")}`;
}

export function blankChecklist(ownerName: string): ReadinessItem[] {
  return checklist(["date"], ownerName, "Today", true);
}

export function blankFieldChecklist(): FieldCheck[] {
  return fieldChecklist([], "Today");
}
