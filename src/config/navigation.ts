import {
  Building2,
  Cable,
  ChartColumn,
  ClipboardList,
  CreditCard,
  FileText,
  FolderOpen,
  Handshake,
  LayoutDashboard,
  LifeBuoy,
  MessageSquare,
  Package,
  Receipt,
  Route,
  Settings,
  Wrench,
  type LucideIcon,
} from "lucide-react";

export type NavItem = {
  title: string;
  href: string;
  icon: LucideIcon;
  description: string;
  emptyTitle: string;
  emptyDescription: string;
  /** The page renders its own header, including account controls. */
  ownsHeader?: boolean;
};

export type NavGroup = {
  label: string;
  items: NavItem[];
};

export type ShellConfig = {
  areaLabel: string;
  homeHref: string;
  groups: NavGroup[];
};

export const internalShell: ShellConfig = {
  areaLabel: "Operations",
  homeHref: "/dashboard",
  groups: [
    {
      label: "Main",
      items: [
        {
          title: "Dashboard",
          href: "/dashboard",
          icon: LayoutDashboard,
          description:
            "Monitor orders, service delivery, installations, activations and operational performance.",
          emptyTitle: "Nothing to show",
          emptyDescription: "Operational summaries will appear on this dashboard.",
          ownsHeader: true,
        },
      ],
    },
    {
      label: "Customers",
      items: [
        {
          title: "Customers",
          href: "/customers",
          icon: Building2,
          description: "Manage organisations, contacts, sites, and customer relationships.",
          emptyTitle: "No customers in view",
          emptyDescription:
            "Customer accounts will appear here as they are added to the platform.",
          ownsHeader: true,
        },
      ],
    },
    {
      label: "Sales",
      items: [
        {
          title: "Sales",
          href: "/sales",
          icon: Handshake,
          description: "Manage opportunities, pipeline value, and commercial activity.",
          emptyTitle: "No sales activity",
          emptyDescription:
            "Opportunities and commercial work will be tracked in this workspace.",
          ownsHeader: true,
        },
        {
          title: "Quotes",
          href: "/quotes",
          icon: FileText,
          description: "Create, manage, and track connectivity proposals from draft to acceptance.",
          emptyTitle: "No quotes yet",
          emptyDescription:
            "Quotes you prepare will stay here until they are accepted or withdrawn.",
          ownsHeader: true,
        },
      ],
    },
    {
      label: "Delivery",
      items: [
        {
          title: "Orders",
          href: "/orders",
          icon: ClipboardList,
          description: "Manage customer orders from acceptance through activation and billing.",
          emptyTitle: "No orders in progress",
          emptyDescription:
            "Accepted orders will show here until the service is activated.",
          ownsHeader: true,
        },
        {
          title: "Service Delivery",
          href: "/service-delivery",
          icon: Route,
          description: "Manage operational delivery from feasibility through activation.",
          emptyTitle: "No delivery work in progress",
          emptyDescription:
            "Delivery tasks will appear here as orders move toward activation.",
          ownsHeader: true,
        },
        {
          title: "Installations",
          href: "/installations",
          icon: Wrench,
          description: "Schedule, prepare, execute, and complete customer site installations.",
          emptyTitle: "No installations scheduled",
          emptyDescription: "Upcoming and completed site work will be listed here.",
          ownsHeader: true,
        },
        {
          title: "Services",
          href: "/services",
          icon: Cable,
          description: "Monitor provisioned connectivity from order through the live service.",
          emptyTitle: "No services listed",
          emptyDescription:
            "Services will appear here as they are provisioned and activated.",
          ownsHeader: true,
        },
      ],
    },
    {
      label: "Finance",
      items: [
        {
          title: "Billing",
          href: "/billing",
          icon: Receipt,
          description: "Invoices, recurring charges, and revenue currently in progress.",
          emptyTitle: "No billing items",
          emptyDescription:
            "Invoices and recurring charges will be managed from this workspace.",
        },
      ],
    },
    {
      label: "Communication",
      items: [
        {
          title: "Messages",
          href: "/messages",
          icon: MessageSquare,
          description: "Conversations with customers and internal teams.",
          emptyTitle: "No messages",
          emptyDescription: "Operational conversations will collect here.",
        },
        {
          title: "Documents",
          href: "/documents",
          icon: FolderOpen,
          description: "Contracts, designs, and delivery documents for active work.",
          emptyTitle: "No documents",
          emptyDescription: "Files shared on orders and services will be stored here.",
        },
      ],
    },
    {
      label: "Analytics",
      items: [
        {
          title: "Reports",
          href: "/reports",
          icon: ChartColumn,
          description: "Operational and commercial reporting across the platform.",
          emptyTitle: "No reports yet",
          emptyDescription: "Saved and scheduled reports will be available in this section.",
        },
      ],
    },
    {
      label: "System",
      items: [
        {
          title: "Settings",
          href: "/settings",
          icon: Settings,
          description: "Workspace preferences and platform configuration.",
          emptyTitle: "Settings are not available yet",
          emptyDescription: "Configuration for this workspace will be managed here.",
        },
      ],
    },
  ],
};

export const portalShell: ShellConfig = {
  areaLabel: "Customer portal",
  homeHref: "/portal",
  groups: [
    {
      label: "Account",
      items: [
        {
          title: "Overview",
          href: "/portal",
          icon: LayoutDashboard,
          description: "A snapshot of your orders, services, and account.",
          emptyTitle: "Nothing to show",
          emptyDescription: "Account activity will appear on this overview.",
        },
        {
          title: "My Orders",
          href: "/portal/orders",
          icon: Package,
          description: "Track your connectivity orders from placement through activation.",
          emptyTitle: "No orders",
          emptyDescription:
            "Orders you place will appear here with their current progress.",
        },
        {
          title: "Services",
          href: "/portal/services",
          icon: Cable,
          description: "Connectivity services currently active on your account.",
          emptyTitle: "No services",
          emptyDescription: "Active services will be listed here after activation.",
        },
        {
          title: "Documents",
          href: "/portal/documents",
          icon: FolderOpen,
          description: "Contracts, service documents, and files shared with you.",
          emptyTitle: "No documents",
          emptyDescription: "Files shared with your account will appear here.",
        },
        {
          title: "Billing",
          href: "/portal/billing",
          icon: CreditCard,
          description: "Invoices and the current balance on your account.",
          emptyTitle: "No invoices",
          emptyDescription: "Invoices and payments for your account will show here.",
        },
        {
          title: "Messages",
          href: "/portal/messages",
          icon: MessageSquare,
          description: "Conversations with your Connect Service Cloud team.",
          emptyTitle: "No messages",
          emptyDescription: "Messages from your service team will appear here.",
        },
        {
          title: "Support",
          href: "/portal/support",
          icon: LifeBuoy,
          description: "Request help and follow open support requests.",
          emptyTitle: "No support requests",
          emptyDescription:
            "Requests you raise will be tracked here until they are resolved.",
        },
        {
          title: "Company Profile",
          href: "/portal/profile",
          icon: Building2,
          description: "Your company details and the contacts on this account.",
          emptyTitle: "Profile details are not available yet",
          emptyDescription: "Company information for this account will be shown here.",
        },
      ],
    },
  ],
};

export function navItems(config: ShellConfig) {
  return config.groups.flatMap((group) => group.items);
}

export function findNavItem(config: ShellConfig, href: string) {
  return navItems(config).find((item) => item.href === href);
}

export function findNavItemByHref(href: string) {
  return findNavItem(internalShell, href) ?? findNavItem(portalShell, href);
}

export function findSectionNavItem(config: ShellConfig, pathname: string) {
  const exact = findNavItem(config, pathname);

  if (exact) {
    return exact;
  }

  return navItems(config)
    .filter(
      (item) =>
        item.href !== config.homeHref &&
        (pathname === item.href || pathname.startsWith(`${item.href}/`)),
    )
    .sort((left, right) => right.href.length - left.href.length)[0];
}

export function buildBreadcrumbs(config: ShellConfig, pathname: string) {
  const home = findNavItem(config, config.homeHref);
  const current = findSectionNavItem(config, pathname);

  if (!home || !current) {
    return [];
  }

  if (current.href === home.href) {
    return [{ label: home.title, href: home.href }];
  }

  return [
    { label: home.title, href: home.href },
    { label: current.title, href: current.href },
  ];
}
