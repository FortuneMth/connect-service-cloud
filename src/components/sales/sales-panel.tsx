import type { ReactNode } from "react";
import { cn } from "cn";

export function SalesPanel({
  title,
  description,
  children,
  className,
  action,
}: {
  title: string;
  description?: string;
  children: ReactNode;
  className?: string;
  action?: ReactNode;
}) {
  return (
    <section className={cn("min-w-0 overflow-hidden rounded-lg border bg-card", className)}>
      <div className="flex items-start justify-between gap-3 border-b px-4 py-2.5">
        <div>
          <h2 className="text-sm font-medium">{title}</h2>
          {description ? <p className="mt-0.5 text-xs text-muted-foreground">{description}</p> : null}
        </div>
        {action}
      </div>
      {children}
    </section>
  );
}
