/**
 * Static customer book for the Customers workspace.
 * Shapes follow the Prisma models and will be replaced by queries later.
 */

export const DEMO_ORGANISATION_ID = "org-connect-service-demo";

export type CustomerType = "ENTERPRISE" | "WHOLESALE" | "RESELLER" | "GOVERNMENT";
export type CustomerStatus = "ACTIVE" | "PENDING" | "AT_RISK" | "SUSPENDED";
export type SiteStatus = "ACTIVE" | "PLANNED" | "INACTIVE";
export type ServiceStatus = "ACTIVE" | "PROVISIONING" | "SUSPENDED";

export type CustomerContact = {
  name: string;
  email: string;
  phone: string;
};

export type AccountOwner = {
  id: string;
  name: string;
};

export type CustomerSite = {
  id: string;
  siteCode: string;
  name: string;
  addressLine1: string;
  city: string;
  province: string;
  status: SiteStatus;
  serviceCount: number;
};

export type CustomerService = {
  id: string;
  serviceNumber: string;
  productName: string;
  siteName: string;
  bandwidth: string;
  status: ServiceStatus;
  monthlyRecurringCharge: number;
};

export type CustomerOrder = {
  id: string;
  orderNumber: string;
  productName: string;
  orderType: CustomerType;
  status: string;
  value: number;
  createdLabel: string;
  deliveryStatus: string;
};

export type CustomerQuote = {
  id: string;
  quoteNumber: string;
  description: string;
  status: string;
  value: number;
  expiryLabel: string;
  createdLabel: string;
};

export type CustomerDocument = {
  id: string;
  name: string;
  category: string;
  uploadedLabel: string;
};

export type CustomerActivity = {
  id: string;
  action:
    | "ORDER_CREATED"
    | "QUOTE_ACCEPTED"
    | "INSTALLATION_SCHEDULED"
    | "MESSAGE_RECEIVED"
    | "SERVICE_ACTIVATED";
  summary: string;
  actorName: string;
  occurredLabel: string;
};

export type CustomerRecord = {
  id: string;
  organisationId: string;
  customerNumber: string;
  name: string;
  type: CustomerType;
  status: CustomerStatus;
  industry: string;
  customerSince: string;
  paymentTerms: string;
  primaryContact: CustomerContact;
  billingContact: CustomerContact;
  accountOwner: AccountOwner;
  siteCount: number;
  serviceCount: number;
  monthlyRecurringRevenue: number;
  lastActivityLabel: string;
  updatedAt: string;
  sites: CustomerSite[];
  services: CustomerService[];
  orders: CustomerOrder[];
  quotes: CustomerQuote[];
  documents: CustomerDocument[];
  activity: CustomerActivity[];
};

export const CUSTOMER_TYPE_LABEL: Record<CustomerType, string> = {
  ENTERPRISE: "Enterprise",
  WHOLESALE: "Wholesale",
  RESELLER: "Reseller",
  GOVERNMENT: "Government",
};

export const CUSTOMER_STATUS_LABEL: Record<CustomerStatus, string> = {
  ACTIVE: "Active",
  PENDING: "Pending",
  AT_RISK: "At Risk",
  SUSPENDED: "Suspended",
};

export const SITE_STATUS_LABEL: Record<SiteStatus, string> = {
  ACTIVE: "Active",
  PLANNED: "Planned",
  INACTIVE: "Inactive",
};

export const SERVICE_STATUS_LABEL: Record<ServiceStatus, string> = {
  ACTIVE: "Active",
  PROVISIONING: "Provisioning",
  SUSPENDED: "Suspended",
};

export const ACCOUNT_OWNERS: AccountOwner[] = [
  { id: "owner-sarah", name: "Sarah M." },
  { id: "owner-michael", name: "Michael R." },
  { id: "owner-david", name: "David K." },
  { id: "owner-nomsa", name: "Nomsa P." },
];

export const PAYMENT_TERMS = ["Net 30", "Net 45", "Net 60"] as const;

export const customerKpis = [
  { id: "total", label: "Total Customers", value: "128", context: "On the platform", tone: "neutral" as const },
  { id: "active", label: "Active Customers", value: "114", context: "In service", tone: "positive" as const },
  { id: "pending", label: "Pending Onboarding", value: "8", context: "Awaiting activation", tone: "neutral" as const },
  { id: "risk", label: "At Risk", value: "6", context: "Need attention", tone: "attention" as const },
];

export function formatRand(amount: number) {
  return `R ${amount.toLocaleString("en-US")}`;
}

const owners = {
  sarah: ACCOUNT_OWNERS[0],
  michael: ACCOUNT_OWNERS[1],
  david: ACCOUNT_OWNERS[2],
  nomsa: ACCOUNT_OWNERS[3],
};

export const demoCustomers: CustomerRecord[] = [
  {
    id: "cus-2026-0018",
    organisationId: DEMO_ORGANISATION_ID,
    customerNumber: "CUS-2026-0018",
    name: "ABC Manufacturing",
    type: "ENTERPRISE",
    status: "ACTIVE",
    industry: "Manufacturing",
    customerSince: "March 2019",
    paymentTerms: "Net 30",
    primaryContact: {
      name: "Thabo Mokoena",
      email: "thabo.mokoena@abcmfg.demo",
      phone: "011 555 0142",
    },
    billingContact: {
      name: "Elize van Wyk",
      email: "accounts@abcmfg.demo",
      phone: "011 555 0190",
    },
    accountOwner: owners.sarah,
    siteCount: 6,
    serviceCount: 4,
    monthlyRecurringRevenue: 128500,
    lastActivityLabel: "Today",
    updatedAt: "2026-10-14T08:40:00.000Z",
    sites: [
      site("abc-hq", "JHB-HQ", "Johannesburg HQ", "18 Grayston Drive, Sandton", "Johannesburg", "Gauteng", "ACTIVE", 1),
      site("abc-p2", "JHB-P2", "Plant 2", "42 Industry Road, Germiston", "Johannesburg", "Gauteng", "ACTIVE", 1),
      site("abc-pta", "PTA-DC", "Pretoria Distribution", "7 Solomon Mahlangu Drive", "Pretoria", "Gauteng", "ACTIVE", 1),
      site("abc-dbn", "DBN-WH", "Durban Warehouse", "15 Maydon Road", "Durban", "KwaZulu-Natal", "ACTIVE", 1),
      site("abc-cpt", "CPT-BR", "Cape Town Branch", "90 Voortrekker Road", "Cape Town", "Western Cape", "PLANNED", 0),
      site("abc-plz", "PLZ-DP", "Gqeberha Depot", "4 Deal Party Road", "Gqeberha", "Eastern Cape", "ACTIVE", 0),
    ],
    services: [
      service("srv-481", "SRV-2026-00481", "1 Gbps Dedicated Fibre", "Johannesburg HQ", "1 Gbps", "ACTIVE", 42500),
      service("srv-482", "SRV-2026-00482", "500 Mbps Business Fibre", "Plant 2", "500 Mbps", "ACTIVE", 18750),
      service("srv-490", "SRV-2026-00490", "200 Mbps Business Fibre", "Pretoria Distribution", "200 Mbps", "ACTIVE", 28750),
      service("srv-502", "SRV-2026-00502", "1 Gbps Dedicated Fibre", "Durban Warehouse", "1 Gbps", "ACTIVE", 38500),
    ],
    orders: [
      order("ord-2026-0142", "ORD-2026-0142", "1 Gbps Dedicated Fibre", "ENTERPRISE", "Installation", 42500, "14 Oct", "Site access pending"),
      order("ord-2026-0136", "ORD-2026-0136", "200 Mbps Business Fibre", "ENTERPRISE", "Billing", 28750, "10 Oct", "Ready to invoice"),
    ],
    quotes: [
      quote("quo-2026-0098", "QUO-2026-0098", "Cape Town branch access", "Accepted", 22400, "30 Oct", "2 Oct"),
      quote("quo-2026-0110", "QUO-2026-0110", "Plant 2 bandwidth upgrade", "Sent", 6400, "28 Oct", "9 Oct"),
    ],
    documents: [
      document("abc-msa", "Master service agreement", "Contract", "12 Mar 2019"),
      document("abc-po", "Purchase order 4418", "Purchase order", "10 Oct"),
    ],
    activity: [
      activity("abc-a1", "ORDER_CREATED", "Order ORD-2026-0142 created", "Sarah M.", "Today, 08:40"),
      activity("abc-a2", "QUOTE_ACCEPTED", "Quote QUO-2026-0098 accepted", "Thabo Mokoena", "2 Oct"),
      activity("abc-a3", "INSTALLATION_SCHEDULED", "Installation scheduled at Johannesburg HQ", "Thabo M.", "Yesterday"),
      activity("abc-a4", "MESSAGE_RECEIVED", "Customer message received on ORD-2026-0142", "Thabo Mokoena", "Today, 09:12"),
      activity("abc-a5", "SERVICE_ACTIVATED", "Service SRV-2026-00490 activated", "Nomsa P.", "10 Oct"),
    ],
  },
  {
    id: "cus-2026-0012",
    organisationId: DEMO_ORGANISATION_ID,
    customerNumber: "CUS-2026-0012",
    name: "XYZ Telecom",
    type: "WHOLESALE",
    status: "ACTIVE",
    industry: "Telecommunications",
    customerSince: "July 2020",
    paymentTerms: "Net 30",
    primaryContact: {
      name: "Lerato Nkosi",
      email: "lerato.nkosi@xyztelecom.demo",
      phone: "012 555 2201",
    },
    billingContact: {
      name: "Wholesale Billing",
      email: "billing@xyztelecom.demo",
      phone: "012 555 2208",
    },
    accountOwner: owners.michael,
    siteCount: 12,
    serviceCount: 8,
    monthlyRecurringRevenue: 214000,
    lastActivityLabel: "Yesterday",
    updatedAt: "2026-10-13T14:10:00.000Z",
    sites: [
      site("xyz-jhb", "JHB-POP", "Johannesburg PoP", "1 Fredman Drive, Sandton", "Johannesburg", "Gauteng", "ACTIVE", 2),
      site("xyz-pta", "PTA-POP", "Pretoria PoP", "210 Florence Ribeiro Avenue", "Pretoria", "Gauteng", "ACTIVE", 2),
      site("xyz-dbn", "DBN-POP", "Durban PoP", "8 Margaret Mncadi Avenue", "Durban", "KwaZulu-Natal", "ACTIVE", 2),
      site("xyz-cpt", "CPT-POP", "Cape Town PoP", "22 Riebeek Street", "Cape Town", "Western Cape", "ACTIVE", 1),
      site("xyz-plz", "PLZ-POP", "Gqeberha PoP", "60 Govan Mbeki Avenue", "Gqeberha", "Eastern Cape", "ACTIVE", 1),
    ],
    services: [
      service("xyz-s1", "SRV-2026-00310", "10 Gbps Wholesale Link", "Johannesburg PoP", "10 Gbps", "ACTIVE", 86000),
      service("xyz-s2", "SRV-2026-00311", "10 Gbps Wholesale Link", "Pretoria PoP", "10 Gbps", "ACTIVE", 72000),
      service("xyz-s3", "SRV-2026-00340", "1 Gbps Dedicated Fibre", "Durban PoP", "1 Gbps", "ACTIVE", 28000),
      service("xyz-s4", "SRV-2026-00355", "1 Gbps Dedicated Fibre", "Cape Town PoP", "1 Gbps", "PROVISIONING", 28000),
    ],
    orders: [
      order("ord-2026-0140", "ORD-2026-0140", "10 Gbps Wholesale Link", "WHOLESALE", "Feasibility", 86000, "13 Oct", "Capacity review"),
      order("ord-2026-0129", "ORD-2026-0129", "10 Gbps Wholesale Link", "WHOLESALE", "Planning", 72000, "6 Oct", "Capacity review pending"),
    ],
    quotes: [
      quote("quo-xyz-1", "QUO-2026-0088", "Gqeberha PoP backhaul", "Sent", 54000, "4 Nov", "8 Oct"),
    ],
    documents: [
      document("xyz-wsa", "Wholesale service agreement", "Contract", "18 Jul 2020"),
    ],
    activity: [
      activity("xyz-a1", "ORDER_CREATED", "Order ORD-2026-0140 created", "Michael R.", "Yesterday"),
      activity("xyz-a2", "MESSAGE_RECEIVED", "Customer message received on capacity review", "Lerato Nkosi", "Yesterday"),
    ],
  },
  {
    id: "cus-2026-0021",
    organisationId: DEMO_ORGANISATION_ID,
    customerNumber: "CUS-2026-0021",
    name: "ConnectPro Resellers",
    type: "RESELLER",
    status: "ACTIVE",
    industry: "Connectivity resale",
    customerSince: "January 2022",
    paymentTerms: "Net 30",
    primaryContact: {
      name: "Jason Naidoo",
      email: "jason.naidoo@connectpro.demo",
      phone: "021 555 0188",
    },
    billingContact: {
      name: "Partner Accounts",
      email: "accounts@connectpro.demo",
      phone: "021 555 0189",
    },
    accountOwner: owners.sarah,
    siteCount: 18,
    serviceCount: 11,
    monthlyRecurringRevenue: 86750,
    lastActivityLabel: "2 days ago",
    updatedAt: "2026-10-12T11:00:00.000Z",
    sites: [
      site("cpr-cpt", "CPT-HUB", "Cape Town Hub", "14 Long Street", "Cape Town", "Western Cape", "ACTIVE", 3),
      site("cpr-jhb", "JHB-HUB", "Johannesburg Hub", "9 Katherine Street", "Johannesburg", "Gauteng", "ACTIVE", 4),
      site("cpr-dbn", "DBN-HUB", "Durban Hub", "2 Anton Lembede Street", "Durban", "KwaZulu-Natal", "ACTIVE", 2),
      site("cpr-plz", "PLZ-HUB", "Gqeberha Hub", "11 Western Road", "Gqeberha", "Eastern Cape", "ACTIVE", 2),
    ],
    services: [
      service("cpr-s1", "SRV-2026-00601", "200 Mbps Business Fibre", "Cape Town Hub", "200 Mbps", "ACTIVE", 14500),
      service("cpr-s2", "SRV-2026-00612", "500 Mbps Business Fibre", "Johannesburg Hub", "500 Mbps", "ACTIVE", 22600),
      service("cpr-s3", "SRV-2026-00620", "200 Mbps Business Fibre", "Durban Hub", "200 Mbps", "ACTIVE", 13200),
    ],
    orders: [
      order("ord-2026-0139", "ORD-2026-0139", "200 Mbps Business Fibre", "RESELLER", "Validation", 14500, "13 Oct", "Partner details"),
    ],
    quotes: [
      quote("quo-cpr-1", "QUO-2026-0104", "Four additional reseller tails", "Draft", 31200, "20 Nov", "11 Oct"),
    ],
    documents: [
      document("cpr-partner", "Reseller agreement", "Contract", "20 Jan 2022"),
    ],
    activity: [
      activity("cpr-a1", "QUOTE_ACCEPTED", "Quote QUO-2026-0071 accepted", "Jason Naidoo", "2 days ago"),
      activity("cpr-a2", "SERVICE_ACTIVATED", "Service SRV-2026-00620 activated", "Sarah M.", "2 days ago"),
    ],
  },
  {
    id: "cus-2026-0007",
    organisationId: DEMO_ORGANISATION_ID,
    customerNumber: "CUS-2026-0007",
    name: "Department of Education",
    type: "GOVERNMENT",
    status: "AT_RISK",
    industry: "Public education",
    customerSince: "April 2018",
    paymentTerms: "Net 45",
    primaryContact: {
      name: "Nomsa Dlamini",
      email: "nomsa.dlamini@education.demo",
      phone: "012 555 4007",
    },
    billingContact: {
      name: "SCM Payments",
      email: "scm.payments@education.demo",
      phone: "012 555 4012",
    },
    accountOwner: owners.david,
    siteCount: 25,
    serviceCount: 19,
    monthlyRecurringRevenue: 342000,
    lastActivityLabel: "Yesterday",
    updatedAt: "2026-10-13T09:20:00.000Z",
    sites: [
      site("doe-pta", "PTA-HQ", "Pretoria Campus", "222 Struben Street", "Pretoria", "Gauteng", "ACTIVE", 4),
      site("doe-jhb", "JHB-DIST", "Johannesburg District", "30 Loveday Street", "Johannesburg", "Gauteng", "ACTIVE", 3),
      site("doe-dbn", "DBN-DIST", "Durban District", "17 Dr Pixley Kaseme Street", "Durban", "KwaZulu-Natal", "ACTIVE", 3),
      site("doe-cpt", "CPT-DIST", "Cape Town District", "1 Dorp Street", "Cape Town", "Western Cape", "ACTIVE", 3),
      site("doe-plz", "PLZ-DIST", "Gqeberha District", "55 Govan Mbeki Avenue", "Gqeberha", "Eastern Cape", "ACTIVE", 2),
      site("doe-bfn", "BFN-DIST", "Bloemfontein Office", "40 Elizabeth Street", "Bloemfontein", "Free State", "PLANNED", 0),
    ],
    services: [
      service("doe-s1", "SRV-2026-00201", "1 Gbps Dedicated Fibre", "Pretoria Campus", "1 Gbps", "ACTIVE", 48000),
      service("doe-s2", "SRV-2026-00214", "500 Mbps Business Fibre", "Johannesburg District", "500 Mbps", "ACTIVE", 22000),
      service("doe-s3", "SRV-2026-00220", "200 Mbps Business Fibre", "Durban District", "200 Mbps", "SUSPENDED", 9600),
      service("doe-s4", "SRV-2026-00233", "1 Gbps Dedicated Fibre", "Cape Town District", "1 Gbps", "ACTIVE", 41000),
    ],
    orders: [
      order("ord-2026-0138", "ORD-2026-0138", "1 Gbps Dedicated Fibre", "GOVERNMENT", "Testing", 48000, "12 Oct", "Acceptance pending"),
      order("ord-2026-0137", "ORD-2026-0137", "500 Mbps Business Fibre", "GOVERNMENT", "Feasibility", 22000, "11 Oct", "Site information required"),
    ],
    quotes: [
      quote("quo-doe-1", "QUO-2026-0062", "District campus refresh", "Expired", 126000, "30 Sep", "1 Sep"),
      quote("quo-doe-2", "QUO-2026-0108", "Gqeberha district access", "Sent", 38000, "12 Nov", "6 Oct"),
    ],
    documents: [
      document("doe-sla", "Government SLA", "Contract", "4 Apr 2018"),
      document("doe-id", "Authorised signatory", "Identification", "4 Apr 2018"),
    ],
    activity: [
      activity("doe-a1", "MESSAGE_RECEIVED", "Customer message received requesting site drawings", "Nomsa Dlamini", "Yesterday"),
      activity("doe-a2", "INSTALLATION_SCHEDULED", "Installation scheduled at Pretoria Campus", "David K.", "12 Oct"),
      activity("doe-a3", "ORDER_CREATED", "Order ORD-2026-0137 created", "David K.", "11 Oct"),
    ],
  },
  {
    id: "cus-2026-0027",
    organisationId: DEMO_ORGANISATION_ID,
    customerNumber: "CUS-2026-0027",
    name: "Horizon Retail Group",
    type: "ENTERPRISE",
    status: "ACTIVE",
    industry: "Retail",
    customerSince: "November 2021",
    paymentTerms: "Net 30",
    primaryContact: {
      name: "Aisha Patel",
      email: "aisha.patel@horizonretail.demo",
      phone: "011 555 7720",
    },
    billingContact: {
      name: "Retail Shared Services",
      email: "ap@horizonretail.demo",
      phone: "011 555 7725",
    },
    accountOwner: owners.michael,
    siteCount: 9,
    serviceCount: 7,
    monthlyRecurringRevenue: 175500,
    lastActivityLabel: "3 days ago",
    updatedAt: "2026-10-11T16:05:00.000Z",
    sites: [
      site("hrg-sandton", "JHB-SAN", "Sandton Branch", "160 Rivonia Road", "Johannesburg", "Gauteng", "ACTIVE", 1),
      site("hrg-pta", "PTA-MEN", "Menlyn Store", "1 Menlyn Drive", "Pretoria", "Gauteng", "ACTIVE", 1),
      site("hrg-cpt", "CPT-CAN", "Canal Walk Store", "100 Century Boulevard", "Cape Town", "Western Cape", "ACTIVE", 1),
      site("hrg-dbn", "DBN-GAT", "Gateway Store", "1 Palm Boulevard", "Durban", "KwaZulu-Natal", "ACTIVE", 1),
    ],
    services: [
      service("hrg-s1", "SRV-2026-00710", "500 Mbps Business Fibre", "Sandton Branch", "500 Mbps", "ACTIVE", 24600),
      service("hrg-s2", "SRV-2026-00711", "500 Mbps Business Fibre", "Menlyn Store", "500 Mbps", "ACTIVE", 24600),
      service("hrg-s3", "SRV-2026-00718", "1 Gbps Dedicated Fibre", "Canal Walk Store", "1 Gbps", "PROVISIONING", 39000),
    ],
    orders: [
      order("ord-2026-0141", "ORD-2026-0141", "500 Mbps Business Fibre", "ENTERPRISE", "Planning", 24600, "14 Oct", "Scheduled"),
    ],
    quotes: [
      quote("quo-hrg-1", "QUO-2026-0114", "Gateway store access", "Sent", 18600, "18 Nov", "7 Oct"),
    ],
    documents: [
      document("hrg-msa", "Retail master agreement", "Contract", "11 Nov 2021"),
    ],
    activity: [
      activity("hrg-a1", "INSTALLATION_SCHEDULED", "Installation scheduled for Sandton Branch", "Lerato N.", "3 days ago"),
      activity("hrg-a2", "ORDER_CREATED", "Order ORD-2026-0141 created", "Michael R.", "14 Oct"),
    ],
  },
  extra({
    id: "cus-2026-0031",
    customerNumber: "CUS-2026-0031",
    name: "BlueWave Logistics",
    type: "ENTERPRISE",
    status: "PENDING",
    industry: "Logistics",
    customerSince: "October 2026",
    paymentTerms: "Net 30",
    primaryContact: { name: "Priya Pillay", email: "priya.pillay@bluewave.demo", phone: "021 555 3301" },
    billingContact: { name: "Priya Pillay", email: "finance@bluewave.demo", phone: "021 555 3302" },
    accountOwner: owners.sarah,
    siteCount: 4,
    serviceCount: 0,
    monthlyRecurringRevenue: 0,
    lastActivityLabel: "4 days ago",
    updatedAt: "2026-10-10T10:00:00.000Z",
    city: "Cape Town",
  }),
  extra({
    id: "cus-2026-0015",
    customerNumber: "CUS-2026-0015",
    name: "Highveld Mining",
    type: "ENTERPRISE",
    status: "ACTIVE",
    industry: "Mining",
    customerSince: "June 2017",
    paymentTerms: "Net 45",
    primaryContact: { name: "Johan Venter", email: "johan.venter@highveld.demo", phone: "011 555 8801" },
    billingContact: { name: "Mine Accounts", email: "accounts@highveld.demo", phone: "011 555 8804" },
    accountOwner: owners.michael,
    siteCount: 5,
    serviceCount: 3,
    monthlyRecurringRevenue: 96400,
    lastActivityLabel: "Today",
    updatedAt: "2026-10-14T07:15:00.000Z",
    city: "Johannesburg",
  }),
  extra({
    id: "cus-2026-0009",
    customerNumber: "CUS-2026-0009",
    name: "Northern Clinics Group",
    type: "GOVERNMENT",
    status: "PENDING",
    industry: "Healthcare",
    customerSince: "September 2026",
    paymentTerms: "Net 45",
    primaryContact: { name: "Zanele Khumalo", email: "zanele.khumalo@northernclinics.demo", phone: "012 555 6610" },
    billingContact: { name: "Clinic Finance", email: "finance@northernclinics.demo", phone: "012 555 6611" },
    accountOwner: owners.david,
    siteCount: 7,
    serviceCount: 1,
    monthlyRecurringRevenue: 12800,
    lastActivityLabel: "Yesterday",
    updatedAt: "2026-10-13T12:40:00.000Z",
    city: "Pretoria",
  }),
  extra({
    id: "cus-2026-0004",
    customerNumber: "CUS-2026-0004",
    name: "SignalPath Networks",
    type: "WHOLESALE",
    status: "SUSPENDED",
    industry: "Telecommunications",
    customerSince: "February 2016",
    paymentTerms: "Net 30",
    primaryContact: { name: "Kevin Botha", email: "kevin.botha@signalpath.demo", phone: "031 555 2044" },
    billingContact: { name: "Credit Control", email: "credit@signalpath.demo", phone: "031 555 2045" },
    accountOwner: owners.michael,
    siteCount: 3,
    serviceCount: 2,
    monthlyRecurringRevenue: 54200,
    lastActivityLabel: "6 days ago",
    updatedAt: "2026-10-08T09:00:00.000Z",
    city: "Durban",
  }),
  extra({
    id: "cus-2026-0024",
    customerNumber: "CUS-2026-0024",
    name: "UrbanGrid Property",
    type: "RESELLER",
    status: "ACTIVE",
    industry: "Property",
    customerSince: "May 2023",
    paymentTerms: "Net 30",
    primaryContact: { name: "Fatima Jacobs", email: "fatima.jacobs@urbangrid.demo", phone: "021 555 9090" },
    billingContact: { name: "Property Accounts", email: "accounts@urbangrid.demo", phone: "021 555 9091" },
    accountOwner: owners.sarah,
    siteCount: 8,
    serviceCount: 5,
    monthlyRecurringRevenue: 41300,
    lastActivityLabel: "2 days ago",
    updatedAt: "2026-10-12T15:30:00.000Z",
    city: "Cape Town",
  }),
  extra({
    id: "cus-2026-0011",
    customerNumber: "CUS-2026-0011",
    name: "KwaZulu Schools Trust",
    type: "GOVERNMENT",
    status: "AT_RISK",
    industry: "Education",
    customerSince: "August 2019",
    paymentTerms: "Net 60",
    primaryContact: { name: "Sipho Ndaba", email: "sipho.ndaba@kzschools.demo", phone: "031 555 7171" },
    billingContact: { name: "Trust Finance", email: "finance@kzschools.demo", phone: "031 555 7172" },
    accountOwner: owners.david,
    siteCount: 14,
    serviceCount: 9,
    monthlyRecurringRevenue: 88900,
    lastActivityLabel: "Yesterday",
    updatedAt: "2026-10-13T08:05:00.000Z",
    city: "Durban",
  }),
  extra({
    id: "cus-2026-0033",
    customerNumber: "CUS-2026-0033",
    name: "East Cape Cold Storage",
    type: "ENTERPRISE",
    status: "ACTIVE",
    industry: "Cold chain",
    customerSince: "February 2024",
    paymentTerms: "Net 30",
    primaryContact: { name: "Helen September", email: "helen.september@eastcape.demo", phone: "041 555 1212" },
    billingContact: { name: "Helen September", email: "accounts@eastcape.demo", phone: "041 555 1213" },
    accountOwner: owners.nomsa,
    siteCount: 2,
    serviceCount: 2,
    monthlyRecurringRevenue: 36250,
    lastActivityLabel: "3 days ago",
    updatedAt: "2026-10-11T13:25:00.000Z",
    city: "Gqeberha",
  }),
];

export function getDemoCustomer(id: string) {
  return demoCustomers.find((customer) => customer.id === id);
}

type ExtraInput = {
  id: string;
  customerNumber: string;
  name: string;
  type: CustomerType;
  status: CustomerStatus;
  industry: string;
  customerSince: string;
  paymentTerms: string;
  primaryContact: CustomerContact;
  billingContact: CustomerContact;
  accountOwner: AccountOwner;
  siteCount: number;
  serviceCount: number;
  monthlyRecurringRevenue: number;
  lastActivityLabel: string;
  updatedAt: string;
  city: string;
};

function extra(input: ExtraInput): CustomerRecord {
  const code = input.customerNumber.slice(-4);
  const primarySite = `${input.name.split(" ")[0]} ${input.city}`;
  const { city, ...record } = input;

  return {
    ...record,
    organisationId: DEMO_ORGANISATION_ID,
    sites: [
      site(`${input.id}-1`, `${code}-01`, primarySite, "1 Main Street", city, provinceFor(city), "ACTIVE", 1),
      site(`${input.id}-2`, `${code}-02`, `${city} Operations`, "18 Harbour Road", city, provinceFor(city), input.status === "PENDING" ? "PLANNED" : "ACTIVE", input.serviceCount > 1 ? 1 : 0),
    ],
    services:
      input.serviceCount === 0
        ? []
        : [
            service(
              `${input.id}-svc`,
              `SRV-2026-0${code}`,
              input.type === "WHOLESALE" ? "10 Gbps Wholesale Link" : "500 Mbps Business Fibre",
              primarySite,
              input.type === "WHOLESALE" ? "10 Gbps" : "500 Mbps",
              input.status === "SUSPENDED" ? "SUSPENDED" : "ACTIVE",
              input.monthlyRecurringRevenue,
            ),
          ],
    orders: [
      order(
        `ord-${code}`,
        `ORD-2026-0${code}`,
        input.type === "WHOLESALE" ? "10 Gbps Wholesale Link" : "500 Mbps Business Fibre",
        input.type,
        input.status === "PENDING" ? "Validation" : "Planning",
        Math.max(input.monthlyRecurringRevenue, 12000),
        "8 Oct",
        input.status === "PENDING" ? "Onboarding" : "In delivery",
      ),
    ],
    quotes: [
      quote(
        `quo-${code}`,
        `QUO-2026-0${code}`,
        `${primarySite} access`,
        input.status === "PENDING" ? "Draft" : "Sent",
        Math.max(input.monthlyRecurringRevenue, 15000),
        "30 Nov",
        "1 Oct",
      ),
    ],
    documents: [document(`${input.id}-doc`, "Service agreement", "Contract", input.customerSince)],
    activity: [
      activity(`${input.id}-a1`, "ORDER_CREATED", `Order ORD-2026-0${code} created`, input.accountOwner.name, input.lastActivityLabel),
      activity(`${input.id}-a2`, "MESSAGE_RECEIVED", "Customer message received", input.primaryContact.name, input.lastActivityLabel),
    ],
  };
}

function site(
  id: string,
  siteCode: string,
  name: string,
  addressLine1: string,
  city: string,
  province: string,
  status: SiteStatus,
  serviceCount: number,
): CustomerSite {
  return { id, siteCode, name, addressLine1, city, province, status, serviceCount };
}

function service(
  id: string,
  serviceNumber: string,
  productName: string,
  siteName: string,
  bandwidth: string,
  status: ServiceStatus,
  monthlyRecurringCharge: number,
): CustomerService {
  return { id, serviceNumber, productName, siteName, bandwidth, status, monthlyRecurringCharge };
}

function order(
  id: string,
  orderNumber: string,
  productName: string,
  orderType: CustomerType,
  status: string,
  value: number,
  createdLabel: string,
  deliveryStatus: string,
): CustomerOrder {
  return { id, orderNumber, productName, orderType, status, value, createdLabel, deliveryStatus };
}

function quote(
  id: string,
  quoteNumber: string,
  description: string,
  status: string,
  value: number,
  expiryLabel: string,
  createdLabel: string,
): CustomerQuote {
  return { id, quoteNumber, description, status, value, expiryLabel, createdLabel };
}

function document(id: string, name: string, category: string, uploadedLabel: string): CustomerDocument {
  return { id, name, category, uploadedLabel };
}

function activity(
  id: string,
  action: CustomerActivity["action"],
  summary: string,
  actorName: string,
  occurredLabel: string,
): CustomerActivity {
  return { id, action, summary, actorName, occurredLabel };
}

function provinceFor(city: string) {
  if (city === "Cape Town") return "Western Cape";
  if (city === "Durban") return "KwaZulu-Natal";
  if (city === "Gqeberha") return "Eastern Cape";
  if (city === "Pretoria" || city === "Johannesburg") return "Gauteng";
  return "Gauteng";
}
