/**
 * Dashboard Loading Skeleton
 *
 * Displays a loading state with animated skeleton that matches
 * the actual dashboard layout and pastel color scheme.
 */

export function DashboardSkeleton() {
  return (
    <div className="max-w-[1200px] mx-auto flex flex-col gap-8 pb-20 animate-pulse">
      {/* Hero Section Skeleton */}
      <div className="h-32 bg-muted/50 rounded-2xl" />

      {/* Stats Cards Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="h-32 bg-primary/10 rounded-2xl"
          />
        ))}
      </div>

      {/* Tanks Section Header Skeleton */}
      <div className="flex items-center justify-between">
        <div className="h-7 w-32 bg-muted/50 rounded-lg" />
        <div className="h-6 w-24 bg-muted/50 rounded-lg" />
      </div>

      {/* Tank Cards Skeleton */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        {[1, 2].map((i) => (
          <div
            key={i}
            className="h-48 bg-card rounded-2xl border border-border"
          />
        ))}
      </div>

      {/* Activity and Suggestions Grid Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Activity Section Skeleton */}
        <div className="lg:col-span-2">
          <div className="h-12 w-48 bg-muted/50 rounded-lg mb-4" />
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-20 bg-card rounded-2xl border border-border" />
            ))}
          </div>
        </div>

        {/* Care Suggestions Skeleton */}
        <div>
          <div className="h-12 w-48 bg-muted/50 rounded-lg mb-4" />
          <div className="space-y-3">
            {[1, 2].map((i) => (
              <div key={i} className="h-32 bg-card rounded-2xl border border-border" />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
