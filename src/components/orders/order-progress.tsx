export function OrderProgress({ value }: { value: number }) {
  const progress = Math.max(0, Math.min(100, value));

  return (
    <div className="flex min-w-0 items-center gap-2">
      <div className="h-1.5 w-16 overflow-hidden rounded-full bg-muted" aria-hidden>
        <div className="h-full bg-foreground" style={{ width: `${progress}%` }} />
      </div>
      <span className="tabular-nums">{progress}%</span>
    </div>
  );
}
