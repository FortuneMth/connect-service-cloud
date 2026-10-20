/**
 * Static sales book for the Sales workspace.
 * Shapes follow the future opportunity model and will be replaced by queries later.
 */

import {
  ACCOUNT_OWNERS,
  DEMO_ORGANISATION_ID,
  demoCustomers,
  type AccountOwner,
  type CustomerType,
} from "@/data/customers";

export { DEMO_ORGANISATION_ID };

export type OpportunityType = CustomerType;

export type OpportunityStage =
  | "LEAD"
  | "QUALIFICATION"
  | "SOLUTION_DESIGN"
  | "PROPOSAL"
  | "NEGOTIATION"
  | "WON"
  | "LOST";

export type TaskStatus = "OPEN" | "IN_PROGRESS" | "DONE";
export type TaskPriority = "HIGH" | "MEDIUM" | "LOW";

export type OpportunityActivityAction =
  | "CREATED"
  | "DISCOVERY"
  | "REQUIREMENTS"
  | "SOLUTION"
  | "PROPOSAL"
  | "MEETING"
  | "PRICING"
  | "NEGOTIATION"
  | "STAGE"
  | "NOTE";

export type OpportunityCustomer = {
  id: string;
  customerNumber: string;
  name: string;
  type: CustomerType;
  accountOwnerName: string;
  siteCount: number;
  serviceCount: number;
  monthlyRecurringRevenue: number;
  primaryContactName: string;
  primaryContactEmail: string;
  primaryContactPhone: string;
};

export type OpportunityContact = {
  id: string;
  name: string;
  role: string;
  email: string;
  phone: string;
};

export type OpportunityActivity = {
  id: string;
  action: OpportunityActivityAction;
  summary: string;
  actorName: string;
  occurredLabel: string;
};

export type OpportunityTask = {
  id: string;
  title: string;
  ownerName: string;
  dueLabel: string;
  status: TaskStatus;
  priority: TaskPriority;
};

export type OpportunityRecord = {
  id: string;
  organisationId: string;
  opportunityNumber: string;
  name: string;
  customer: OpportunityCustomer;
  type: OpportunityType;
  solution: string;
  stage: OpportunityStage;
  /** Working-list value shown in the opportunity table. */
  value: number;
  estimatedMrr: number;
  estimatedNrc: number;
  contractTermMonths: number;
  probability: number;
  expectedClose: string;
  expectedCloseLabel: string;
  owner: AccountOwner;
  source: string;
  createdLabel: string;
  createdAt: string;
  updatedAt: string;
  lastActivityLabel: string;
  contacts: OpportunityContact[];
  activities: OpportunityActivity[];
  tasks: OpportunityTask[];
  notes: string;
};

export const OPPORTUNITY_TYPE_LABEL: Record<OpportunityType, string> = {
  ENTERPRISE: "Enterprise",
  WHOLESALE: "Wholesale",
  RESELLER: "Reseller",
  GOVERNMENT: "Government",
};

export const OPPORTUNITY_STAGE_LABEL: Record<OpportunityStage, string> = {
  LEAD: "Lead",
  QUALIFICATION: "Qualification",
  SOLUTION_DESIGN: "Solution Design",
  PROPOSAL: "Proposal",
  NEGOTIATION: "Negotiation",
  WON: "Won",
  LOST: "Lost",
};

export const OPPORTUNITY_STAGES = Object.keys(OPPORTUNITY_STAGE_LABEL) as OpportunityStage[];

export const TASK_STATUS_LABEL: Record<TaskStatus, string> = {
  OPEN: "Open",
  IN_PROGRESS: "In progress",
  DONE: "Done",
};

export const TASK_PRIORITY_LABEL: Record<TaskPriority, string> = {
  HIGH: "High",
  MEDIUM: "Medium",
  LOW: "Low",
};

export const SALES_OWNERS = ACCOUNT_OWNERS;

export const salesKpis = [
  {
    id: "pipeline",
    label: "Pipeline Value",
    value: "R 8.42M",
    context: "32 open opportunities",
    tone: "neutral" as const,
  },
  {
    id: "weighted",
    label: "Weighted Pipeline",
    value: "R 4.76M",
    context: "Based on current probability",
    tone: "neutral" as const,
  },
  {
    id: "quarter",
    label: "Expected This Quarter",
    value: "R 2.18M",
    context: "9 opportunities",
    tone: "neutral" as const,
  },
  {
    id: "won",
    label: "Won This Month",
    value: "R 684,500",
    context: "4 opportunities",
    tone: "positive" as const,
  },
];

/** Portfolio snapshot. Counts are the commercial book, not the working list below. */
export const salesPipeline: { stage: OpportunityStage; count: number; value: string }[] = [
  { stage: "LEAD", count: 8, value: "R 1.25M" },
  { stage: "QUALIFICATION", count: 6, value: "R 1.48M" },
  { stage: "SOLUTION_DESIGN", count: 5, value: "R 1.72M" },
  { stage: "PROPOSAL", count: 5, value: "R 1.96M" },
  { stage: "NEGOTIATION", count: 3, value: "R 1.31M" },
  { stage: "WON", count: 4, value: "R 684.5K" },
  { stage: "LOST", count: 3, value: "R 412K" },
];

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export function formatCloseDate(isoDate: string) {
  const [year, month, day] = isoDate.split("-");
  const monthIndex = Number(month) - 1;

  if (!year || monthIndex < 0 || monthIndex > 11 || !day) {
    return isoDate;
  }

  return `${Number(day)} ${MONTHS[monthIndex]} ${year}`;
}

export function contractValue(mrr: number, nrc: number, termMonths: number) {
  return mrr * termMonths + nrc;
}

export function nextTaskStatus(status: TaskStatus): TaskStatus {
  if (status === "OPEN") return "IN_PROGRESS";
  if (status === "IN_PROGRESS") return "DONE";
  return "OPEN";
}

function customerSnapshot(id: string): OpportunityCustomer {
  const record = demoCustomers.find((item) => item.id === id);

  if (!record) {
    throw new Error(`Unknown customer ${id}`);
  }

  return {
    id: record.id,
    customerNumber: record.customerNumber,
    name: record.name,
    type: record.type,
    accountOwnerName: record.accountOwner.name,
    siteCount: record.siteCount,
    serviceCount: record.serviceCount,
    monthlyRecurringRevenue: record.monthlyRecurringRevenue,
    primaryContactName: record.primaryContact.name,
    primaryContactEmail: record.primaryContact.email,
    primaryContactPhone: record.primaryContact.phone,
  };
}

export const salesCustomers: OpportunityCustomer[] = demoCustomers
  .map((customer) => customerSnapshot(customer.id))
  .sort((left, right) => left.name.localeCompare(right.name));

const owners = {
  sarah: ACCOUNT_OWNERS[0],
  michael: ACCOUNT_OWNERS[1],
  david: ACCOUNT_OWNERS[2],
  nomsa: ACCOUNT_OWNERS[3],
};

function activity(
  id: string,
  action: OpportunityActivityAction,
  summary: string,
  actorName: string,
  occurredLabel: string,
): OpportunityActivity {
  return { id, action, summary, actorName, occurredLabel };
}

function task(
  id: string,
  title: string,
  ownerName: string,
  dueLabel: string,
  status: TaskStatus,
  priority: TaskPriority,
): OpportunityTask {
  return { id, title, ownerName, dueLabel, status, priority };
}

function contact(id: string, name: string, role: string, email: string, phone: string): OpportunityContact {
  return { id, name, role, email, phone };
}

type Seed = {
  id: string;
  number: string;
  name: string;
  customerId: string;
  type: OpportunityType;
  solution: string;
  stage: OpportunityStage;
  value: number;
  mrr: number;
  nrc: number;
  term: number;
  probability: number;
  close: string;
  owner: AccountOwner;
  source: string;
  createdLabel: string;
  createdAt: string;
  updatedAt: string;
  lastActivity: string;
  notes: string;
  contacts: OpportunityContact[];
  activities: OpportunityActivity[];
  tasks: OpportunityTask[];
};

function toRecord(seed: Seed): OpportunityRecord {
  return {
    id: seed.id,
    organisationId: DEMO_ORGANISATION_ID,
    opportunityNumber: seed.number,
    name: seed.name,
    customer: customerSnapshot(seed.customerId),
    type: seed.type,
    solution: seed.solution,
    stage: seed.stage,
    value: seed.value,
    estimatedMrr: seed.mrr,
    estimatedNrc: seed.nrc,
    contractTermMonths: seed.term,
    probability: seed.probability,
    expectedClose: seed.close,
    expectedCloseLabel: formatCloseDate(seed.close),
    owner: seed.owner,
    source: seed.source,
    createdLabel: seed.createdLabel,
    createdAt: seed.createdAt,
    updatedAt: seed.updatedAt,
    lastActivityLabel: seed.lastActivity,
    contacts: seed.contacts,
    activities: seed.activities,
    tasks: seed.tasks,
    notes: seed.notes,
  };
}

const seeds: Seed[] = [
  {
    id: "opp-2026-0042",
    number: "OPP-2026-0042",
    name: "National Fibre Upgrade",
    customerId: "cus-2026-0018",
    type: "ENTERPRISE",
    solution: "1 Gbps Dedicated Fibre",
    stage: "PROPOSAL",
    value: 1250000,
    mrr: 82500,
    nrc: 165000,
    term: 36,
    probability: 70,
    close: "2026-10-22",
    owner: owners.sarah,
    source: "Existing customer",
    createdLabel: "12 Aug 2026",
    createdAt: "2026-08-12T08:00:00.000Z",
    updatedAt: "2026-10-14T09:20:00.000Z",
    lastActivity: "Today",
    notes:
      "Upgrade dedicated fibre across the manufacturing sites. Plant 2 needs diverse routing before the November shutdown.",
    contacts: [
      contact("abc-c1", "Thabo Mokoena", "IT Manager", "thabo.mokoena@abcmfg.demo", "011 555 0142"),
      contact("abc-c2", "Elize van Wyk", "Finance Manager", "accounts@abcmfg.demo", "011 555 0190"),
      contact("abc-c3", "Pieter du Toit", "Plant Operations", "pieter.dutoit@abcmfg.demo", "011 555 0166"),
    ],
    activities: [
      activity("abc-a1", "CREATED", "Opportunity created", "Sarah M.", "12 Aug"),
      activity("abc-a2", "DISCOVERY", "Discovery meeting completed", "Sarah M.", "19 Aug"),
      activity("abc-a3", "REQUIREMENTS", "Technical requirements received", "Thabo Mokoena", "2 Sep"),
      activity("abc-a4", "SOLUTION", "Solution designed", "Nomsa P.", "18 Sep"),
      activity("abc-a5", "PROPOSAL", "Proposal sent", "Sarah M.", "29 Sep"),
      activity("abc-a6", "MEETING", "Customer meeting", "Thabo Mokoena", "8 Oct"),
      activity("abc-a7", "PRICING", "Pricing revised", "Sarah M.", "Today, 09:20"),
    ],
    tasks: [
      task("abc-t1", "Send revised proposal", "Sarah M.", "16 Oct 2026", "OPEN", "HIGH"),
      task("abc-t2", "Confirm technical requirements", "Nomsa P.", "17 Oct 2026", "IN_PROGRESS", "HIGH"),
      task("abc-t3", "Schedule customer meeting", "Sarah M.", "20 Oct 2026", "OPEN", "MEDIUM"),
      task("abc-t4", "Complete pricing approval", "Nomsa P.", "18 Oct 2026", "OPEN", "HIGH"),
      task("abc-t5", "Prepare quote", "Sarah M.", "21 Oct 2026", "OPEN", "MEDIUM"),
    ],
  },
  {
    id: "opp-2026-0036",
    number: "OPP-2026-0036",
    name: "Provincial Connectivity Programme",
    customerId: "cus-2026-0007",
    type: "GOVERNMENT",
    solution: "Multi-site Business Fibre",
    stage: "SOLUTION_DESIGN",
    value: 2850000,
    mrr: 68000,
    nrc: 402000,
    term: 36,
    probability: 50,
    close: "2026-11-05",
    owner: owners.david,
    source: "Tender",
    createdLabel: "3 Jul 2026",
    createdAt: "2026-07-03T08:00:00.000Z",
    updatedAt: "2026-10-13T11:00:00.000Z",
    lastActivity: "Yesterday",
    notes: "Provincial school and district-office fibre. Feasibility is still open for the rural circuit sites.",
    contacts: [
      contact("doe-c1", "Nomsa Dlamini", "Programme Lead", "nomsa.dlamini@education.demo", "012 555 4100"),
      contact("doe-c2", "SCM Payments", "Supply Chain", "scm@education.demo", "012 555 4188"),
    ],
    activities: [
      activity("doe-a1", "CREATED", "Opportunity created", "David K.", "3 Jul"),
      activity("doe-a2", "DISCOVERY", "Discovery meeting completed", "David K.", "22 Jul"),
      activity("doe-a3", "REQUIREMENTS", "Technical requirements received", "Nomsa Dlamini", "18 Aug"),
      activity("doe-a4", "SOLUTION", "Solution designed", "Nomsa P.", "Yesterday"),
    ],
    tasks: [
      task("doe-t1", "Confirm technical requirements", "David K.", "21 Oct 2026", "IN_PROGRESS", "HIGH"),
      task("doe-t2", "Schedule customer meeting", "David K.", "24 Oct 2026", "OPEN", "MEDIUM"),
    ],
  },
  {
    id: "opp-2026-0048",
    number: "OPP-2026-0048",
    name: "Wholesale Capacity Expansion",
    customerId: "cus-2026-0012",
    type: "WHOLESALE",
    solution: "10 Gbps Wholesale Link",
    stage: "NEGOTIATION",
    value: 1850000,
    mrr: 45000,
    nrc: 230000,
    term: 36,
    probability: 80,
    close: "2026-10-18",
    owner: owners.michael,
    source: "Account plan",
    createdLabel: "28 Jul 2026",
    createdAt: "2026-07-28T08:00:00.000Z",
    updatedAt: "2026-10-13T16:40:00.000Z",
    lastActivity: "Yesterday",
    notes: "Additional 10 Gbps between Pretoria core and the Durban interconnect. Term discount is the open point.",
    contacts: [
      contact("xyz-c1", "Lerato Nkosi", "Wholesale Manager", "lerato.nkosi@xyztelecom.demo", "012 555 2201"),
      contact("xyz-c2", "Wholesale Billing", "Billing", "billing@xyztelecom.demo", "012 555 2208"),
    ],
    activities: [
      activity("xyz-a1", "CREATED", "Opportunity created", "Michael R.", "28 Jul"),
      activity("xyz-a2", "DISCOVERY", "Discovery meeting completed", "Michael R.", "6 Aug"),
      activity("xyz-a3", "REQUIREMENTS", "Technical requirements received", "Lerato Nkosi", "20 Aug"),
      activity("xyz-a4", "SOLUTION", "Solution designed", "Nomsa P.", "9 Sep"),
      activity("xyz-a5", "PROPOSAL", "Proposal sent", "Michael R.", "22 Sep"),
      activity("xyz-a6", "PRICING", "Pricing revised", "Michael R.", "6 Oct"),
      activity("xyz-a7", "NEGOTIATION", "Negotiation started", "Lerato Nkosi", "Yesterday"),
    ],
    tasks: [
      task("xyz-t1", "Complete pricing approval", "Michael R.", "16 Oct 2026", "IN_PROGRESS", "HIGH"),
      task("xyz-t2", "Prepare quote", "Michael R.", "17 Oct 2026", "OPEN", "HIGH"),
    ],
  },
  {
    id: "opp-2026-0051",
    number: "OPP-2026-0051",
    name: "Reseller Access Expansion",
    customerId: "cus-2026-0021",
    type: "RESELLER",
    solution: "500 Mbps Business Fibre x 20",
    stage: "QUALIFICATION",
    value: 975000,
    mrr: 22000,
    nrc: 183000,
    term: 36,
    probability: 40,
    close: "2026-11-14",
    owner: owners.sarah,
    source: "Partner",
    createdLabel: "2 Sep 2026",
    createdAt: "2026-09-02T08:00:00.000Z",
    updatedAt: "2026-10-12T10:15:00.000Z",
    lastActivity: "2 days ago",
    notes: "Twenty new end-customer access tails. Qualification is waiting on the partner's site list.",
    contacts: [
      contact("cpr-c1", "Jason Naidoo", "Partner Principal", "jason.naidoo@connectpro.demo", "031 555 7720"),
      contact("cpr-c2", "Partner Accounts", "Billing", "accounts@connectpro.demo", "031 555 7728"),
    ],
    activities: [
      activity("cpr-a1", "CREATED", "Opportunity created", "Sarah M.", "2 Sep"),
      activity("cpr-a2", "DISCOVERY", "Discovery meeting completed", "Jason Naidoo", "2 days ago"),
    ],
    tasks: [
      task("cpr-t1", "Confirm technical requirements", "Sarah M.", "28 Oct 2026", "OPEN", "MEDIUM"),
      task("cpr-t2", "Schedule customer meeting", "Sarah M.", "30 Oct 2026", "OPEN", "LOW"),
    ],
  },
  {
    id: "opp-2026-0045",
    number: "OPP-2026-0045",
    name: "Branch Connectivity",
    customerId: "cus-2026-0027",
    type: "ENTERPRISE",
    solution: "200 Mbps Business Fibre",
    stage: "PROPOSAL",
    value: 620000,
    mrr: 14500,
    nrc: 98000,
    term: 36,
    probability: 65,
    close: "2026-10-28",
    owner: owners.michael,
    source: "Existing customer",
    createdLabel: "18 Aug 2026",
    createdAt: "2026-08-18T08:00:00.000Z",
    updatedAt: "2026-10-11T14:00:00.000Z",
    lastActivity: "3 days ago",
    notes: "Standardise nine retail branches on 200 Mbps fibre with a shared failover design.",
    contacts: [
      contact("hrg-c1", "Aisha Patel", "IT Lead", "aisha.patel@horizonretail.demo", "011 555 6402"),
      contact("hrg-c2", "Retail Shared Services", "Finance", "sharedservices@horizonretail.demo", "011 555 6410"),
    ],
    activities: [
      activity("hrg-a1", "CREATED", "Opportunity created", "Michael R.", "18 Aug"),
      activity("hrg-a2", "REQUIREMENTS", "Technical requirements received", "Aisha Patel", "4 Sep"),
      activity("hrg-a3", "PROPOSAL", "Proposal sent", "Michael R.", "3 days ago"),
    ],
    tasks: [
      task("hrg-t1", "Send revised proposal", "Michael R.", "22 Oct 2026", "OPEN", "MEDIUM"),
      task("hrg-t2", "Prepare quote", "Michael R.", "24 Oct 2026", "OPEN", "MEDIUM"),
    ],
  },
  {
    id: "opp-2026-0055",
    number: "OPP-2026-0055",
    name: "Shaft Site Fibre",
    customerId: "cus-2026-0015",
    type: "ENTERPRISE",
    solution: "1 Gbps Dedicated Fibre",
    stage: "LEAD",
    value: 480000,
    mrr: 11200,
    nrc: 76800,
    term: 36,
    probability: 20,
    close: "2026-12-04",
    owner: owners.michael,
    source: "Inbound",
    createdLabel: "6 Oct 2026",
    createdAt: "2026-10-06T08:00:00.000Z",
    updatedAt: "2026-10-14T07:30:00.000Z",
    lastActivity: "Today",
    notes: "New shaft office needs a diverse fibre path off the existing mine campus.",
    contacts: [
      contact("hvm-c1", "Johan Venter", "Infrastructure Manager", "johan.venter@highveld.demo", "011 555 8801"),
    ],
    activities: [
      activity("hvm-a1", "CREATED", "Opportunity created", "Michael R.", "6 Oct"),
      activity("hvm-a2", "MEETING", "Customer meeting", "Johan Venter", "Today"),
    ],
    tasks: [
      task("hvm-t1", "Schedule customer meeting", "Michael R.", "23 Oct 2026", "OPEN", "MEDIUM"),
    ],
  },
  {
    id: "opp-2026-0028",
    number: "OPP-2026-0028",
    name: "Campus Backhaul",
    customerId: "cus-2026-0024",
    type: "RESELLER",
    solution: "1 Gbps Dedicated Fibre",
    stage: "QUALIFICATION",
    value: 340000,
    mrr: 7800,
    nrc: 59200,
    term: 36,
    probability: 35,
    close: "2026-11-20",
    owner: owners.sarah,
    source: "Partner",
    createdLabel: "14 Aug 2026",
    createdAt: "2026-08-14T08:00:00.000Z",
    updatedAt: "2026-10-10T09:00:00.000Z",
    lastActivity: "4 days ago",
    notes: "Backhaul for a mixed-use property campus the partner is onboarding.",
    contacts: [
      contact("ug-c1", "Fatima Jacobs", "Portfolio Manager", "fatima.jacobs@urbangrid.demo", "021 555 9090"),
    ],
    activities: [
      activity("ug-a1", "CREATED", "Opportunity created", "Sarah M.", "14 Aug"),
      activity("ug-a2", "DISCOVERY", "Discovery meeting completed", "Fatima Jacobs", "4 days ago"),
    ],
    tasks: [
      task("ug-t1", "Confirm technical requirements", "Sarah M.", "31 Oct 2026", "OPEN", "LOW"),
    ],
  },
  {
    id: "opp-2026-0031",
    number: "OPP-2026-0031",
    name: "Clinic Connectivity",
    customerId: "cus-2026-0009",
    type: "GOVERNMENT",
    solution: "100 Mbps Business Fibre",
    stage: "LEAD",
    value: 210000,
    mrr: 4800,
    nrc: 37200,
    term: 36,
    probability: 25,
    close: "2026-12-12",
    owner: owners.david,
    source: "Referral",
    createdLabel: "22 Sep 2026",
    createdAt: "2026-09-22T08:00:00.000Z",
    updatedAt: "2026-10-09T12:00:00.000Z",
    lastActivity: "5 days ago",
    notes: "Primary care clinics need a managed fibre service before the group goes live.",
    contacts: [
      contact("nc-c1", "Zanele Khumalo", "Operations Director", "zanele.khumalo@northernclinics.demo", "012 555 6610"),
    ],
    activities: [
      activity("nc-a1", "CREATED", "Opportunity created", "David K.", "22 Sep"),
      activity("nc-a2", "MEETING", "Customer meeting", "Zanele Khumalo", "5 days ago"),
    ],
    tasks: [
      task("nc-t1", "Schedule customer meeting", "David K.", "5 Nov 2026", "OPEN", "MEDIUM"),
    ],
  },
  {
    id: "opp-2026-0040",
    number: "OPP-2026-0040",
    name: "Cold Chain Link",
    customerId: "cus-2026-0033",
    type: "ENTERPRISE",
    solution: "500 Mbps Business Fibre",
    stage: "SOLUTION_DESIGN",
    value: 275000,
    mrr: 6400,
    nrc: 44600,
    term: 36,
    probability: 55,
    close: "2026-11-02",
    owner: owners.nomsa,
    source: "Inbound",
    createdLabel: "9 Sep 2026",
    createdAt: "2026-09-09T08:00:00.000Z",
    updatedAt: "2026-10-12T15:20:00.000Z",
    lastActivity: "2 days ago",
    notes: "Gqeberha cold store needs a monitored 500 Mbps circuit with a 4-hour restore.",
    contacts: [
      contact("ec-c1", "Helen September", "Site Manager", "helen.september@eastcape.demo", "041 555 1212"),
    ],
    activities: [
      activity("ec-a1", "CREATED", "Opportunity created", "Nomsa P.", "9 Sep"),
      activity("ec-a2", "REQUIREMENTS", "Technical requirements received", "Helen September", "24 Sep"),
      activity("ec-a3", "SOLUTION", "Solution designed", "Nomsa P.", "2 days ago"),
    ],
    tasks: [
      task("ec-t1", "Prepare quote", "Nomsa P.", "27 Oct 2026", "OPEN", "MEDIUM"),
    ],
  },
  {
    id: "opp-2026-0022",
    number: "OPP-2026-0022",
    name: "School Fibre Phase 2",
    customerId: "cus-2026-0011",
    type: "GOVERNMENT",
    solution: "Multi-site Business Fibre",
    stage: "NEGOTIATION",
    value: 890000,
    mrr: 21000,
    nrc: 134000,
    term: 36,
    probability: 60,
    close: "2026-10-30",
    owner: owners.david,
    source: "Existing customer",
    createdLabel: "11 Jun 2026",
    createdAt: "2026-06-11T08:00:00.000Z",
    updatedAt: "2026-10-13T08:50:00.000Z",
    lastActivity: "Yesterday",
    notes: "Second phase for the trust schools. Pricing is agreed apart from the installation window.",
    contacts: [
      contact("kzs-c1", "Sipho Ndaba", "ICT Lead", "sipho.ndaba@kzschools.demo", "031 555 7171"),
    ],
    activities: [
      activity("kzs-a1", "CREATED", "Opportunity created", "David K.", "11 Jun"),
      activity("kzs-a2", "PROPOSAL", "Proposal sent", "David K.", "2 Sep"),
      activity("kzs-a3", "NEGOTIATION", "Negotiation started", "Sipho Ndaba", "Yesterday"),
    ],
    tasks: [
      task("kzs-t1", "Complete pricing approval", "David K.", "20 Oct 2026", "IN_PROGRESS", "HIGH"),
      task("kzs-t2", "Prepare quote", "David K.", "23 Oct 2026", "OPEN", "MEDIUM"),
    ],
  },
  {
    id: "opp-2026-0058",
    number: "OPP-2026-0058",
    name: "Depot Connectivity",
    customerId: "cus-2026-0031",
    type: "ENTERPRISE",
    solution: "200 Mbps Business Fibre",
    stage: "LEAD",
    value: 190000,
    mrr: 4200,
    nrc: 38800,
    term: 36,
    probability: 15,
    close: "2026-12-18",
    owner: owners.sarah,
    source: "Inbound",
    createdLabel: "9 Oct 2026",
    createdAt: "2026-10-09T08:00:00.000Z",
    updatedAt: "2026-10-10T11:40:00.000Z",
    lastActivity: "4 days ago",
    notes: "Four Cape Town depots. The customer is still choosing between fibre and a fixed-wireless backup.",
    contacts: [
      contact("bw-c1", "Priya Pillay", "Network Lead", "priya.pillay@bluewave.demo", "021 555 3301"),
    ],
    activities: [activity("bw-a1", "CREATED", "Opportunity created", "Sarah M.", "9 Oct")],
    tasks: [task("bw-t1", "Schedule customer meeting", "Sarah M.", "6 Nov 2026", "OPEN", "LOW")],
  },
  {
    id: "opp-2026-0039",
    number: "OPP-2026-0039",
    name: "Plant 2 Redundancy",
    customerId: "cus-2026-0018",
    type: "ENTERPRISE",
    solution: "1 Gbps Dedicated Fibre",
    stage: "WON",
    value: 186000,
    mrr: 4200,
    nrc: 34800,
    term: 36,
    probability: 100,
    close: "2026-10-08",
    owner: owners.sarah,
    source: "Existing customer",
    createdLabel: "4 May 2026",
    createdAt: "2026-05-04T08:00:00.000Z",
    updatedAt: "2026-10-08T13:00:00.000Z",
    lastActivity: "8 Oct",
    notes: "Diverse fibre into Plant 2. Accepted and handed toward delivery.",
    contacts: [
      contact("abc2-c1", "Thabo Mokoena", "IT Manager", "thabo.mokoena@abcmfg.demo", "011 555 0142"),
    ],
    activities: [
      activity("abc2-a1", "CREATED", "Opportunity created", "Sarah M.", "4 May"),
      activity("abc2-a2", "PROPOSAL", "Proposal sent", "Sarah M.", "18 Jun"),
      activity("abc2-a3", "STAGE", "Opportunity moved to Won", "Thabo Mokoena", "8 Oct"),
    ],
    tasks: [task("abc2-t1", "Prepare quote", "Sarah M.", "8 Oct 2026", "DONE", "MEDIUM")],
  },
  {
    id: "opp-2026-0026",
    number: "OPP-2026-0026",
    name: "POS Failover",
    customerId: "cus-2026-0027",
    type: "ENTERPRISE",
    solution: "100 Mbps Business Fibre",
    stage: "WON",
    value: 142500,
    mrr: 3200,
    nrc: 27300,
    term: 36,
    probability: 100,
    close: "2026-10-03",
    owner: owners.michael,
    source: "Existing customer",
    createdLabel: "16 Apr 2026",
    createdAt: "2026-04-16T08:00:00.000Z",
    updatedAt: "2026-10-03T10:00:00.000Z",
    lastActivity: "3 Oct",
    notes: "Failover tails for point-of-sale at the flagship stores.",
    contacts: [
      contact("hrg2-c1", "Aisha Patel", "IT Lead", "aisha.patel@horizonretail.demo", "011 555 6402"),
    ],
    activities: [
      activity("hrg2-a1", "CREATED", "Opportunity created", "Michael R.", "16 Apr"),
      activity("hrg2-a2", "STAGE", "Opportunity moved to Won", "Aisha Patel", "3 Oct"),
    ],
    tasks: [task("hrg2-t1", "Prepare quote", "Michael R.", "3 Oct 2026", "DONE", "LOW")],
  },
  {
    id: "opp-2026-0014",
    number: "OPP-2026-0014",
    name: "Metro Dark Fibre",
    customerId: "cus-2026-0012",
    type: "WHOLESALE",
    solution: "10 Gbps Wholesale Link",
    stage: "WON",
    value: 248000,
    mrr: 5800,
    nrc: 39200,
    term: 36,
    probability: 100,
    close: "2026-10-11",
    owner: owners.michael,
    source: "Account plan",
    createdLabel: "2 Mar 2026",
    createdAt: "2026-03-02T08:00:00.000Z",
    updatedAt: "2026-10-11T09:30:00.000Z",
    lastActivity: "11 Oct",
    notes: "Metro dark-fibre pair accepted for the Pretoria interconnect.",
    contacts: [
      contact("xyz2-c1", "Lerato Nkosi", "Wholesale Manager", "lerato.nkosi@xyztelecom.demo", "012 555 2201"),
    ],
    activities: [
      activity("xyz2-a1", "CREATED", "Opportunity created", "Michael R.", "2 Mar"),
      activity("xyz2-a2", "STAGE", "Opportunity moved to Won", "Lerato Nkosi", "11 Oct"),
    ],
    tasks: [task("xyz2-t1", "Prepare quote", "Michael R.", "11 Oct 2026", "DONE", "MEDIUM")],
  },
  {
    id: "opp-2026-0011",
    number: "OPP-2026-0011",
    name: "Starter Access Pack",
    customerId: "cus-2026-0021",
    type: "RESELLER",
    solution: "100 Mbps Business Fibre",
    stage: "WON",
    value: 108000,
    mrr: 2400,
    nrc: 21600,
    term: 36,
    probability: 100,
    close: "2026-10-01",
    owner: owners.sarah,
    source: "Partner",
    createdLabel: "20 Feb 2026",
    createdAt: "2026-02-20T08:00:00.000Z",
    updatedAt: "2026-10-01T15:00:00.000Z",
    lastActivity: "1 Oct",
    notes: "First access pack for three new reseller end customers.",
    contacts: [
      contact("cpr2-c1", "Jason Naidoo", "Partner Principal", "jason.naidoo@connectpro.demo", "031 555 7720"),
    ],
    activities: [
      activity("cpr2-a1", "CREATED", "Opportunity created", "Sarah M.", "20 Feb"),
      activity("cpr2-a2", "STAGE", "Opportunity moved to Won", "Jason Naidoo", "1 Oct"),
    ],
    tasks: [task("cpr2-t1", "Prepare quote", "Sarah M.", "1 Oct 2026", "DONE", "LOW")],
  },
  {
    id: "opp-2026-0016",
    number: "OPP-2026-0016",
    name: "Rural Microwave Alternative",
    customerId: "cus-2026-0007",
    type: "GOVERNMENT",
    solution: "100 Mbps Business Fibre",
    stage: "LOST",
    value: 180000,
    mrr: 0,
    nrc: 180000,
    term: 12,
    probability: 0,
    close: "2026-09-18",
    owner: owners.david,
    source: "Tender",
    createdLabel: "8 Jan 2026",
    createdAt: "2026-01-08T08:00:00.000Z",
    updatedAt: "2026-09-18T16:00:00.000Z",
    lastActivity: "18 Sep",
    notes: "Lost to an incumbent microwave bid. Fibre lead times were the deciding point.",
    contacts: [
      contact("doe2-c1", "Nomsa Dlamini", "Programme Lead", "nomsa.dlamini@education.demo", "012 555 4100"),
    ],
    activities: [
      activity("doe2-a1", "CREATED", "Opportunity created", "David K.", "8 Jan"),
      activity("doe2-a2", "STAGE", "Opportunity moved to Lost", "Nomsa Dlamini", "18 Sep"),
    ],
    tasks: [],
  },
  {
    id: "opp-2026-0008",
    number: "OPP-2026-0008",
    name: "Temporary LTE Overlay",
    customerId: "cus-2026-0015",
    type: "ENTERPRISE",
    solution: "100 Mbps Business Fibre",
    stage: "LOST",
    value: 96000,
    mrr: 0,
    nrc: 96000,
    term: 12,
    probability: 0,
    close: "2026-08-22",
    owner: owners.nomsa,
    source: "Inbound",
    createdLabel: "3 Feb 2026",
    createdAt: "2026-02-03T08:00:00.000Z",
    updatedAt: "2026-08-22T11:00:00.000Z",
    lastActivity: "22 Aug",
    notes: "Customer kept the existing radio link for the construction period.",
    contacts: [
      contact("hvm2-c1", "Johan Venter", "Infrastructure Manager", "johan.venter@highveld.demo", "011 555 8801"),
    ],
    activities: [
      activity("hvm2-a1", "CREATED", "Opportunity created", "Nomsa P.", "3 Feb"),
      activity("hvm2-a2", "STAGE", "Opportunity moved to Lost", "Johan Venter", "22 Aug"),
    ],
    tasks: [],
  },
  {
    id: "opp-2026-0020",
    number: "OPP-2026-0020",
    name: "Guest Access Wi-Fi",
    customerId: "cus-2026-0024",
    type: "RESELLER",
    solution: "200 Mbps Business Fibre",
    stage: "LOST",
    value: 136000,
    mrr: 0,
    nrc: 136000,
    term: 24,
    probability: 0,
    close: "2026-09-04",
    owner: owners.sarah,
    source: "Partner",
    createdLabel: "19 Mar 2026",
    createdAt: "2026-03-19T08:00:00.000Z",
    updatedAt: "2026-09-04T09:10:00.000Z",
    lastActivity: "4 Sep",
    notes: "Partner awarded the guest network to another access provider.",
    contacts: [
      contact("ug2-c1", "Fatima Jacobs", "Portfolio Manager", "fatima.jacobs@urbangrid.demo", "021 555 9090"),
    ],
    activities: [
      activity("ug2-a1", "CREATED", "Opportunity created", "Sarah M.", "19 Mar"),
      activity("ug2-a2", "STAGE", "Opportunity moved to Lost", "Fatima Jacobs", "4 Sep"),
    ],
    tasks: [],
  },
];

export const demoOpportunities: OpportunityRecord[] = seeds.map(toRecord);

export function getDemoOpportunity(id: string) {
  return demoOpportunities.find((opportunity) => opportunity.id === id);
}
