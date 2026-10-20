import Link from "next/link";

import { CustomerPanel } from "@/components/customers/customer-panel";
import { StatusBadge } from "@/components/shell/status-badge";
import { CUSTOMER_TYPE_LABEL, formatRand, type CustomerRecord } from "@/data/customers";

export function CustomerOrders({ customer }: { customer: CustomerRecord }) {
  return (
    <CustomerPanel title="Orders">
      {customer.orders.length === 0 ? (
        <p className="px-4 py-6 text-sm text-muted-foreground">No orders for this customer yet.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-sm">
            <thead>
              <tr className="border-b text-left text-xs text-muted-foreground">
                <th className="px-4 py-2 font-medium">Order number</th>
                <th className="px-4 py-2 font-medium">Product</th>
                <th className="px-4 py-2 font-medium">Order type</th>
                <th className="px-4 py-2 font-medium">Status</th>
                <th className="px-4 py-2 font-medium">Value</th>
                <th className="px-4 py-2 font-medium">Created</th>
                <th className="px-4 py-2 font-medium">Delivery status</th>
              </tr>
            </thead>
            <tbody>
              {customer.orders.map((order) => (
                <tr key={order.id} className="border-b last:border-b-0">
                  <td className="px-4 py-2.5 font-medium whitespace-nowrap">
                    <Link href={`/orders/${order.id}`} className="underline-offset-4 hover:underline">
                      {order.orderNumber}
                    </Link>
                  </td>
                  <td className="px-4 py-2.5 whitespace-nowrap">{order.productName}</td>
                  <td className="px-4 py-2.5 whitespace-nowrap">{CUSTOMER_TYPE_LABEL[order.orderType]}</td>
                  <td className="px-4 py-2.5">
                    <StatusBadge status={order.status} />
                  </td>
                  <td className="px-4 py-2.5 whitespace-nowrap tabular-nums">{formatRand(order.value)}</td>
                  <td className="px-4 py-2.5 whitespace-nowrap text-muted-foreground">{order.createdLabel}</td>
                  <td className="px-4 py-2.5">{order.deliveryStatus}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </CustomerPanel>
  );
}
