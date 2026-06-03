export function DiscoverySkeleton() {
  return (
    <div className="grid gap-3">
      {[0, 1, 2].map((item) => (
        <div
          className="animate-pulse rounded-lg border border-stone-200 bg-white p-4"
          key={item}
        >
          <div className="flex gap-2">
            <div className="h-7 w-20 rounded-full bg-stone-200" />
            <div className="h-7 w-24 rounded-full bg-stone-200" />
          </div>
          <div className="mt-4 h-5 w-3/4 rounded bg-stone-200" />
          <div className="mt-3 h-4 w-full rounded bg-stone-100" />
          <div className="mt-2 h-4 w-2/3 rounded bg-stone-100" />
        </div>
      ))}
    </div>
  )
}
