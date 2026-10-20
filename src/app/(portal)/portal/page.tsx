import type { Metadata } from "next";
import { Cable, CreditCard, Package, Wrench } from "lucide-react";

import { RecordList } from "@/components/shell/record-list";
import { StatCard } from "@/components/shell/stat-card";

export const metadata: Metadata = {
  title: "Overview",
};

export default function PortalHomePage() {
  return (
    <div className="flex flex-col gap-6">
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Active Orders" value="3" detail="Currently in progress" icon={Package} />
        <StatCard label="Services" value="8" detail="Active on your account" icon={Cable} />
        <StatCard
          label="Upcoming Installation"
          value="Thu 09:00"
          detail="Next scheduled visit"
          icon={Wrench}
        />
        <StatCard
          label="Outstanding Balance"
          value="$2,480"
          detail="Invoices not yet settled"
          icon={CreditCard}
        />
      </section>
      <section className="grid gap-4 lg:grid-cols-3">
        <RecordList
          title="Recent Orders"
          rows={[
            {
              id: "order-1",
              primary: "ORD-10482",
              secondary: "Fibre access · Order progress",
              status: "In progress",
            },
            {
              id: "order-2",
              primary: "ORD-10421",
              secondary: "Branch connectivity · Order progress",
              status: "Scheduled",
            },
            {
              id: "order-3",
              primary: "ORD-10388",
              secondary: "Ethernet · Activated",
              status: "Activated",
            },
          ]}
        />
        <RecordList
          title="Recent Messages"
          rows={[
            {
              id: "msg-1",
              primary: "Installation window confirmed",
              secondary: "Yesterday",
            },
            {
              id: "msg-2",
              primary: "Service document shared",
              secondary: "2 days ago",
            },
            {
              id: "msg-3",
              primary: "Order accepted",
              secondary: "Last week",
            },
          ]}
        />
        <RecordList
          title="Recent Documents"
          rows={[
            {
              id: "doc-1",
              primary: "Service schedule",
              secondary: "PDF · Yesterday",
            },
            {
              id: "doc-2",
              primary: "Master service agreement",
              secondary: "PDF · Last month",
            },
            {
              id: "doc-3",
              primary: "Activation notice",
              secondary: "PDF · Last month",
            },
          ]}
        />
      </section>
    </div>
  );
}
