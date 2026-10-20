import type { Metadata } from "next";

import { DeliveryTaskDetail } from "@/components/service-delivery/delivery-task-detail";
import { deliveryTasks, getDemoTask } from "@/data/service-delivery";

export function generateStaticParams() {
  return deliveryTasks.map((task) => ({ id: task.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const task = getDemoTask(id);

  return {
    title: task ? `${task.orderNumber} task` : "Delivery task",
  };
}

export default async function DeliveryTaskPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return <DeliveryTaskDetail id={id} />;
}
