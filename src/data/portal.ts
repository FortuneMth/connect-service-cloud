export const PORTAL_TODAY = "2026-10-22";

export const DELIVERY_STAGE_KEYS = [
  "ORDER_CONFIRMED",
  "VALIDATION",
  "FEASIBILITY",
  "PLANNING",
  "BUILD",
  "INSTALLATION",
  "TESTING",
  "ACTIVATION",
  "SERVICE_LIVE",
] as const;

export type DeliveryStageKey = (typeof DELIVERY_STAGE_KEYS)[number];

export const STAGE_STATE = ["COMPLETED", "IN_PROGRESS", "UPCOMING"] as const;
export type StageState = (typeof STAGE_STATE)[number];

export const DELIVERY_HEALTH = ["ON_TRACK", "AT_RISK", "DELAYED", "COMPLETED"] as const;
export type DeliveryHealth = (typeof DELIVERY_HEALTH)[number];

export const ESCALATION_REASONS = [
  "No progress / no update",
  "Delivery delayed",
  "Installation issue",
  "Technical issue",
  "Site issue",
  "Other",
] as const;

export type EscalationReason = (typeof ESCALATION_REASONS)[number];

export const CONTACT_PREFERENCES = ["Email", "Phone", "Either"] as const;
export type ContactPreference = (typeof CONTACT_PREFERENCES)[number];

export const ESCALATION_STATUSES = ["OPEN", "ACKNOWLEDGED", "IN_PROGRESS", "RESOLVED"] as const;
export type EscalationStatus = (typeof ESCALATION_STATUSES)[number];

export const ESCALATION_STATUS_LABEL: Record<EscalationStatus, string> = {
  OPEN: "Open",
  ACKNOWLEDGED: "Acknowledged",
  IN_PROGRESS: "In Progress",
  RESOLVED: "Resolved",
};

export const DELIVERY_HEALTH_LABEL: Record<DeliveryHealth, string> = {
  ON_TRACK: "On Track",
  AT_RISK: "At Risk",
  DELAYED: "Delayed",
  COMPLETED: "Completed",
};

export const DELIVERY_HEALTH_COPY: Record<DeliveryHealth, string> = {
  ON_TRACK: "Your order is progressing within the expected delivery timeframe.",
  AT_RISK: "Your order is taking longer than expected. Our delivery team is reviewing the next steps.",
  DELAYED: "We haven't received a progress update within the expected timeframe.",
  COMPLETED: "Your connectivity service is live.",
};

/** Customer-facing stage names */
export const STAGE_CUSTOMER_LABEL: Record<DeliveryStageKey, string> = {
  ORDER_CONFIRMED: "Order confirmed",
  VALIDATION: "Checking your order details",
  FEASIBILITY: "Checking whether your site is ready for service",
  PLANNING: "Planning your connectivity",
  BUILD: "Preparing your service",
  INSTALLATION: "Installing at your site",
  TESTING: "Testing your connection",
  ACTIVATION: "Turning your service on",
  SERVICE_LIVE: "Service live",
};

/** Short labels for compact UI */
export const STAGE_SHORT_LABEL: Record<DeliveryStageKey, string> = {
  ORDER_CONFIRMED: "Order confirmed",
  VALIDATION: "Validation",
  FEASIBILITY: "Site readiness",
  PLANNING: "Planning",
  BUILD: "Preparing service",
  INSTALLATION: "Installation",
  TESTING: "Testing",
  ACTIVATION: "Activation",
  SERVICE_LIVE: "Service live",
};

export type DeliveryStage = {
  key: DeliveryStageKey;
  state: StageState;
  startLabel: string;
  completedLabel: string;
  expectedDuration: string;
  actualDuration: string;
  explanation: string;
};

export type DeliveryUpdate = {
  id: string;
  occurredAt: string;
  occurredLabel: string;
  summary: string;
  actorName: string;
  customerVisible: boolean;
};

export type StageDurationGuide = {
  key: DeliveryStageKey;
  label: string;
  expected: string;
};

export type PortalDelivery = {
  id: string;
  orderId: string;
  orderNumber: string;
  customerId: string;
  customerName: string;
  siteName: string;
  title: string;
  product: string;
  currentStage: DeliveryStageKey;
  health: DeliveryHealth;
  ownerName: string;
  ownerTeam: string;
  lastUpdatedAt: string;
  lastUpdatedLabel: string;
  nextUpdateLabel: string;
  estimatedCompletionLabel: string;
  estimatedTotalLabel: string;
  elapsedBusinessDays: number;
  remainingLabel: string;
  stages: DeliveryStage[];
  durationGuide: StageDurationGuide[];
  updates: DeliveryUpdate[];
};

export type EscalationNote = {
  id: string;
  body: string;
  actorName: string;
  occurredLabel: string;
  customerVisible: boolean;
};

export type PortalEscalation = {
  id: string;
  reference: string;
  orderId: string;
  orderNumber: string;
  customerId: string;
  customerName: string;
  stage: DeliveryStageKey;
  reason: EscalationReason;
  message: string;
  contactPreference: ContactPreference;
  priority: "HIGH" | "MEDIUM" | "LOW";
  status: EscalationStatus;
  assignedTo: string;
  expectedResponse: string;
  submittedAt: string;
  submittedLabel: string;
  notes: EscalationNote[];
};

export const defaultDurationGuide: StageDurationGuide[] = [
  { key: "VALIDATION", label: "Validation", expected: "1–2 days" },
  { key: "FEASIBILITY", label: "Site readiness", expected: "2–5 days" },
  { key: "PLANNING", label: "Planning", expected: "2–3 days" },
  { key: "BUILD", label: "Preparing service", expected: "3–5 days" },
  { key: "INSTALLATION", label: "Installation", expected: "1–3 days" },
  { key: "TESTING", label: "Testing", expected: "1 day" },
  { key: "ACTIVATION", label: "Activation", expected: "1 day" },
];

function stageFraction(stage: DeliveryStage) {
  if (stage.state === "COMPLETED") return 1;
  if (stage.state === "UPCOMING") return 0;

  const expected = stage.expectedDuration.match(/(\d+)/g);
  if (!expected) return 0.5;

  const mid = expected.length === 1 ? Number(expected[0]) : (Number(expected[0]) + Number(expected[1])) / 2;
  if (!mid) return 0.5;

  const actualMatch = stage.actualDuration.match(/(\d+)/);
  const elapsed = actualMatch ? Number(actualMatch[1]) : mid;
  return Math.min(1, Math.max(0.15, elapsed / mid));
}

/** Progress from stage journey — current stage contributes a partial amount. */
export function deliveryProgress(delivery: PortalDelivery) {
  if (delivery.health === "COMPLETED" || delivery.currentStage === "SERVICE_LIVE") {
    return 100;
  }

  const currentIndex = delivery.stages.findIndex((stage) => stage.key === delivery.currentStage);
  if (currentIndex < 0) return 0;

  const lastIndex = delivery.stages.length - 1;
  const fraction = stageFraction(delivery.stages[currentIndex]!);
  return Math.round(((currentIndex + fraction) / lastIndex) * 100);
}

export function deliveryHealthTone(health: DeliveryHealth) {
  if (health === "ON_TRACK") return "success";
  if (health === "AT_RISK") return "warning";
  if (health === "DELAYED") return "danger";
  return "neutral";
}

export function nextEscalationReference(escalations: { reference: string }[]) {
  const highest = escalations.reduce((max, item) => {
    const suffix = Number(item.reference.split("-").at(-1) ?? 0);
    return Number.isFinite(suffix) ? Math.max(max, suffix) : max;
  }, 41);

  return `ESC-2026-${String(highest + 1).padStart(4, "0")}`;
}

const abcStages: DeliveryStage[] = [
  {
    key: "ORDER_CONFIRMED",
    state: "COMPLETED",
    startLabel: "10 Oct 2026",
    completedLabel: "10 Oct 2026",
    expectedDuration: "1 day",
    actualDuration: "1 day",
    explanation: "Your order was confirmed and accepted into delivery.",
  },
  {
    key: "VALIDATION",
    state: "COMPLETED",
    startLabel: "10 Oct 2026",
    completedLabel: "11 Oct 2026",
    expectedDuration: "1–2 days",
    actualDuration: "1 day",
    explanation: "We checked your order details and contacts.",
  },
  {
    key: "FEASIBILITY",
    state: "COMPLETED",
    startLabel: "11 Oct 2026",
    completedLabel: "13 Oct 2026",
    expectedDuration: "2–5 days",
    actualDuration: "2 days",
    explanation: "We confirmed your site can take the new service.",
  },
  {
    key: "PLANNING",
    state: "COMPLETED",
    startLabel: "13 Oct 2026",
    completedLabel: "15 Oct 2026",
    expectedDuration: "2–3 days",
    actualDuration: "2 days",
    explanation: "Your connectivity path and installation plan were prepared.",
  },
  {
    key: "BUILD",
    state: "COMPLETED",
    startLabel: "15 Oct 2026",
    completedLabel: "19 Oct 2026",
    expectedDuration: "3–5 days",
    actualDuration: "4 days",
    explanation: "Your service was prepared on the network.",
  },
  {
    key: "INSTALLATION",
    state: "IN_PROGRESS",
    startLabel: "20 Oct 2026",
    completedLabel: "",
    expectedDuration: "2–3 days",
    actualDuration: "3 days so far",
    explanation: "Our team is installing and completing work at your site. Expected completion 22 October.",
  },
  {
    key: "TESTING",
    state: "UPCOMING",
    startLabel: "",
    completedLabel: "",
    expectedDuration: "1 day",
    actualDuration: "",
    explanation: "We will test speed, stability, and handover readiness.",
  },
  {
    key: "ACTIVATION",
    state: "UPCOMING",
    startLabel: "",
    completedLabel: "",
    expectedDuration: "1 day",
    actualDuration: "",
    explanation: "Your service will be turned on for day-to-day use.",
  },
  {
    key: "SERVICE_LIVE",
    state: "UPCOMING",
    startLabel: "",
    completedLabel: "",
    expectedDuration: "",
    actualDuration: "",
    explanation: "Your connectivity service is ready for use.",
  },
];

export const demoPortalDeliveries: PortalDelivery[] = [
  {
    id: "pdel-2026-0142",
    orderId: "ord-2026-0142",
    orderNumber: "ORD-2026-0142",
    customerId: "cus-2026-0018",
    customerName: "ABC Manufacturing",
    siteName: "Johannesburg Head Office",
    title: "National Fibre Upgrade",
    product: "1 Gbps Dedicated Fibre",
    currentStage: "INSTALLATION",
    health: "ON_TRACK",
    ownerName: "Sarah M.",
    ownerTeam: "Service Delivery",
    lastUpdatedAt: "2026-10-22T09:42:00",
    lastUpdatedLabel: "22 October 2026, 09:42",
    nextUpdateLabel: "22 October 2026, 16:00",
    estimatedCompletionLabel: "22 October 2026",
    estimatedTotalLabel: "12–16 business days",
    elapsedBusinessDays: 9,
    remainingLabel: "3–7 business days",
    stages: abcStages,
    durationGuide: defaultDurationGuide,
    updates: [
      {
        id: "upd-0142-4",
        occurredAt: "2026-10-22T09:42:00",
        occurredLabel: "22 Oct, 09:42",
        summary: "Installation team confirmed site access.",
        actorName: "Sarah M.",
        customerVisible: true,
      },
      {
        id: "upd-0142-3",
        occurredAt: "2026-10-21T15:10:00",
        occurredLabel: "21 Oct, 15:10",
        summary: "CPE installation completed.",
        actorName: "Installation Team",
        customerVisible: true,
      },
      {
        id: "upd-0142-2",
        occurredAt: "2026-10-20T08:30:00",
        occurredLabel: "20 Oct, 08:30",
        summary: "Installation started.",
        actorName: "Installation Team",
        customerVisible: true,
      },
      {
        id: "upd-0142-1",
        occurredAt: "2026-10-18T14:20:00",
        occurredLabel: "18 Oct, 14:20",
        summary: "Network provisioning completed.",
        actorName: "Network Planning",
        customerVisible: true,
      },
    ],
  },
  {
    id: "pdel-2026-0137",
    orderId: "ord-2026-0137",
    orderNumber: "ORD-2026-0137",
    customerId: "cus-2026-0007",
    customerName: "Department of Education",
    siteName: "Head Office, Pretoria",
    title: "Government Connectivity Programme",
    product: "Multi-site Business Fibre",
    currentStage: "FEASIBILITY",
    health: "AT_RISK",
    ownerName: "David K.",
    ownerTeam: "Service Delivery",
    lastUpdatedAt: "2026-10-20T11:00:00",
    lastUpdatedLabel: "20 October 2026, 11:00",
    nextUpdateLabel: "23 October 2026, 12:00",
    estimatedCompletionLabel: "18 November 2026",
    estimatedTotalLabel: "25–35 business days",
    elapsedBusinessDays: 8,
    remainingLabel: "17–27 business days",
    stages: [
      {
        key: "ORDER_CONFIRMED",
        state: "COMPLETED",
        startLabel: "28 Sep 2026",
        completedLabel: "28 Sep 2026",
        expectedDuration: "1 day",
        actualDuration: "1 day",
        explanation: "Your order was confirmed.",
      },
      {
        key: "VALIDATION",
        state: "COMPLETED",
        startLabel: "29 Sep 2026",
        completedLabel: "2 Oct 2026",
        expectedDuration: "1–2 days",
        actualDuration: "3 days",
        explanation: "Order details were checked across multiple sites.",
      },
      {
        key: "FEASIBILITY",
        state: "IN_PROGRESS",
        startLabel: "6 Oct 2026",
        completedLabel: "",
        expectedDuration: "2–5 days",
        actualDuration: "12 days so far",
        explanation: "We are still confirming readiness across remaining sites.",
      },
      {
        key: "PLANNING",
        state: "UPCOMING",
        startLabel: "",
        completedLabel: "",
        expectedDuration: "2–3 days",
        actualDuration: "",
        explanation: "Planning your multi-site connectivity.",
      },
      {
        key: "BUILD",
        state: "UPCOMING",
        startLabel: "",
        completedLabel: "",
        expectedDuration: "3–5 days",
        actualDuration: "",
        explanation: "Preparing your service on the network.",
      },
      {
        key: "INSTALLATION",
        state: "UPCOMING",
        startLabel: "",
        completedLabel: "",
        expectedDuration: "1–3 days",
        actualDuration: "",
        explanation: "Site installation windows will follow planning.",
      },
      {
        key: "TESTING",
        state: "UPCOMING",
        startLabel: "",
        completedLabel: "",
        expectedDuration: "1 day",
        actualDuration: "",
        explanation: "Testing each site before activation.",
      },
      {
        key: "ACTIVATION",
        state: "UPCOMING",
        startLabel: "",
        completedLabel: "",
        expectedDuration: "1 day",
        actualDuration: "",
        explanation: "Turning services on site by site.",
      },
      {
        key: "SERVICE_LIVE",
        state: "UPCOMING",
        startLabel: "",
        completedLabel: "",
        expectedDuration: "",
        actualDuration: "",
        explanation: "Services ready for use.",
      },
    ],
    durationGuide: defaultDurationGuide,
    updates: [
      {
        id: "upd-0137-1",
        occurredAt: "2026-10-20T11:00:00",
        occurredLabel: "20 Oct, 11:00",
        summary: "Additional site information requested for the remaining districts.",
        actorName: "David K.",
        customerVisible: true,
      },
    ],
  },
  {
    id: "pdel-2026-0129",
    orderId: "ord-2026-0129",
    orderNumber: "ORD-2026-0129",
    customerId: "cus-2026-0012",
    customerName: "XYZ Telecom",
    siteName: "Metro PoP, Isando",
    title: "Wholesale Interconnect",
    product: "10 Gbps Wholesale Link",
    currentStage: "PLANNING",
    health: "ON_TRACK",
    ownerName: "Michael R.",
    ownerTeam: "Service Delivery",
    lastUpdatedAt: "2026-10-21T16:10:00",
    lastUpdatedLabel: "21 October 2026, 16:10",
    nextUpdateLabel: "23 October 2026, 10:00",
    estimatedCompletionLabel: "28 October 2026",
    estimatedTotalLabel: "18–22 business days",
    elapsedBusinessDays: 12,
    remainingLabel: "6–10 business days",
    stages: [
      {
        key: "ORDER_CONFIRMED",
        state: "COMPLETED",
        startLabel: "18 Sep 2026",
        completedLabel: "18 Sep 2026",
        expectedDuration: "1 day",
        actualDuration: "1 day",
        explanation: "Your order was confirmed.",
      },
      {
        key: "VALIDATION",
        state: "COMPLETED",
        startLabel: "19 Sep 2026",
        completedLabel: "22 Sep 2026",
        expectedDuration: "1–2 days",
        actualDuration: "2 days",
        explanation: "Wholesale order details validated.",
      },
      {
        key: "FEASIBILITY",
        state: "COMPLETED",
        startLabel: "23 Sep 2026",
        completedLabel: "2 Oct 2026",
        expectedDuration: "2–5 days",
        actualDuration: "5 days",
        explanation: "Interconnect capacity was confirmed.",
      },
      {
        key: "PLANNING",
        state: "IN_PROGRESS",
        startLabel: "4 Oct 2026",
        completedLabel: "",
        expectedDuration: "2–3 days",
        actualDuration: "2 days so far",
        explanation: "We are scheduling your interconnect window.",
      },
      {
        key: "BUILD",
        state: "UPCOMING",
        startLabel: "",
        completedLabel: "",
        expectedDuration: "3–5 days",
        actualDuration: "",
        explanation: "Preparing the wholesale path.",
      },
      {
        key: "INSTALLATION",
        state: "UPCOMING",
        startLabel: "",
        completedLabel: "",
        expectedDuration: "1–3 days",
        actualDuration: "",
        explanation: "PoP handoff and cross-connect.",
      },
      {
        key: "TESTING",
        state: "UPCOMING",
        startLabel: "",
        completedLabel: "",
        expectedDuration: "1 day",
        actualDuration: "",
        explanation: "Link and capacity tests.",
      },
      {
        key: "ACTIVATION",
        state: "UPCOMING",
        startLabel: "",
        completedLabel: "",
        expectedDuration: "1 day",
        actualDuration: "",
        explanation: "Turning the wholesale link on.",
      },
      {
        key: "SERVICE_LIVE",
        state: "UPCOMING",
        startLabel: "",
        completedLabel: "",
        expectedDuration: "",
        actualDuration: "",
        explanation: "Service ready for traffic.",
      },
    ],
    durationGuide: defaultDurationGuide,
    updates: [
      {
        id: "upd-0129-1",
        occurredAt: "2026-10-21T16:10:00",
        occurredLabel: "21 Oct, 16:10",
        summary: "Interconnect window requested for 28 October.",
        actorName: "Michael R.",
        customerVisible: true,
      },
    ],
  },
  {
    id: "pdel-2026-0118",
    orderId: "ord-2026-0118",
    orderNumber: "ORD-2026-0118",
    customerId: "cus-2026-0027",
    customerName: "Horizon Retail Group",
    siteName: "Sandton Branch",
    title: "Branch Connectivity",
    product: "200 Mbps Business Fibre",
    currentStage: "ACTIVATION",
    health: "ON_TRACK",
    ownerName: "Michael R.",
    ownerTeam: "Service Delivery",
    lastUpdatedAt: "2026-10-22T08:15:00",
    lastUpdatedLabel: "22 October 2026, 08:15",
    nextUpdateLabel: "22 October 2026, 14:00",
    estimatedCompletionLabel: "15 October 2026",
    estimatedTotalLabel: "10–14 business days",
    elapsedBusinessDays: 13,
    remainingLabel: "1 business day",
    stages: [
      {
        key: "ORDER_CONFIRMED",
        state: "COMPLETED",
        startLabel: "8 Sep 2026",
        completedLabel: "8 Sep 2026",
        expectedDuration: "1 day",
        actualDuration: "1 day",
        explanation: "Your order was confirmed.",
      },
      {
        key: "VALIDATION",
        state: "COMPLETED",
        startLabel: "9 Sep 2026",
        completedLabel: "10 Sep 2026",
        expectedDuration: "1–2 days",
        actualDuration: "1 day",
        explanation: "Order details checked.",
      },
      {
        key: "FEASIBILITY",
        state: "COMPLETED",
        startLabel: "11 Sep 2026",
        completedLabel: "15 Sep 2026",
        expectedDuration: "2–5 days",
        actualDuration: "3 days",
        explanation: "The Sandton branch is ready for service.",
      },
      {
        key: "PLANNING",
        state: "COMPLETED",
        startLabel: "16 Sep 2026",
        completedLabel: "18 Sep 2026",
        expectedDuration: "2–3 days",
        actualDuration: "2 days",
        explanation: "Installation and activation planned.",
      },
      {
        key: "BUILD",
        state: "COMPLETED",
        startLabel: "19 Sep 2026",
        completedLabel: "8 Oct 2026",
        expectedDuration: "3–5 days",
        actualDuration: "5 days",
        explanation: "Service prepared on the network.",
      },
      {
        key: "INSTALLATION",
        state: "COMPLETED",
        startLabel: "10 Oct 2026",
        completedLabel: "14 Oct 2026",
        expectedDuration: "1–3 days",
        actualDuration: "2 days",
        explanation: "Installation completed at the branch.",
      },
      {
        key: "TESTING",
        state: "COMPLETED",
        startLabel: "14 Oct 2026",
        completedLabel: "15 Oct 2026",
        expectedDuration: "1 day",
        actualDuration: "1 day",
        explanation: "Acceptance tests passed.",
      },
      {
        key: "ACTIVATION",
        state: "IN_PROGRESS",
        startLabel: "15 Oct 2026",
        completedLabel: "",
        expectedDuration: "1 day",
        actualDuration: "1 day so far",
        explanation: "We are turning your branch service on.",
      },
      {
        key: "SERVICE_LIVE",
        state: "UPCOMING",
        startLabel: "",
        completedLabel: "",
        expectedDuration: "",
        actualDuration: "",
        explanation: "Branch connectivity ready for trading.",
      },
    ],
    durationGuide: defaultDurationGuide,
    updates: [
      {
        id: "upd-0118-1",
        occurredAt: "2026-10-22T08:15:00",
        occurredLabel: "22 Oct, 08:15",
        summary: "Activation checks in progress at Sandton.",
        actorName: "Michael R.",
        customerVisible: true,
      },
    ],
  },
];

export const demoPortalEscalations: PortalEscalation[] = [
  {
    id: "esc-2026-0042",
    reference: "ESC-2026-0042",
    orderId: "ord-2026-0142",
    orderNumber: "ORD-2026-0142",
    customerId: "cus-2026-0018",
    customerName: "ABC Manufacturing",
    stage: "INSTALLATION",
    reason: "No progress / no update",
    message: "Our installation was expected yesterday and we haven't received an update.",
    contactPreference: "Either",
    priority: "HIGH",
    status: "OPEN",
    assignedTo: "Service Delivery Manager",
    expectedResponse: "Within 4 business hours",
    submittedAt: "2026-10-22T08:05:00",
    submittedLabel: "22 October 2026, 08:05",
    notes: [],
  },
];

export const portalLiveServices = [
  {
    id: "srv-demo-1",
    name: "Existing HQ Internet",
    product: "200 Mbps Business Fibre",
    status: "Live",
    site: "Johannesburg Head Office",
  },
  {
    id: "srv-demo-2",
    name: "Plant backup link",
    product: "100 Mbps Business Fibre",
    status: "Live",
    site: "Plant 2, Pretoria",
  },
];

export function getDemoPortalDelivery(id: string) {
  return demoPortalDeliveries.find((item) => item.id === id || item.orderId === id);
}

export function getPrimaryPortalDelivery() {
  return demoPortalDeliveries[0]!;
}
