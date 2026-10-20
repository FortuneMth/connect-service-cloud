import { StatusBadge } from "@/components/shell/status-badge";
import { OPPORTUNITY_STAGE_LABEL, type OpportunityStage } from "@/data/sales";

export function OpportunityStageBadge({ stage }: { stage: OpportunityStage }) {
  return <StatusBadge status={OPPORTUNITY_STAGE_LABEL[stage]} />;
}
