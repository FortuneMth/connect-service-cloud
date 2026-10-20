import type { Metadata } from "next";

import { ActivityFeed } from "@/components/dashboard/activity-feed";
import { AttentionOrders } from "@/components/dashboard/attention-orders";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { DashboardKpi } from "@/components/dashboard/dashboard-kpi";
import { OrderPipeline } from "@/components/dashboard/order-pipeline";
import { QuickActions } from "@/components/dashboard/quick-actions";
import { RecentOrders } from "@/components/dashboard/recent-orders";
import { UpcomingInstallations } from "@/components/dashboard/upcoming-installations";
import {
  activityFeed,
  attentionOrders,
  dashboardKpis,
  pipelineStages,
  recentOrders,
  upcomingInstallations,
} from "@/data/operations-dashboard";

export const metadata: Metadata = {
  title: "Operations Dashboard",
};

export default function DashboardPage() {
  return (
    <div className="flex min-w-0 flex-col gap-6">
      <DashboardHeader />
      <QuickActions />
      <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
        {dashboardKpis.map((kpi) => (
          <DashboardKpi key={kpi.id} kpi={kpi} />
        ))}
      </section>
      <OrderPipeline stages={pipelineStages} />
      <AttentionOrders orders={attentionOrders} />
      <RecentOrders orders={recentOrders} />
      <div className="grid items-start gap-6 xl:grid-cols-2">
        <UpcomingInstallations installations={upcomingInstallations} />
        <ActivityFeed items={activityFeed} />
      </div>
    </div>
  );
}
