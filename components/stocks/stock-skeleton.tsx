export const StockSkeleton = () => {
  return (
    <div className="rounded-xl border bg-white dark:bg-zinc-950 p-4 dark:text-yellow-400 text-yellow-600">
      <div className="float-right inline-block w-fit rounded-full bg-zinc-300 dark:bg-zinc-700 px-2 py-1 text-xs text-transparent">
        xxxxxxx
      </div>
      <div className="mb-1 w-fit rounded-md bg-zinc-300 dark:bg-zinc-700 text-lg text-transparent">
        xxxx
      </div>
      <div className="w-fit rounded-md bg-zinc-300 dark:bg-zinc-700 text-3xl font-bold text-transparent">
        xxxx
      </div>
      <div className="text mt-1 w-fit rounded-md bg-zinc-300 dark:bg-zinc-700 text-xs text-transparent">
        xxxxxx xxx xx xxxx xx xxx
      </div>

      <div className="relative -mx-4 cursor-col-resize">
        <div style={{ height: 146 }}></div>
      </div>
    </div>
  )
}
