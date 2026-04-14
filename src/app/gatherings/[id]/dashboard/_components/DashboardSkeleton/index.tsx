function StatCardSkeleton() {
  return (
    <div className='border-focus-100 bg-gray-0 shadow-01 flex items-end justify-between rounded-2xl border p-6'>
      <div className='flex flex-col gap-4'>
        <span className='text-small-02-m lg:text-body-02-m w-14 rounded bg-gray-200 text-transparent select-none'>
          &nbsp;
        </span>
        <div className='flex flex-col gap-1'>
          <span className='text-h5-b md:text-h4-b lg:text-h3-b w-16 rounded bg-gray-200 text-transparent select-none'>
            &nbsp;
          </span>
          <div className='text-small-02-r lg:text-small-01-r w-28 rounded bg-gray-200 text-transparent select-none'>
            &nbsp;
          </div>
        </div>
      </div>
      <div className='h-18 w-18 shrink-0 rounded-full bg-blue-50' />
    </div>
  );
}

export function DashboardSkeleton() {
  return (
    <section className='bg-gradient-sub-200 px-4 pt-20 md:px-7 lg:pb-8 xl:px-30'>
      <div className='mx-auto max-w-[1680px] animate-pulse'>
        {/* 타이틀 영역 */}
        <div className='flex flex-col gap-1'>
          <div className='text-small-01-sb w-28 rounded bg-blue-100 text-transparent select-none'>&nbsp;</div>
          <div className='text-h5-b md:text-h3-b xl:text-h2-b w-48 rounded bg-blue-100 text-transparent select-none'>
            &nbsp;
          </div>
          <div className='text-small-02-r md:text-body-02-r w-64 rounded bg-blue-100 text-transparent select-none'>
            &nbsp;
          </div>
        </div>

        {/* 통계 카드 — PC: 4열 그리드 */}
        <div className='mt-10 hidden lg:grid lg:grid-cols-4 lg:gap-4'>
          {Array.from({ length: 4 }).map((_, i) => (
            <StatCardSkeleton key={i} />
          ))}
        </div>

        {/* 통계 카드 — 모바일(1개) / 태블릿(2개) */}
        <div className='mt-6 lg:hidden'>
          <div className='flex gap-4 overflow-hidden'>
            <div className='min-w-[calc(100%-16px)] md:min-w-[calc(50%-8px)]'>
              <StatCardSkeleton />
            </div>
            <div className='hidden min-w-[calc(50%-8px)] md:block'>
              <StatCardSkeleton />
            </div>
          </div>

          {/* Dot Indicator */}
          <div className='flex justify-center gap-1.5 py-4'>
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className='h-2 w-2 rounded-full bg-gray-200 first:bg-blue-300 md:nth-[n+3]:hidden' />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
