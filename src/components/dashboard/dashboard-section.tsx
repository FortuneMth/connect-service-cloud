import type { ReactNode } from "react";
import { cn } from "cn";

export function DashboardSection({
  title,
  children,
  className,
}: {
  title: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section className={cn("min-w-0 overflow-hidden rounded-lg border bg-card", className)}>
      <div className="border-b px-4 py-2.5">
        <h2 className="text-sm font-medium">{title}</h2>
      </div>
      {children}
    </section>
  );
}
