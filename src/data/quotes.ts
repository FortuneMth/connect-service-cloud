/**
 * Static quote book for the Quotes workspace.
 * Shapes follow the future quote model and will be replaced by queries later.
 * `subtotal` is the contract value before VAT (shown on the quote).
 * `total` is the working-list total value.
 */

import {
  ACCOUNT_OWNERS,
  DEMO_ORGANISATION_ID,
  demoCustomers,
  formatRand,
  type AccountOwner,
  type CustomerContact,
  type CustomerType,
} from "@/data/customers";
import {
  OPPORTUNITY_STAGE_LABEL,
  demoOpportunities,
  formatCloseDate,
  type OpportunityStage,
} from "@/data/sales";

export { DEMO_ORGANISATION_ID, formatRand };

export const VAT_RATE = 0.15;

export type QuoteType = CustomerType;

export type QuoteStatus =
  | "DRAFT"
  | "INTERNAL_REVIEW"
  | "SENT"
  | "CUSTOMER_REVIEW"
  | "ACCEPTED"
  | "REJECTED"
  | "EXPIRED";

export type ApprovalArea = "COMMERCIAL" | "TECHNICAL" | "FINANCE";
export type ApprovalStatus = "PENDING" | "APPROVED" | "REJECTED";

export type QuoteLineItem = {
  id: string;
  product: string;
  description: string;
  site: string;
  quantity: number;
  unit: string;
  monthlyPrice: number;
  onceOffPrice: number;
};

export type QuoteSite = {
  id: string;
  name: string;
  address: string;
  service: string;
  accessStatus: string;
  estimatedInstallLabel: string;
};

export type QuoteActivity = {
  id: string;
  summary: string;
  actorName: string;
  occurredLabel: string;
};

export type QuoteApproval = {
  id: string;
  area: ApprovalArea;
  status: ApprovalStatus;
  actorName: string;
};

export type QuoteTerms = {
  installationLeadTime: string;
  sla: string;
  cancellationTerms: string;
  pricingNotes: string;
};

export type QuoteCustomerSnapshot = {
  id: string;
  customerNumber: string;
  name: string;
  primaryContact: CustomerContact;
  billingContact: CustomerContact;
};

export type QuoteOpportunitySnapshot = {
  id: string;
  opportunityNumber: string;
  name: string;
  stage: OpportunityStage;
  stageLabel: string;
  ownerName: string;
  probability: number;
  expectedCloseLabel: string;
};

export type QuoteRecord = {
  id: string;
  organisationId: string;
  quoteNumber: string;
  customerId: string;
  customerName: string;
  opportunityId: string;
  opportunityName: string;
  quoteType: QuoteType;
  status: QuoteStatus;
  currency: "ZAR";
  validUntil: string;
  validUntilLabel: string;
  contractTerm: number;
  paymentTerms: string;
  billingFrequency: string;
  mrr: number;
  nrc: number;
  subtotal: number;
  vat: number;
  total: number;
  owner: AccountOwner;
  createdAt: string;
  createdLabel: string;
  updatedAt: string;
  lastActivityLabel: string;
  executiveSummary: string;
  rejectionReason: string | null;
  lineItems: QuoteLineItem[];
  sites: QuoteSite[];
  activities: QuoteActivity[];
  approvals: QuoteApproval[];
  terms: QuoteTerms;
  customer: QuoteCustomerSnapshot;
  opportunity: QuoteOpportunitySnapshot;
};

export const QUOTE_TYPE_LABEL: Record<QuoteType, string> = {
  ENTERPRISE: "Enterprise",
  WHOLESALE: "Wholesale",
  RESELLER: "Reseller",
  GOVERNMENT: "Government",
};

export const QUOTE_STATUS_LABEL: Record<QuoteStatus, string> = {
  DRAFT: "Draft",
  INTERNAL_REVIEW: "Internal Review",
  SENT: "Sent",
  CUSTOMER_REVIEW: "Customer Review",
  ACCEPTED: "Accepted",
  REJECTED: "Rejected",
  EXPIRED: "Expired",
};

export const QUOTE_STATUSES = Object.keys(QUOTE_STATUS_LABEL) as QuoteStatus[];

export const APPROVAL_AREA_LABEL: Record<ApprovalArea, string> = {
  COMMERCIAL: "Commercial approval",
  TECHNICAL: "Technical approval",
  FINANCE: "Finance approval",
};

export const APPROVAL_STATUS_LABEL: Record<ApprovalStatus, string> = {
  PENDING: "Pending",
  APPROVED: "Approved",
  REJECTED: "Rejected",
};

export const quoteKpis = [
  { id: "open", label: "Open Quotes", value: "18", supporting: "R 6.84M", tone: "neutral" as const },
  { id: "awaiting", label: "Awaiting Customer", value: "7", supporting: "R 2.91M", tone: "neutral" as const },
  { id: "expiring", label: "Expiring Soon", value: "3", supporting: "Next 14 days", tone: "attention" as const },
  { id: "accepted", label: "Accepted This Month", value: "6", supporting: "R 1.72M", tone: "positive" as const },
];

export const quotePipeline: { status: QuoteStatus; count: number; value: number }[] = [
  { status: "DRAFT", count: 4, value: 920_000 },
  { status: "INTERNAL_REVIEW", count: 5, value: 1_840_000 },
  { status: "SENT", count: 4, value: 1_480_000 },
  { status: "CUSTOMER_REVIEW", count: 5, value: 2_600_000 },
  { status: "ACCEPTED", count: 6, value: 1_720_000 },
  { status: "REJECTED", count: 3, value: 860_000 },
  { status: "EXPIRED", count: 2, value: 410_000 },
];

type LineSeed = [string, string, string, number, string, number, number];
type SiteSeed = [string, string, string, string, string];
type ActivitySeed = [string, string, string];
type ApprovalSeed = [ApprovalArea, ApprovalStatus, string];

type QuoteSeed = {
  id: string;
  number: string;
  customerId: string;
  opportunityId: string;
  type: QuoteType;
  status: QuoteStatus;
  validUntil: string;
  term: number;
  paymentTerms: string;
  billingFrequency: string;
  mrr: number;
  nrc: number;
  subtotal: number;
  total: number;
  ownerName: string;
  createdLabel: string;
  createdAt: string;
  updatedAt: string;
  lastActivityLabel: string;
  summary: string;
  rejectionReason?: string;
  lines: LineSeed[];
  sites: SiteSeed[];
  activities: ActivitySeed[];
  approvals: ApprovalSeed[];
  terms: QuoteTerms;
};

const standardTerms: QuoteTerms = {
  installationLeadTime: "20 business days after order acceptance and site readiness",
  sla: "99.5% service availability",
  cancellationTerms:
    "Early cancellation is billed for the remaining committed months, unless a replacement service is ordered.",
  pricingNotes: "Pricing is exclusive of VAT and holds until the quote validity date.",
};

const abcTerms: QuoteTerms = {
  installationLeadTime: "15 business days after order acceptance and site readiness",
  sla: "99.5% service availability",
  cancellationTerms:
    "After month 12, early termination may be settled at the remaining committed charges less a 10% allowance.",
  pricingNotes: "Pricing is exclusive of VAT and is subject to final site survey at both locations.",
};

export function findCustomerSnapshot(id: string): QuoteCustomerSnapshot | undefined {
  const customer = demoCustomers.find((item) => item.id === id);

  if (!customer) {
    return undefined;
  }

  return {
    id: customer.id,
    customerNumber: customer.customerNumber,
    name: customer.name,
    primaryContact: customer.primaryContact,
    billingContact: customer.billingContact,
  };
}

export function findOpportunitySnapshot(id: string): QuoteOpportunitySnapshot | undefined {
  const opportunity = demoOpportunities.find((item) => item.id === id);

  if (!opportunity) {
    return undefined;
  }

  return {
    id: opportunity.id,
    opportunityNumber: opportunity.opportunityNumber,
    name: opportunity.name,
    stage: opportunity.stage,
    stageLabel: OPPORTUNITY_STAGE_LABEL[opportunity.stage],
    ownerName: opportunity.owner.name,
    probability: opportunity.probability,
    expectedCloseLabel: opportunity.expectedCloseLabel,
  };
}

function customerSnapshot(id: string) {
  const snapshot = findCustomerSnapshot(id);

  if (!snapshot) {
    throw new Error(`Unknown customer ${id}`);
  }

  return snapshot;
}

function opportunitySnapshot(id: string) {
  const snapshot = findOpportunitySnapshot(id);

  if (!snapshot) {
    throw new Error(`Unknown opportunity ${id}`);
  }

  return snapshot;
}

function ownerByName(name: string) {
  const owner = ACCOUNT_OWNERS.find((item) => item.name === name);

  if (!owner) {
    throw new Error(`Unknown owner ${name}`);
  }

  return owner;
}

function buildQuote(seed: QuoteSeed): QuoteRecord {
  const customer = customerSnapshot(seed.customerId);
  const opportunity = opportunitySnapshot(seed.opportunityId);

  return {
    id: seed.id,
    organisationId: DEMO_ORGANISATION_ID,
    quoteNumber: seed.number,
    customerId: customer.id,
    customerName: customer.name,
    opportunityId: opportunity.id,
    opportunityName: opportunity.name,
    quoteType: seed.type,
    status: seed.status,
    currency: "ZAR",
    validUntil: seed.validUntil,
    validUntilLabel: formatCloseDate(seed.validUntil),
    contractTerm: seed.term,
    paymentTerms: seed.paymentTerms,
    billingFrequency: seed.billingFrequency,
    mrr: seed.mrr,
    nrc: seed.nrc,
    subtotal: seed.subtotal,
    vat: Math.round(seed.subtotal * VAT_RATE),
    total: seed.total,
    owner: ownerByName(seed.ownerName),
    createdAt: seed.createdAt,
    createdLabel: seed.createdLabel,
    updatedAt: seed.updatedAt,
    lastActivityLabel: seed.lastActivityLabel,
    executiveSummary: seed.summary,
    rejectionReason: seed.rejectionReason ?? null,
    lineItems: seed.lines.map((line, index) => ({
      id: `${seed.id}-line-${index + 1}`,
      product: line[0],
      description: line[1],
      site: line[2],
      quantity: line[3],
      unit: line[4],
      monthlyPrice: line[5],
      onceOffPrice: line[6],
    })),
    sites: seed.sites.map((site, index) => ({
      id: `${seed.id}-site-${index + 1}`,
      name: site[0],
      address: site[1],
      service: site[2],
      accessStatus: site[3],
      estimatedInstallLabel: site[4],
    })),
    activities: seed.activities.map((activity, index) => ({
      id: `${seed.id}-act-${index + 1}`,
      summary: activity[0],
      actorName: activity[1],
      occurredLabel: activity[2],
    })),
    approvals: seed.approvals.map((approval, index) => ({
      id: `${seed.id}-appr-${index + 1}`,
      area: approval[0],
      status: approval[1],
      actorName: approval[2],
    })),
    terms: seed.terms,
    customer,
    opportunity,
  };
}

const seeds: QuoteSeed[] = [
  {
    id: "quo-2026-0098",
    number: "QUO-2026-0098",
    customerId: "cus-2026-0018",
    opportunityId: "opp-2026-0042",
    type: "ENTERPRISE",
    status: "CUSTOMER_REVIEW",
    validUntil: "2026-10-24",
    term: 36,
    paymentTerms: "30 days",
    billingFrequency: "Monthly in advance",
    mrr: 82_500,
    nrc: 165_000,
    subtotal: 3_135_000,
    total: 1_415_000,
    ownerName: "Sarah M.",
    createdLabel: "29 Sep 2026",
    createdAt: "2026-09-29T08:00:00.000Z",
    updatedAt: "2026-10-14T09:40:00.000Z",
    lastActivityLabel: "Today",
    summary:
      "National upgrade of dedicated fibre at the Johannesburg headquarters and Plant 2, including managed routers, a diverse headquarters path, and installation.",
    lines: [
      ["Dedicated Fibre Access", "1 Gbps dedicated business fibre", "ABC Manufacturing HQ", 1, "Service", 42_500, 75_000],
      ["Managed Router", "Managed CPE for the headquarters circuit", "ABC Manufacturing HQ", 1, "Service", 4_500, 15_000],
      ["Business Fibre", "500 Mbps business fibre", "ABC Manufacturing Plant 2", 1, "Service", 18_750, 50_000],
      ["Diverse Access", "Protected diverse path into headquarters", "ABC Manufacturing HQ", 1, "Service", 16_750, 0],
      ["Installation", "Site installation and handover", "Quoted sites", 2, "Sites", 0, 12_500],
    ],
    sites: [
      ["ABC Manufacturing HQ", "14 Industrial Road, Johannesburg", "1 Gbps dedicated fibre", "Confirmed", "12 Nov 2026"],
      ["ABC Manufacturing Plant 2", "88 Fabriek Street, Pretoria", "500 Mbps business fibre", "Pending", "26 Nov 2026"],
    ],
    activities: [
      ["Customer requested revision", "Thabo Mokoena", "Today"],
      ["Customer viewed quote", "Thabo Mokoena", "Yesterday"],
      ["Quote sent to customer", "Sarah M.", "8 Oct 2026"],
      ["Pricing updated", "Sarah M.", "7 Oct 2026"],
      ["Internal review completed", "Michael R.", "6 Oct 2026"],
      ["Pricing prepared", "Sarah M.", "2 Oct 2026"],
      ["Quote created", "Sarah M.", "29 Sep 2026"],
    ],
    approvals: [
      ["COMMERCIAL", "APPROVED", "Sarah M."],
      ["TECHNICAL", "APPROVED", "Michael R."],
      ["FINANCE", "PENDING", "Finance Team"],
    ],
    terms: abcTerms,
  },
  {
    id: "quo-2026-0093",
    number: "QUO-2026-0093",
    customerId: "cus-2026-0007",
    opportunityId: "opp-2026-0036",
    type: "GOVERNMENT",
    status: "INTERNAL_REVIEW",
    validUntil: "2026-11-05",
    term: 36,
    paymentTerms: "30 days",
    billingFrequency: "Monthly in advance",
    mrr: 285_000,
    nrc: 420_000,
    subtotal: 10_680_000,
    total: 3_240_000,
    ownerName: "David K.",
    createdLabel: "18 Sep 2026",
    createdAt: "2026-09-18T08:00:00.000Z",
    updatedAt: "2026-10-13T11:00:00.000Z",
    lastActivityLabel: "Yesterday",
    summary: "Provincial school connectivity programme covering circuit access, managed routers, and a mobilisation charge.",
    lines: [
      ["School Fibre Access", "100 Mbps fibre per participating school", "Provincial school sites", 1, "Programme", 260_000, 0],
      ["Managed Router", "Managed CPE per school cluster", "Provincial school sites", 1, "Programme", 25_000, 180_000],
      ["Programme Mobilisation", "Survey, design, and project mobilisation", "Provincial school sites", 1, "Project", 0, 240_000],
    ],
    sites: [
      ["Provincial school cluster", "Multiple sites, Gauteng", "100 Mbps school fibre", "Feasibility", "Feb 2027"],
    ],
    activities: [
      ["Pricing prepared", "David K.", "Yesterday"],
      ["Quote created", "David K.", "18 Sep 2026"],
    ],
    approvals: [
      ["COMMERCIAL", "PENDING", "David K."],
      ["TECHNICAL", "APPROVED", "Michael R."],
      ["FINANCE", "PENDING", "Finance Team"],
    ],
    terms: standardTerms,
  },
  {
    id: "quo-2026-0096",
    number: "QUO-2026-0096",
    customerId: "cus-2026-0012",
    opportunityId: "opp-2026-0048",
    type: "WHOLESALE",
    status: "SENT",
    validUntil: "2026-10-30",
    term: 24,
    paymentTerms: "30 days",
    billingFrequency: "Monthly in advance",
    mrr: 145_000,
    nrc: 280_000,
    subtotal: 3_760_000,
    total: 2_180_000,
    ownerName: "Michael R.",
    createdLabel: "22 Sep 2026",
    createdAt: "2026-09-22T08:00:00.000Z",
    updatedAt: "2026-10-12T14:10:00.000Z",
    lastActivityLabel: "2 days ago",
    summary: "Wholesale capacity expansion on the metro core, with a once-off interconnect build.",
    lines: [
      ["Wavelength Capacity", "10 Gbps wavelength on the metro core", "XYZ Telecom core", 1, "Service", 145_000, 80_000],
      ["Interconnect Build", "Meet-me and cross-connect build", "XYZ Telecom core", 1, "Project", 0, 200_000],
    ],
    sites: [
      ["XYZ Telecom core", "Sandton, Johannesburg", "10 Gbps wavelength", "Confirmed", "18 Nov 2026"],
    ],
    activities: [
      ["Quote sent to customer", "Michael R.", "2 days ago"],
      ["Internal review completed", "Sarah M.", "9 Oct 2026"],
      ["Quote created", "Michael R.", "22 Sep 2026"],
    ],
    approvals: [
      ["COMMERCIAL", "APPROVED", "Sarah M."],
      ["TECHNICAL", "APPROVED", "Michael R."],
      ["FINANCE", "APPROVED", "Finance Team"],
    ],
    terms: standardTerms,
  },
  {
    id: "quo-2026-0091",
    number: "QUO-2026-0091",
    customerId: "cus-2026-0021",
    opportunityId: "opp-2026-0051",
    type: "RESELLER",
    status: "ACCEPTED",
    validUntil: "2026-10-20",
    term: 12,
    paymentTerms: "30 days",
    billingFrequency: "Monthly in advance",
    mrr: 81_250,
    nrc: 0,
    subtotal: 975_000,
    total: 975_000,
    ownerName: "Sarah M.",
    createdLabel: "4 Sep 2026",
    createdAt: "2026-09-04T08:00:00.000Z",
    updatedAt: "2026-10-10T10:00:00.000Z",
    lastActivityLabel: "4 days ago",
    summary: "Additional reseller access circuits for ConnectPro's downstream customers.",
    lines: [
      ["Reseller Access", "Wholesale access bundle for downstream sites", "ConnectPro aggregation", 1, "Service", 81_250, 0],
    ],
    sites: [
      ["ConnectPro aggregation", "Midrand, Gauteng", "Reseller access bundle", "Confirmed", "3 Nov 2026"],
    ],
    activities: [
      ["Quote accepted by customer", "Jason Naidoo", "4 days ago"],
      ["Quote sent to customer", "Sarah M.", "28 Sep 2026"],
      ["Quote created", "Sarah M.", "4 Sep 2026"],
    ],
    approvals: [
      ["COMMERCIAL", "APPROVED", "Sarah M."],
      ["TECHNICAL", "APPROVED", "Michael R."],
      ["FINANCE", "APPROVED", "Finance Team"],
    ],
    terms: standardTerms,
  },
  {
    id: "quo-2026-0087",
    number: "QUO-2026-0087",
    customerId: "cus-2026-0027",
    opportunityId: "opp-2026-0045",
    type: "ENTERPRISE",
    status: "REJECTED",
    validUntil: "2026-10-12",
    term: 12,
    paymentTerms: "30 days",
    billingFrequency: "Monthly in advance",
    mrr: 51_667,
    nrc: 0,
    subtotal: 620_000,
    total: 620_000,
    ownerName: "Michael R.",
    createdLabel: "11 Aug 2026",
    createdAt: "2026-08-11T08:00:00.000Z",
    updatedAt: "2026-10-09T16:20:00.000Z",
    lastActivityLabel: "5 days ago",
    summary: "Branch connectivity for Horizon retail sites. The customer declined the current commercial structure.",
    rejectionReason: "The commercial term is longer than the store lease cycle. Horizon asked for a 12-month alternative at a lower access rate.",
    lines: [
      ["Branch Fibre", "100 Mbps business fibre per store", "Horizon retail branches", 1, "Service", 51_667, 0],
    ],
    sites: [
      ["Horizon retail branches", "Multiple stores, Gauteng", "100 Mbps branch fibre", "Feasibility", "Not scheduled"],
    ],
    activities: [
      ["Quote rejected", "Aisha Patel", "5 days ago"],
      ["Quote sent to customer", "Michael R.", "3 Oct 2026"],
      ["Quote created", "Michael R.", "11 Aug 2026"],
    ],
    approvals: [
      ["COMMERCIAL", "APPROVED", "Sarah M."],
      ["TECHNICAL", "APPROVED", "Michael R."],
      ["FINANCE", "APPROVED", "Finance Team"],
    ],
    terms: standardTerms,
  },
  {
    id: "quo-2026-0099",
    number: "QUO-2026-0099",
    customerId: "cus-2026-0015",
    opportunityId: "opp-2026-0055",
    type: "ENTERPRISE",
    status: "DRAFT",
    validUntil: "2026-11-14",
    term: 36,
    paymentTerms: "30 days",
    billingFrequency: "Monthly in advance",
    mrr: 11_200,
    nrc: 76_800,
    subtotal: 480_000,
    total: 480_000,
    ownerName: "Michael R.",
    createdLabel: "13 Oct 2026",
    createdAt: "2026-10-13T09:00:00.000Z",
    updatedAt: "2026-10-14T07:10:00.000Z",
    lastActivityLabel: "Today",
    summary: "Draft fibre service for the new shaft office, pending a site survey.",
    lines: [
      ["Dedicated Fibre Access", "200 Mbps dedicated fibre", "Highveld shaft office", 1, "Service", 11_200, 45_000],
      ["Installation", "Shaft-site installation", "Highveld shaft office", 1, "Sites", 0, 31_800],
    ],
    sites: [
      ["Highveld shaft office", "Witbank, Mpumalanga", "200 Mbps dedicated fibre", "Pending", "To be scheduled"],
    ],
    activities: [
      ["Pricing prepared", "Michael R.", "Today"],
      ["Quote created", "Michael R.", "Yesterday"],
    ],
    approvals: [
      ["COMMERCIAL", "PENDING", "Michael R."],
      ["TECHNICAL", "PENDING", "Technical Team"],
      ["FINANCE", "PENDING", "Finance Team"],
    ],
    terms: standardTerms,
  },
  {
    id: "quo-2026-0094",
    number: "QUO-2026-0094",
    customerId: "cus-2026-0024",
    opportunityId: "opp-2026-0028",
    type: "ENTERPRISE",
    status: "SENT",
    validUntil: "2026-10-21",
    term: 24,
    paymentTerms: "45 days",
    billingFrequency: "Monthly in advance",
    mrr: 38_400,
    nrc: 64_000,
    subtotal: 985_600,
    total: 985_600,
    ownerName: "Sarah M.",
    createdLabel: "20 Sep 2026",
    createdAt: "2026-09-20T08:00:00.000Z",
    updatedAt: "2026-10-11T09:30:00.000Z",
    lastActivityLabel: "3 days ago",
    summary: "Campus backhaul between UrbanGrid buildings, sent for customer review.",
    lines: [
      ["Campus Backhaul", "1 Gbps inter-building fibre", "UrbanGrid campus", 1, "Service", 38_400, 64_000],
    ],
    sites: [
      ["UrbanGrid campus", "Century City, Cape Town", "1 Gbps campus backhaul", "Confirmed", "9 Dec 2026"],
    ],
    activities: [
      ["Quote sent to customer", "Sarah M.", "3 days ago"],
      ["Internal review completed", "David K.", "6 Oct 2026"],
      ["Quote created", "Sarah M.", "20 Sep 2026"],
    ],
    approvals: [
      ["COMMERCIAL", "APPROVED", "Sarah M."],
      ["TECHNICAL", "APPROVED", "Michael R."],
      ["FINANCE", "APPROVED", "Finance Team"],
    ],
    terms: standardTerms,
  },
  {
    id: "quo-2026-0090",
    number: "QUO-2026-0090",
    customerId: "cus-2026-0009",
    opportunityId: "opp-2026-0031",
    type: "ENTERPRISE",
    status: "INTERNAL_REVIEW",
    validUntil: "2026-11-02",
    term: 36,
    paymentTerms: "30 days",
    billingFrequency: "Monthly in advance",
    mrr: 22_800,
    nrc: 48_000,
    subtotal: 868_800,
    total: 868_800,
    ownerName: "David K.",
    createdLabel: "1 Oct 2026",
    createdAt: "2026-10-01T08:00:00.000Z",
    updatedAt: "2026-10-08T13:00:00.000Z",
    lastActivityLabel: "6 Oct 2026",
    summary: "Clinic connectivity with a managed router, waiting on finance review.",
    lines: [
      ["Business Fibre", "200 Mbps business fibre", "Northern Clinics hub", 1, "Service", 18_600, 32_000],
      ["Managed Router", "Managed CPE for the clinic hub", "Northern Clinics hub", 1, "Service", 4_200, 16_000],
    ],
    sites: [
      ["Northern Clinics hub", "Pretoria", "200 Mbps business fibre", "Feasibility", "19 Jan 2027"],
    ],
    activities: [
      ["Pricing prepared", "David K.", "6 Oct 2026"],
      ["Quote created", "David K.", "1 Oct 2026"],
    ],
    approvals: [
      ["COMMERCIAL", "APPROVED", "David K."],
      ["TECHNICAL", "PENDING", "Technical Team"],
      ["FINANCE", "PENDING", "Finance Team"],
    ],
    terms: standardTerms,
  },
  {
    id: "quo-2026-0089",
    number: "QUO-2026-0089",
    customerId: "cus-2026-0033",
    opportunityId: "opp-2026-0040",
    type: "ENTERPRISE",
    status: "DRAFT",
    validUntil: "2026-10-18",
    term: 24,
    paymentTerms: "30 days",
    billingFrequency: "Monthly in advance",
    mrr: 9_600,
    nrc: 22_000,
    subtotal: 252_400,
    total: 252_400,
    ownerName: "Sarah M.",
    createdLabel: "9 Oct 2026",
    createdAt: "2026-10-09T08:00:00.000Z",
    updatedAt: "2026-10-09T15:40:00.000Z",
    lastActivityLabel: "9 Oct 2026",
    summary: "Draft cold-chain link for the Gqeberha depot. Validity is inside the next 14 days.",
    lines: [
      ["Business Fibre", "100 Mbps business fibre", "East Cape depot", 1, "Service", 9_600, 22_000],
    ],
    sites: [
      ["East Cape depot", "Gqeberha", "100 Mbps business fibre", "Pending", "To be scheduled"],
    ],
    activities: [["Quote created", "Sarah M.", "9 Oct 2026"]],
    approvals: [
      ["COMMERCIAL", "PENDING", "Sarah M."],
      ["TECHNICAL", "PENDING", "Technical Team"],
      ["FINANCE", "PENDING", "Finance Team"],
    ],
    terms: standardTerms,
  },
  {
    id: "quo-2026-0097",
    number: "QUO-2026-0097",
    customerId: "cus-2026-0011",
    opportunityId: "opp-2026-0022",
    type: "GOVERNMENT",
    status: "CUSTOMER_REVIEW",
    validUntil: "2026-10-27",
    term: 36,
    paymentTerms: "60 days",
    billingFrequency: "Quarterly in advance",
    mrr: 46_000,
    nrc: 90_000,
    subtotal: 1_746_000,
    total: 1_746_000,
    ownerName: "David K.",
    createdLabel: "15 Sep 2026",
    createdAt: "2026-09-15T08:00:00.000Z",
    updatedAt: "2026-10-07T10:15:00.000Z",
    lastActivityLabel: "7 Oct 2026",
    summary: "Phase 2 school fibre, currently with the trust for review.",
    lines: [
      ["School Fibre Access", "100 Mbps fibre for phase 2 schools", "KwaZulu school sites", 1, "Programme", 46_000, 90_000],
    ],
    sites: [
      ["KwaZulu school sites", "Durban and inland schools", "100 Mbps school fibre", "Feasibility", "Mar 2027"],
    ],
    activities: [
      ["Customer viewed quote", "Sipho Ndaba", "7 Oct 2026"],
      ["Quote sent to customer", "David K.", "1 Oct 2026"],
      ["Quote created", "David K.", "15 Sep 2026"],
    ],
    approvals: [
      ["COMMERCIAL", "APPROVED", "David K."],
      ["TECHNICAL", "APPROVED", "Michael R."],
      ["FINANCE", "APPROVED", "Finance Team"],
    ],
    terms: standardTerms,
  },
  {
    id: "quo-2026-0086",
    number: "QUO-2026-0086",
    customerId: "cus-2026-0031",
    opportunityId: "opp-2026-0058",
    type: "ENTERPRISE",
    status: "ACCEPTED",
    validUntil: "2026-10-16",
    term: 24,
    paymentTerms: "30 days",
    billingFrequency: "Monthly in advance",
    mrr: 14_800,
    nrc: 28_000,
    subtotal: 383_200,
    total: 383_200,
    ownerName: "Sarah M.",
    createdLabel: "2 Sep 2026",
    createdAt: "2026-09-02T08:00:00.000Z",
    updatedAt: "2026-10-06T08:45:00.000Z",
    lastActivityLabel: "6 Oct 2026",
    summary: "Accepted depot connectivity for BlueWave Logistics.",
    lines: [
      ["Business Fibre", "200 Mbps business fibre", "BlueWave depot", 1, "Service", 14_800, 28_000],
    ],
    sites: [
      ["BlueWave depot", "Epping, Cape Town", "200 Mbps business fibre", "Confirmed", "20 Nov 2026"],
    ],
    activities: [
      ["Quote accepted by customer", "Priya Pillay", "6 Oct 2026"],
      ["Quote sent to customer", "Sarah M.", "22 Sep 2026"],
      ["Quote created", "Sarah M.", "2 Sep 2026"],
    ],
    approvals: [
      ["COMMERCIAL", "APPROVED", "Sarah M."],
      ["TECHNICAL", "APPROVED", "Michael R."],
      ["FINANCE", "APPROVED", "Finance Team"],
    ],
    terms: standardTerms,
  },
  {
    id: "quo-2026-0082",
    number: "QUO-2026-0082",
    customerId: "cus-2026-0012",
    opportunityId: "opp-2026-0014",
    type: "WHOLESALE",
    status: "EXPIRED",
    validUntil: "2026-09-30",
    term: 12,
    paymentTerms: "30 days",
    billingFrequency: "Monthly in advance",
    mrr: 18_500,
    nrc: 40_000,
    subtotal: 262_000,
    total: 262_000,
    ownerName: "Michael R.",
    createdLabel: "4 Aug 2026",
    createdAt: "2026-08-04T08:00:00.000Z",
    updatedAt: "2026-10-01T08:00:00.000Z",
    lastActivityLabel: "1 Oct 2026",
    summary: "Metro dark fibre quote that passed its validity date before acceptance.",
    lines: [
      ["Dark Fibre", "Metro dark-fibre pair", "XYZ Telecom metro", 1, "Service", 18_500, 40_000],
    ],
    sites: [
      ["XYZ Telecom metro", "Johannesburg metro", "Dark fibre pair", "Planned", "Not scheduled"],
    ],
    activities: [
      ["Quote expired", "System", "1 Oct 2026"],
      ["Quote sent to customer", "Michael R.", "12 Aug 2026"],
      ["Quote created", "Michael R.", "4 Aug 2026"],
    ],
    approvals: [
      ["COMMERCIAL", "APPROVED", "Sarah M."],
      ["TECHNICAL", "APPROVED", "Michael R."],
      ["FINANCE", "PENDING", "Finance Team"],
    ],
    terms: standardTerms,
  },
  {
    id: "quo-2026-0100",
    number: "QUO-2026-0100",
    customerId: "cus-2026-0018",
    opportunityId: "opp-2026-0039",
    type: "ENTERPRISE",
    status: "DRAFT",
    validUntil: "2026-11-20",
    term: 36,
    paymentTerms: "30 days",
    billingFrequency: "Monthly in advance",
    mrr: 6_400,
    nrc: 18_000,
    subtotal: 248_400,
    total: 248_400,
    ownerName: "Sarah M.",
    createdLabel: "12 Oct 2026",
    createdAt: "2026-10-12T08:00:00.000Z",
    updatedAt: "2026-10-12T08:20:00.000Z",
    lastActivityLabel: "12 Oct 2026",
    summary: "Draft diverse path for ABC Plant 2, separate from the national upgrade quote.",
    lines: [
      ["Diverse Access", "Diverse fibre into Plant 2", "ABC Manufacturing Plant 2", 1, "Service", 6_400, 18_000],
    ],
    sites: [
      ["ABC Manufacturing Plant 2", "88 Fabriek Street, Pretoria", "Diverse fibre", "Pending", "To be scheduled"],
    ],
    activities: [["Quote created", "Sarah M.", "12 Oct 2026"]],
    approvals: [
      ["COMMERCIAL", "PENDING", "Sarah M."],
      ["TECHNICAL", "PENDING", "Technical Team"],
      ["FINANCE", "PENDING", "Finance Team"],
    ],
    terms: abcTerms,
  },
];

export const demoQuotes: QuoteRecord[] = seeds.map(buildQuote);

export function getDemoQuote(id: string) {
  return demoQuotes.find((quote) => quote.id === id);
}

export const quoteCustomers = demoCustomers.map((customer) => ({
  id: customer.id,
  name: customer.name,
  type: customer.type,
  primaryContactName: customer.primaryContact.name,
  owner: customer.accountOwner,
}));

export const quoteOpportunities = demoOpportunities.map((opportunity) => ({
  id: opportunity.id,
  opportunityNumber: opportunity.opportunityNumber,
  name: opportunity.name,
  customerId: opportunity.customer.id,
  type: opportunity.type,
  stageLabel: OPPORTUNITY_STAGE_LABEL[opportunity.stage],
  ownerName: opportunity.owner.name,
  probability: opportunity.probability,
  expectedCloseLabel: opportunity.expectedCloseLabel,
}));

export function lineMonthly(item: Pick<QuoteLineItem, "quantity" | "monthlyPrice">) {
  return item.quantity * item.monthlyPrice;
}

export function lineOnceOff(item: Pick<QuoteLineItem, "quantity" | "onceOffPrice">) {
  return item.quantity * item.onceOffPrice;
}

export function summariseLines(
  items: Pick<QuoteLineItem, "quantity" | "monthlyPrice" | "onceOffPrice">[],
  termMonths: number,
) {
  const mrr = items.reduce((sum, item) => sum + lineMonthly(item), 0);
  const nrc = items.reduce((sum, item) => sum + lineOnceOff(item), 0);
  const subtotal = mrr * termMonths + nrc;
  const vat = Math.round(subtotal * VAT_RATE);

  return { mrr, nrc, subtotal, vat, totalInclVat: subtotal + vat };
}

export function nextQuoteNumber(quotes: { quoteNumber: string }[]) {
  const highest = quotes.reduce((max, quote) => {
    const match = quote.quoteNumber.match(/(\d+)$/);
    return Math.max(max, match ? Number(match[1]) : 0);
  }, 0);

  return `QUO-2026-${String(highest + 1).padStart(4, "0")}`;
}
