export function MyTodoSectionSkeleton() {
  return (
    <div className='bg-gray-0 shadow-01 border-gray-150 w-full animate-pulse rounded-2xl border'>
      <div className='border-gray-150 flex flex-wrap items-center justify-between gap-3 border-b px-7 py-6'>
        <div className='h-7 w-40 rounded-lg bg-gray-200' />
        <div className='flex items-center gap-4'>
          <div className='h-5 w-24 rounded bg-gray-200' />
          <div className='bg-gray-150 h-4 w-[120px] rounded-full md:w-[160px]' />
          <div className='h-10 w-[88px] rounded-lg bg-blue-50' />
        </div>
      </div>
      <div className='flex flex-col gap-3 px-7 py-6'>
        <div className='h-[72px] rounded-lg bg-gray-100' />
        <div className='h-[72px] rounded-lg bg-gray-100' />
        <div className='h-[72px] rounded-lg bg-gray-100' />
      </div>
      <div className='border-gray-150 border-t px-7 pb-7'>
        <div className='h-13 w-full rounded-lg bg-blue-50 md:h-18' />
      </div>
    </div>
  );
}
