import { SalesPanel } from "@/components/sales/sales-panel";
import { StatusBadge } from "@/components/shell/status-badge";
import { Button } from "@/components/ui/button";
import { TASK_PRIORITY_LABEL, TASK_STATUS_LABEL, nextTaskStatus, type OpportunityRecord } from "@/data/sales";

export function OpportunityTasks({
  opportunity,
  onToggle,
}: {
  opportunity: OpportunityRecord;
  onToggle: (taskId: string) => void;
}) {
  return (
    <SalesPanel title="Tasks">
      {opportunity.tasks.length === 0 ? (
        <p className="px-4 py-6 text-sm text-muted-foreground">No open tasks on this opportunity.</p>
      ) : (
        <>
          <div className="hidden min-w-0 md:block">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[640px] text-sm">
                <thead>
                  <tr className="border-b text-left text-xs text-muted-foreground">
                    <th className="px-4 py-2 font-medium">Task</th>
                    <th className="px-4 py-2 font-medium">Owner</th>
                    <th className="px-4 py-2 font-medium">Due</th>
                    <th className="px-4 py-2 font-medium">Status</th>
                    <th className="px-4 py-2 font-medium">Priority</th>
                    <th className="px-4 py-2 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {opportunity.tasks.map((task) => (
                    <tr key={task.id} className="border-b last:border-b-0">
                      <td className="px-4 py-2.5">{task.title}</td>
                      <td className="px-4 py-2.5 whitespace-nowrap">{task.ownerName}</td>
                      <td className="px-4 py-2.5 whitespace-nowrap">{task.dueLabel}</td>
                      <td className="px-4 py-2.5">
                        <StatusBadge status={TASK_STATUS_LABEL[task.status]} />
                      </td>
                      <td className="px-4 py-2.5">
                        <StatusBadge status={TASK_PRIORITY_LABEL[task.priority]} />
                      </td>
                      <td className="px-4 py-2.5">
                        <Button type="button" variant="outline" size="sm" onClick={() => onToggle(task.id)}>
                          {actionLabel(task.status)}
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <ul className="flex flex-col md:hidden">
            {opportunity.tasks.map((task) => (
              <li key={task.id} className="border-b px-4 py-3 last:border-b-0">
                <p className="text-sm font-medium">{task.title}</p>
                <dl className="mt-2 grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <dt className="text-xs text-muted-foreground">Owner</dt>
                    <dd>{task.ownerName}</dd>
                  </div>
                  <div>
                    <dt className="text-xs text-muted-foreground">Due</dt>
                    <dd>{task.dueLabel}</dd>
                  </div>
                  <div>
                    <dt className="text-xs text-muted-foreground">Status</dt>
                    <dd className="mt-1">
                      <StatusBadge status={TASK_STATUS_LABEL[task.status]} />
                    </dd>
                  </div>
                  <div>
                    <dt className="text-xs text-muted-foreground">Priority</dt>
                    <dd className="mt-1">
                      <StatusBadge status={TASK_PRIORITY_LABEL[task.priority]} />
                    </dd>
                  </div>
                </dl>
                <Button type="button" variant="outline" size="sm" className="mt-3" onClick={() => onToggle(task.id)}>
                  {actionLabel(task.status)}
                </Button>
              </li>
            ))}
          </ul>
        </>
      )}
    </SalesPanel>
  );
}

function actionLabel(status: OpportunityRecord["tasks"][number]["status"]) {
  const next = nextTaskStatus(status);
  if (next === "IN_PROGRESS") return "Start";
  if (next === "DONE") return "Complete";
  return "Reopen";
}
