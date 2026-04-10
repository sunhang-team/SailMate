export function GatheringDetailSkeleton() {
  return (
    <div className='flex flex-col'>
      <section className='bg-gradient-sub-200 px-4 pt-20 pb-6 md:px-7 xl:px-30'>
        <div className='flex flex-col gap-1'>
          <div className='h-[168.8px] md:h-[181.6px] xl:h-[194.4px]'>
            <div className='mb-2 h-4 w-24 animate-pulse rounded bg-blue-100 opacity-50' />
            <div className='h-10 w-2/3 animate-pulse rounded bg-blue-100 opacity-50 md:h-12 xl:h-14' />
          </div>
        </div>
      </section>

      <div className='px-4 pt-6 md:px-8 xl:hidden'>
        <div className='mb-4 h-12 w-full animate-pulse rounded-[8px] bg-gray-100' />
        <div className='mb-4 h-[268px] w-full animate-pulse rounded-2xl bg-gray-50' />
        <div className='mb-8 h-20 w-full animate-pulse rounded-2xl bg-gray-50' />
      </div>

      <nav className='border-gray-150 bg-gray-0 sticky top-0 z-20 border-b px-4 md:px-7 xl:px-30'>
        <div className='mx-auto flex h-[39px] max-w-[1680px] items-center gap-6 md:h-12'>
          {[...Array(5)].map((_, i) => (
            <div key={i} className='h-4 w-16 animate-pulse rounded bg-gray-100' />
          ))}
        </div>
      </nav>

      <div className='px-4 pt-10 md:px-7 xl:flex xl:gap-20 xl:px-30'>
        <section className='min-w-0 flex-1 space-y-15'>
          <div className='space-y-4'>
            <div className='h-8 w-48 animate-pulse rounded-md bg-gray-200 lg:h-10' />
            <div className='space-y-2'>
              <div className='h-5 w-full animate-pulse rounded-md bg-gray-100' />
              <div className='h-5 w-full animate-pulse rounded-md bg-gray-100' />
              <div className='h-5 w-3/4 animate-pulse rounded-md bg-gray-100' />
            </div>
          </div>
          <div className='aspect-video w-full animate-pulse rounded-2xl bg-gray-50' />
          {[...Array(3)].map((_, i) => (
            <div key={i} className='border-gray-150 rounded-2xl border p-6 xl:p-8'>
              <div className='mb-4 h-6 w-32 animate-pulse rounded bg-gray-200' />
              <div className='h-6 w-1/2 animate-pulse rounded bg-gray-100' />
            </div>
          ))}
        </section>

        <aside className='hidden xl:block xl:w-[560px] xl:shrink-0'>
          <div className='sticky top-24 space-y-4'>
            <div className='h-12 w-full animate-pulse rounded-[8px] bg-gray-100' />
            <div className='border-gray-150 rounded-2xl border bg-white p-8 shadow-sm'>
              <div className='mb-8 h-8 w-3/4 animate-pulse rounded bg-gray-200' />
              <div className='mb-10 space-y-3'>
                <div className='h-5 w-full animate-pulse rounded bg-gray-100' />
                <div className='h-5 w-2/3 animate-pulse rounded bg-gray-100' />
              </div>
              <div className='border-gray-150 space-y-7 border-t pt-6'>
                <div className='h-[268px] w-full animate-pulse rounded bg-gray-50' />
                <div className='h-20 w-full animate-pulse rounded bg-gray-50' />
              </div>
              <div className='mt-8 h-18 w-full animate-pulse rounded-xl bg-gray-100' />
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
