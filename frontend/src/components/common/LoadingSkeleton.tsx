export function CardSkeleton() {
  return (
    <div className="animate-pulse rounded-xl border border-slate-200 bg-white p-5">
      <div className="mb-3 h-4 w-3/4 rounded bg-slate-200" />
      <div className="mb-2 h-3 w-1/2 rounded bg-slate-200" />
      <div className="mb-4 h-3 w-full rounded bg-slate-200" />
      <div className="flex justify-between">
        <div className="h-6 w-20 rounded-full bg-slate-200" />
        <div className="h-6 w-16 rounded bg-slate-200" />
      </div>
    </div>
  );
}

export function TableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="animate-pulse space-y-3">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex gap-4 rounded bg-white p-4">
          <div className="h-4 w-1/4 rounded bg-slate-200" />
          <div className="h-4 w-1/3 rounded bg-slate-200" />
          <div className="h-4 w-1/6 rounded bg-slate-200" />
          <div className="h-4 w-1/6 rounded bg-slate-200" />
        </div>
      ))}
    </div>
  );
}
