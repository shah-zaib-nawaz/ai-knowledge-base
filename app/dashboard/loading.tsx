export default function Loading() {
  return (
    <div className="max-w-3xl mx-auto py-12 px-4 sm:px-6 space-y-10">
      {/* Header Skeleton */}
      <div className="flex items-center justify-between border-b pb-5">
        <div className="space-y-2">
          <div className="h-8 w-64 animate-pulse rounded bg-muted/60" />
          <div className="h-4 w-96 animate-pulse rounded bg-muted/40" />
        </div>
        <div className="h-10 w-24 animate-pulse rounded bg-muted/60" />
      </div>

      {/* Main Content Grid Skeleton */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Left Column: Upload & Actions */}
        <div className="space-y-6">
          <div className="rounded-xl border bg-card p-6 space-y-4">
            <div className="space-y-2">
              <div className="h-5 w-40 animate-pulse rounded bg-muted/60" />
              <div className="h-4 w-48 animate-pulse rounded bg-muted/40" />
            </div>
            <div className="h-10 w-full animate-pulse rounded bg-muted/40" />
            <div className="h-10 w-full animate-pulse rounded bg-muted/60" />
          </div>

          <div className="h-11 w-full animate-pulse rounded bg-muted/60" />
        </div>

        {/* Right Column: Usage Metrics */}
        <div>
          <div className="rounded-xl border bg-card p-6 h-full space-y-4">
            <div className="space-y-2">
              <div className="h-5 w-28 animate-pulse rounded bg-muted/60" />
              <div className="h-4 w-56 animate-pulse rounded bg-muted/40" />
            </div>
            <div className="grid grid-cols-2 gap-4 pt-2">
              <div className="rounded-xl border bg-muted/30 p-4 h-20 space-y-2 flex flex-col justify-center">
                <div className="h-6 w-12 animate-pulse rounded bg-muted/60" />
                <div className="h-3 w-16 animate-pulse rounded bg-muted/40" />
              </div>
              <div className="rounded-xl border bg-muted/30 p-4 h-20 space-y-2 flex flex-col justify-center">
                <div className="h-6 w-20 animate-pulse rounded bg-muted/60" />
                <div className="h-3 w-12 animate-pulse rounded bg-muted/40" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Section: Document List Skeleton */}
      <div className="rounded-xl border bg-card p-6 space-y-4">
        <div className="space-y-2">
          <div className="h-5 w-36 animate-pulse rounded bg-muted/60" />
          <div className="h-4 w-64 animate-pulse rounded bg-muted/40" />
        </div>
        <div className="divide-y rounded-md border bg-muted/10">
          {[...Array(3)].map((_, idx) => (
            <div key={idx} className="flex items-center justify-between p-3.5">
              <div className="flex items-center gap-3 w-1/3">
                <div className="h-4 w-4 shrink-0 animate-pulse rounded bg-muted/60" />
                <div className="h-4 w-full animate-pulse rounded bg-muted/40" />
              </div>
              <div className="h-5 w-16 animate-pulse rounded-full bg-muted/60" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}