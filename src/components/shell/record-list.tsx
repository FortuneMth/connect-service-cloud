import { StatusBadge } from "@/components/shell/status-badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function RecordList({
  title,
  rows,
}: {
  title: string;
  rows: {
    id: string;
    primary: string;
    secondary: string;
    status?: string;
  }[];
}) {
  return (
    <Card size="sm" className="h-full">
      <CardHeader className="border-b">
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <ul>
          {rows.map((row) => (
            <li
              key={row.id}
              className="flex items-center justify-between gap-3 border-b py-3 last:border-b-0"
            >
              <div className="min-w-0">
                <p className="truncate text-sm font-medium">{row.primary}</p>
                <p className="truncate text-xs text-muted-foreground">{row.secondary}</p>
              </div>
              {row.status ? <StatusBadge status={row.status} /> : null}
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
