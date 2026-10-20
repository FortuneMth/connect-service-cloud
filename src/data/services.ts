import { DEMO_ORGANISATION_ID } from "@/data/customers";
import { demoOrders } from "@/data/orders";

export const SERVICE_TODAY = "2026-10-15";

export const SERVICE_STATUSES = [
  "PENDING",
  "PROVISIONING",
  "TESTING",
  "LIVE",
  "AT_RISK",
  "SUSPENDED",
  "CANCELLED",
] as const;

export type ServiceStatus = (typeof SERVICE_STATUSES)[number];

export const SERVICE_STATUS_LABEL: Record<ServiceStatus, string> = {
  PENDING: "Pending",
  PROVISIONING: "Provisioning",
  TESTING: "Testing",
  LIVE: "Live",
  AT_RISK: "At Risk",
  SUSPENDED: "Suspended",
  CANCELLED: "Cancelled",
};

export const HEALTH_STATES = ["HEALTHY", "DEGRADED", "DOWN", "UNKNOWN"] as const;

export type HealthState = (typeof HEALTH_STATES)[number];

export const HEALTH_LABEL: Record<HealthState, string> = {
  HEALTHY: "Healthy",
  DEGRADED: "Degraded",
  DOWN: "Down",
  UNKNOWN: "Unknown",
};

export const CHECK_OUTCOMES = ["HEALTHY", "DEGRADED", "DOWN"] as const;

export type CheckOutcome = (typeof CHECK_OUTCOMES)[number];

export const ACCESS_TYPES = ["Fibre", "Dark fibre", "Wi-Fi", "LTE"] as const;

export type AccessType = (typeof ACCESS_TYPES)[number];

export const SERVICE_TERMS = ["12", "24", "36"] as const;

export type ServiceCheck = {
  id: string;
  name: string;
  result: string;
  outcome: CheckOutcome;
  notes: string;
};

export type ServiceEvent = {
  id: string;
  summary: string;
  actorName: string;
  occurredLabel: string;
  category: string;
};

export type ServiceNote = {
  id: string;
  body: string;
  actorName: string;
  occurredLabel: string;
};

export type ServiceRecord = {
  id: string;
  organisationId: string;
  serviceNumber: string;
  customerId: string;
  customerName: string;
  siteId: string;
  siteName: string;
  address: string;
  orderId: string;
  orderNumber: string;
  installationId: string;
  installationNumber: string;
  product: string;
  bandwidth: string;
  accessType: AccessType;
  monthly: number;
  termMonths: number;
  status: ServiceStatus;
  health: HealthState;
  risk: string;
  circuitId: string;
  pop: string;
  vlan: string;
  ipAddress: string;
  cpe: string;
  activatedDate: string;
  activatedLabel: string;
  ownerName: string;
  checks: ServiceCheck[];
  timeline: ServiceEvent[];
  notes: ServiceNote[];
  createdAt: string;
  updatedAt: string;
  updatedLabel: string;
};

export const serviceKpis = [
  {
    id: "live",
    label: "Live Services",
    value: "42",
    supporting: "R 1.86M monthly",
    tone: "positive",
  },
  {
    id: "pending",
    label: "Pending Activation",
    value: "6",
    supporting: "2 awaiting acceptance",
    tone: "attention",
  },
  {
    id: "risk",
    label: "At Risk",
    value: "3",
    supporting: "1 degraded circuit",
    tone: "attention",
  },
  {
    id: "suspended",
    label: "Suspended",
    value: "2",
    supporting: "billing hold",
    tone: "neutral",
  },
] as const;

export const servicePipeline: { status: ServiceStatus; count: number; highPriority: number }[] = [
  { status: "PENDING", count: 8, highPriority: 2 },
  { status: "PROVISIONING", count: 5, highPriority: 1 },
  { status: "TESTING", count: 4, highPriority: 1 },
  { status: "LIVE", count: 42, highPriority: 0 },
  { status: "AT_RISK", count: 3, highPriority: 2 },
  { status: "SUSPENDED", count: 2, highPriority: 0 },
  { status: "CANCELLED", count: 1, highPriority: 0 },
];

export function serviceStatusSummary(status: ServiceStatus) {
  if (status === "LIVE") return "Service activated";
  if (status === "SUSPENDED") return "Service suspended";
  if (status === "CANCELLED") return "Service cancelled";
  if (status === "TESTING") return "Service testing started";
  if (status === "PROVISIONING") return "Provisioning started";
  if (status === "AT_RISK") return "Service marked at risk";

  return "Service returned to pending";
}

export function nextServiceNumber(services: { serviceNumber: string }[]) {
  const highest = services.reduce((max, item) => {
    const suffix = Number(item.serviceNumber.split("-").at(-1) ?? 0);

    return Number.isFinite(suffix) ? Math.max(max, suffix) : max;
  }, 0);

  return `SRV-2026-${String(highest + 1).padStart(5, "0")}`;
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
  };
}

function record(
  input: Omit<ServiceRecord, "organisationId" | "orderId" | "customerId" | "customerName"> & {
    orderNumber: string;
  },
): ServiceRecord {
  return {
    organisationId: DEMO_ORGANISATION_ID,
    ...orderRef(input.orderNumber),
    ...input,
  };
}

export const demoServices: ServiceRecord[] = [
  record({
    id: "srv-2026-00490",
    serviceNumber: "SRV-2026-00490",
    orderNumber: "ORD-2026-0118",
    siteId: "site-horizon-sandton",
    siteName: "Horizon Retail Group — Sandton Branch",
    address: "Sandton, Johannesburg",
    installationId: "ins-2026-00232",
    installationNumber: "INS-2026-00232",
    product: "200 Mbps Business Fibre",
    bandwidth: "200 Mbps",
    accessType: "Fibre",
    monthly: 4200,
    termMonths: 24,
    status: "TESTING",
    health: "HEALTHY",
    risk: "Customer acceptance pending.",
    circuitId: "CSC-JNB-4490",
    pop: "Sandton POP",
    vlan: "214",
    ipAddress: "10.48.12.2/30",
    cpe: "Nokia XS-250X",
    activatedDate: "",
    activatedLabel: "—",
    ownerName: "Michael R.",
    checks: [
      { id: "chk-490-1", name: "Optical power", result: "-19.2 dBm", outcome: "HEALTHY", notes: "" },
      { id: "chk-490-2", name: "Link", result: "200 Mbps", outcome: "HEALTHY", notes: "" },
      { id: "chk-490-3", name: "Throughput", result: "196 Mbps", outcome: "HEALTHY", notes: "" },
    ],
    timeline: [
      { id: "evt-490-2", summary: "Acceptance tests passed", actorName: "Installation Team", occurredLabel: "15 Oct 2026 11:40", category: "Testing" },
      { id: "evt-490-1", summary: "Service created from ORD-2026-0118", actorName: "Michael R.", occurredLabel: "11 Oct 2026", category: "Provisioning" },
    ],
    notes: [
      {
        id: "note-490-1",
        body: "Store manager will sign acceptance after the 09:00 installation window.",
        actorName: "Michael R.",
        occurredLabel: "14 Oct 2026",
      },
    ],
    createdAt: "2026-10-11T09:00:00",
    updatedAt: "2026-10-15T11:40:00",
    updatedLabel: "Today",
  }),
  record({
    id: "srv-2026-00421",
    serviceNumber: "SRV-2026-00421",
    orderNumber: "ORD-2026-0142",
    siteId: "site-abc-hq",
    siteName: "ABC Manufacturing HQ",
    address: "14 Main Reef Road, Johannesburg",
    installationId: "ins-2026-00231",
    installationNumber: "INS-2026-00231",
    product: "1 Gbps Dedicated Fibre",
    bandwidth: "1 Gbps",
    accessType: "Fibre",
    monthly: 18500,
    termMonths: 36,
    status: "PROVISIONING",
    health: "UNKNOWN",
    risk: "Site access pending.",
    circuitId: "CSC-JNB-4421",
    pop: "Johannesburg POP",
    vlan: "118",
    ipAddress: "10.18.4.2/30",
    cpe: "Reserved",
    activatedDate: "",
    activatedLabel: "—",
    ownerName: "Sarah M.",
    checks: [],
    timeline: [
      { id: "evt-421-2", summary: "Circuit reserved on the Johannesburg POP", actorName: "Network Planning", occurredLabel: "10 Oct 2026", category: "Provisioning" },
      { id: "evt-421-1", summary: "Service created from ORD-2026-0142", actorName: "Sarah M.", occurredLabel: "02 Oct 2026", category: "Provisioning" },
    ],
    notes: [
      {
        id: "note-421-1",
        body: "Activation stays on 22 Oct until site access is confirmed.",
        actorName: "Sarah M.",
        occurredLabel: "14 Oct 2026",
      },
    ],
    createdAt: "2026-10-02T09:10:00",
    updatedAt: "2026-10-14T09:40:00",
    updatedLabel: "14 Oct 2026",
  }),
  record({
    id: "srv-2026-00476",
    serviceNumber: "SRV-2026-00476",
    orderNumber: "ORD-2026-0134",
    siteId: "site-connectpro-durban",
    siteName: "ConnectPro Resellers — Durban POP",
    address: "Durban, KwaZulu-Natal",
    installationId: "ins-2026-00233",
    installationNumber: "INS-2026-00233",
    product: "500 Mbps Business Fibre",
    bandwidth: "500 Mbps",
    accessType: "Fibre",
    monthly: 24000,
    termMonths: 24,
    status: "TESTING",
    health: "DEGRADED",
    risk: "Two sites still need a retest.",
    circuitId: "CSC-DBN-4476",
    pop: "Durban POP",
    vlan: "320",
    ipAddress: "10.76.2.2/30",
    cpe: "Calix 716GE",
    activatedDate: "",
    activatedLabel: "—",
    ownerName: "Sarah M.",
    checks: [
      { id: "chk-476-1", name: "Link", result: "18 of 20 sites", outcome: "DEGRADED", notes: "Two sites failed the retest." },
    ],
    timeline: [
      { id: "evt-476-2", summary: "Retest required on two reseller sites", actorName: "Field Team 2", occurredLabel: "14 Oct 2026", category: "Testing" },
      { id: "evt-476-1", summary: "Service created from ORD-2026-0134", actorName: "Sarah M.", occurredLabel: "22 Sep 2026", category: "Provisioning" },
    ],
    notes: [],
    createdAt: "2026-09-22T08:00:00",
    updatedAt: "2026-10-14T16:10:00",
    updatedLabel: "14 Oct 2026",
  }),
  record({
    id: "srv-2026-00440",
    serviceNumber: "SRV-2026-00440",
    orderNumber: "ORD-2026-0129",
    siteId: "site-xyz-pop",
    siteName: "XYZ Telecom Metro PoP",
    address: "Isando, Johannesburg",
    installationId: "ins-2026-00218",
    installationNumber: "INS-2026-00218",
    product: "10 Gbps Wholesale Link",
    bandwidth: "10 Gbps",
    accessType: "Fibre",
    monthly: 48000,
    termMonths: 36,
    status: "TESTING",
    health: "UNKNOWN",
    risk: "Interconnect window not confirmed.",
    circuitId: "CSC-JNB-4440",
    pop: "Isando interconnect",
    vlan: "4001",
    ipAddress: "10.40.1.2/31",
    cpe: "Juniper ACX710",
    activatedDate: "",
    activatedLabel: "—",
    ownerName: "Michael R.",
    checks: [],
    timeline: [
      { id: "evt-440-1", summary: "Service created from ORD-2026-0129", actorName: "Michael R.", occurredLabel: "18 Sep 2026", category: "Provisioning" },
    ],
    notes: [],
    createdAt: "2026-09-18T10:00:00",
    updatedAt: "2026-10-13T16:10:00",
    updatedLabel: "13 Oct 2026",
  }),
  record({
    id: "srv-2026-00433",
    serviceNumber: "SRV-2026-00433",
    orderNumber: "ORD-2026-0137",
    siteId: "site-doe-hq",
    siteName: "Department of Education Head Office",
    address: "Pretoria, Gauteng",
    installationId: "ins-2026-00215",
    installationNumber: "INS-2026-00215",
    product: "Multi-site Business Fibre",
    bandwidth: "200 Mbps",
    accessType: "Fibre",
    monthly: 86000,
    termMonths: 36,
    status: "TESTING",
    health: "HEALTHY",
    risk: "Customer acceptance pending.",
    circuitId: "CSC-PTA-4433",
    pop: "Pretoria POP",
    vlan: "137",
    ipAddress: "10.33.8.2/30",
    cpe: "Nokia XS-250X",
    activatedDate: "",
    activatedLabel: "—",
    ownerName: "David K.",
    checks: [
      { id: "chk-433-1", name: "Throughput", result: "940 Mbps", outcome: "HEALTHY", notes: "Head office only." },
    ],
    timeline: [
      { id: "evt-433-1", summary: "Head office tests passed", actorName: "Field Team 1", occurredLabel: "13 Oct 2026 14:30", category: "Testing" },
    ],
    notes: [],
    createdAt: "2026-09-28T08:00:00",
    updatedAt: "2026-10-13T14:30:00",
    updatedLabel: "13 Oct 2026",
  }),
  record({
    id: "srv-2026-00458",
    serviceNumber: "SRV-2026-00458",
    orderNumber: "ORD-2026-0131",
    siteId: "site-urbangrid",
    siteName: "UrbanGrid Campus",
    address: "Lynnwood, Pretoria",
    installationId: "ins-2026-00225",
    installationNumber: "INS-2026-00225",
    product: "1 Gbps Campus Backhaul",
    bandwidth: "1 Gbps",
    accessType: "Fibre",
    monthly: 12500,
    termMonths: 24,
    status: "PROVISIONING",
    health: "UNKNOWN",
    risk: "",
    circuitId: "CSC-PTA-4458",
    pop: "Lynnwood POP",
    vlan: "458",
    ipAddress: "10.58.1.2/30",
    cpe: "On site",
    activatedDate: "",
    activatedLabel: "—",
    ownerName: "Michael R.",
    checks: [],
    timeline: [
      { id: "evt-458-1", summary: "Provisioning started", actorName: "Network Planning", occurredLabel: "16 Oct 2026", category: "Provisioning" },
    ],
    notes: [],
    createdAt: "2026-09-16T08:00:00",
    updatedAt: "2026-10-15T08:30:00",
    updatedLabel: "Today",
  }),
  record({
    id: "srv-2026-00470",
    serviceNumber: "SRV-2026-00470",
    orderNumber: "ORD-2026-0144",
    siteId: "site-clinics",
    siteName: "Northern Clinics Polokwane",
    address: "Polokwane, Limpopo",
    installationId: "ins-2026-00220",
    installationNumber: "INS-2026-00220",
    product: "200 Mbps Business Fibre",
    bandwidth: "200 Mbps",
    accessType: "Fibre",
    monthly: 3900,
    termMonths: 24,
    status: "PENDING",
    health: "UNKNOWN",
    risk: "",
    circuitId: "—",
    pop: "Polokwane POP",
    vlan: "—",
    ipAddress: "—",
    cpe: "Pending",
    activatedDate: "",
    activatedLabel: "—",
    ownerName: "Nomsa P.",
    checks: [],
    timeline: [
      { id: "evt-470-1", summary: "Service created from ORD-2026-0144", actorName: "Nomsa P.", occurredLabel: "09 Oct 2026", category: "Provisioning" },
    ],
    notes: [],
    createdAt: "2026-10-09T09:00:00",
    updatedAt: "2026-10-12T10:00:00",
    updatedLabel: "12 Oct 2026",
  }),
  record({
    id: "srv-2026-00462",
    serviceNumber: "SRV-2026-00462",
    orderNumber: "ORD-2026-0104",
    siteId: "site-bluewave-depot",
    siteName: "BlueWave Depot",
    address: "Epping, Cape Town",
    installationId: "ins-2026-00228",
    installationNumber: "INS-2026-00228",
    product: "200 Mbps Business Fibre",
    bandwidth: "200 Mbps",
    accessType: "Fibre",
    monthly: 3600,
    termMonths: 24,
    status: "PENDING",
    health: "UNKNOWN",
    risk: "Work permit outstanding.",
    circuitId: "—",
    pop: "Cape Town POP",
    vlan: "—",
    ipAddress: "—",
    cpe: "Ready",
    activatedDate: "",
    activatedLabel: "—",
    ownerName: "Sarah M.",
    checks: [],
    timeline: [
      { id: "evt-462-1", summary: "Service held for the depot work permit", actorName: "Sarah M.", occurredLabel: "09 Oct 2026", category: "Provisioning" },
    ],
    notes: [],
    createdAt: "2026-08-20T08:00:00",
    updatedAt: "2026-10-15T07:10:00",
    updatedLabel: "Today",
  }),
  record({
    id: "srv-2026-00480",
    serviceNumber: "SRV-2026-00480",
    orderNumber: "ORD-2026-0148",
    siteId: "site-highveld",
    siteName: "Highveld Shaft Site",
    address: "Witbank, Mpumalanga",
    installationId: "ins-2026-00234",
    installationNumber: "INS-2026-00234",
    product: "100 Mbps Dedicated Fibre",
    bandwidth: "100 Mbps",
    accessType: "Fibre",
    monthly: 5100,
    termMonths: 36,
    status: "PENDING",
    health: "UNKNOWN",
    risk: "Work permit outstanding.",
    circuitId: "—",
    pop: "Witbank POP",
    vlan: "—",
    ipAddress: "—",
    cpe: "Pending",
    activatedDate: "",
    activatedLabel: "—",
    ownerName: "Sarah M.",
    checks: [],
    timeline: [
      { id: "evt-480-1", summary: "Service created from ORD-2026-0148", actorName: "Sarah M.", occurredLabel: "13 Oct 2026", category: "Provisioning" },
    ],
    notes: [],
    createdAt: "2026-10-13T08:00:00",
    updatedAt: "2026-10-13T08:00:00",
    updatedLabel: "13 Oct 2026",
  }),
  record({
    id: "srv-2026-00455",
    serviceNumber: "SRV-2026-00455",
    orderNumber: "ORD-2026-0122",
    siteId: "site-eastcape",
    siteName: "East Cape Cold Store",
    address: "Deal Party, Gqeberha",
    installationId: "ins-2026-00210",
    installationNumber: "INS-2026-00210",
    product: "100 Mbps Business Fibre",
    bandwidth: "100 Mbps",
    accessType: "Fibre",
    monthly: 2800,
    termMonths: 24,
    status: "LIVE",
    health: "HEALTHY",
    risk: "",
    circuitId: "CSC-PLZ-4455",
    pop: "Gqeberha POP",
    vlan: "155",
    ipAddress: "10.55.4.2/30",
    cpe: "Nokia XS-250X",
    activatedDate: "2026-10-08",
    activatedLabel: "8 Oct 2026",
    ownerName: "David K.",
    checks: [
      { id: "chk-455-1", name: "Link", result: "100 Mbps", outcome: "HEALTHY", notes: "" },
    ],
    timeline: [
      { id: "evt-455-2", summary: "Service activated", actorName: "David K.", occurredLabel: "08 Oct 2026 11:20", category: "Activation" },
      { id: "evt-455-1", summary: "Customer acceptance received", actorName: "Store Supervisor", occurredLabel: "08 Oct 2026 11:05", category: "Acceptance" },
    ],
    notes: [],
    createdAt: "2026-08-12T08:00:00",
    updatedAt: "2026-10-08T11:20:00",
    updatedLabel: "08 Oct 2026",
  }),
  record({
    id: "srv-2026-00412",
    serviceNumber: "SRV-2026-00412",
    orderNumber: "ORD-2026-0110",
    siteId: "site-kzn-schools",
    siteName: "KwaZulu Schools cluster",
    address: "Pinetown, KwaZulu-Natal",
    installationId: "ins-2026-00208",
    installationNumber: "INS-2026-00208",
    product: "100 Mbps School Fibre",
    bandwidth: "100 Mbps",
    accessType: "Fibre",
    monthly: 9600,
    termMonths: 36,
    status: "LIVE",
    health: "HEALTHY",
    risk: "",
    circuitId: "CSC-DBN-4412",
    pop: "Pinetown POP",
    vlan: "412",
    ipAddress: "10.12.9.2/30",
    cpe: "Calix 716GE",
    activatedDate: "2026-09-30",
    activatedLabel: "30 Sep 2026",
    ownerName: "David K.",
    checks: [
      { id: "chk-412-1", name: "Link", result: "100 Mbps", outcome: "HEALTHY", notes: "Cluster handover." },
    ],
    timeline: [
      { id: "evt-412-1", summary: "Service activated", actorName: "David K.", occurredLabel: "30 Sep 2026", category: "Activation" },
    ],
    notes: [],
    createdAt: "2026-07-04T08:00:00",
    updatedAt: "2026-09-30T15:00:00",
    updatedLabel: "30 Sep 2026",
  }),
  record({
    id: "srv-2026-00402",
    serviceNumber: "SRV-2026-00402",
    orderNumber: "ORD-2026-0126",
    siteId: "site-signalpath-metro",
    siteName: "SignalPath Metro Route",
    address: "Rosebank to Sandton",
    installationId: "",
    installationNumber: "",
    product: "Metro Dark Fibre Pair",
    bandwidth: "Dark fibre pair",
    accessType: "Dark fibre",
    monthly: 22000,
    termMonths: 36,
    status: "AT_RISK",
    health: "DEGRADED",
    risk: "Municipal wayleave outstanding.",
    circuitId: "CSC-JNB-4402",
    pop: "Rosebank POP",
    vlan: "—",
    ipAddress: "—",
    cpe: "Not required",
    activatedDate: "",
    activatedLabel: "—",
    ownerName: "Michael R.",
    checks: [],
    timeline: [
      { id: "evt-402-1", summary: "Build stopped for the municipal wayleave", actorName: "Michael R.", occurredLabel: "13 Oct 2026", category: "Risk" },
    ],
    notes: [],
    createdAt: "2026-09-14T08:00:00",
    updatedAt: "2026-10-13T13:40:00",
    updatedLabel: "13 Oct 2026",
  }),
  record({
    id: "srv-2026-00388",
    serviceNumber: "SRV-2026-00388",
    orderNumber: "ORD-2026-0116",
    siteId: "site-horizon-wifi",
    siteName: "Horizon Sandton",
    address: "Sandton City, Johannesburg",
    installationId: "",
    installationNumber: "",
    product: "Guest Access Wi-Fi",
    bandwidth: "Guest Wi-Fi",
    accessType: "Wi-Fi",
    monthly: 1800,
    termMonths: 12,
    status: "SUSPENDED",
    health: "UNKNOWN",
    risk: "Paused until the Sandton store refit is complete.",
    circuitId: "CSC-JNB-3388",
    pop: "Sandton POP",
    vlan: "88",
    ipAddress: "10.88.1.2/29",
    cpe: "In store",
    activatedDate: "",
    activatedLabel: "—",
    ownerName: "Michael R.",
    checks: [],
    timeline: [
      { id: "evt-388-1", summary: "Service suspended", actorName: "Michael R.", occurredLabel: "09 Oct 2026", category: "Status" },
    ],
    notes: [
      {
        id: "note-388-1",
        body: "Customer asked to pause the guest network until the store refit is finished.",
        actorName: "Michael R.",
        occurredLabel: "09 Oct 2026",
      },
    ],
    createdAt: "2026-09-01T08:00:00",
    updatedAt: "2026-10-09T11:20:00",
    updatedLabel: "09 Oct 2026",
  }),
  record({
    id: "srv-2026-00390",
    serviceNumber: "SRV-2026-00390",
    orderNumber: "ORD-2026-0108",
    siteId: "site-connectpro-lte",
    siteName: "ConnectPro overflow site",
    address: "Durban, KwaZulu-Natal",
    installationId: "ins-2026-00205",
    installationNumber: "INS-2026-00205",
    product: "Temporary LTE Failover",
    bandwidth: "LTE failover",
    accessType: "LTE",
    monthly: 1500,
    termMonths: 12,
    status: "CANCELLED",
    health: "UNKNOWN",
    risk: "",
    circuitId: "—",
    pop: "Durban POP",
    vlan: "—",
    ipAddress: "—",
    cpe: "Returned",
    activatedDate: "",
    activatedLabel: "—",
    ownerName: "Sarah M.",
    checks: [],
    timeline: [
      { id: "evt-390-1", summary: "Service cancelled", actorName: "Sarah M.", occurredLabel: "22 Sep 2026", category: "Status" },
    ],
    notes: [],
    createdAt: "2026-08-18T08:00:00",
    updatedAt: "2026-09-22T10:00:00",
    updatedLabel: "22 Sep 2026",
  }),
];

export function getDemoService(id: string) {
  return demoServices.find((service) => service.id === id);
}
