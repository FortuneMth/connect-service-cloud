import { DashboardSection } from "@/components/dashboard/dashboard-section";
import { StatusBadge } from "@/components/shell/status-badge";
import {
  ORDER_STATUS_LABEL,
  ORDER_TYPE_LABEL,
  type RecentOrder,
} from "@/data/operations-dashboard";

export function RecentOrders({ orders }: { orders: RecentOrder[] }) {
  return (
    <DashboardSection title="Recent Orders">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[760px] text-sm">
          <thead>
            <tr className="border-b text-left text-xs text-muted-foreground">
              <th scope="col" className="px-4 py-2 font-medium">Order</th>
              <th scope="col" className="px-4 py-2 font-medium">Customer</th>
              <th scope="col" className="px-4 py-2 font-medium">Product</th>
              <th scope="col" className="px-4 py-2 font-medium">Type</th>
              <th scope="col" className="px-4 py-2 font-medium">Status</th>
              <th scope="col" className="px-4 py-2 font-medium">Created</th>
              <th scope="col" className="px-4 py-2 font-medium">Owner</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.orderNumber} className="border-b last:border-b-0">
                <td className="px-4 py-2.5 font-medium whitespace-nowrap tabular-nums">
                  {order.orderNumber}
                </td>
                <td className="px-4 py-2.5 whitespace-nowrap">{order.customerName}</td>
                <td className="px-4 py-2.5 whitespace-nowrap">{order.productName}</td>
                <td className="px-4 py-2.5 whitespace-nowrap text-muted-foreground">
                  {ORDER_TYPE_LABEL[order.orderType]}
                </td>
                <td className="px-4 py-2.5">
                  <StatusBadge status={ORDER_STATUS_LABEL[order.status]} />
                </td>
                <td className="px-4 py-2.5 whitespace-nowrap text-muted-foreground tabular-nums">
                  {order.createdLabel}
                </td>
                <td className="px-4 py-2.5 whitespace-nowrap">{order.ownerName}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </DashboardSection>
  );
}
