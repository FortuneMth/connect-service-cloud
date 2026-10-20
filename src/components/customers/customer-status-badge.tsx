import { StatusBadge } from "@/components/shell/status-badge";
import { CUSTOMER_STATUS_LABEL, type CustomerStatus } from "@/data/customers";

export function CustomerStatusBadge({ status }: { status: CustomerStatus }) {
  return <StatusBadge status={CUSTOMER_STATUS_LABEL[status]} />;
}
