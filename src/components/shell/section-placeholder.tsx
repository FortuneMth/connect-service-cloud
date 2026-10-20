import { EmptyState } from "@/components/shell/empty-state";
import { findNavItemByHref } from "@/config/navigation";

export function SectionPlaceholder({ href }: { href: string }) {
  const item = findNavItemByHref(href);

  if (!item) {
    return null;
  }

  return (
    <EmptyState
      icon={item.icon}
      title={item.emptyTitle}
      description={item.emptyDescription}
    />
  );
}
