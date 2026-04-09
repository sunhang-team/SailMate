export function GatheringSectionSkeleton() {
  return (
    <div className='flex flex-col gap-6'>
      <div className='h-8 w-48 animate-pulse rounded-md bg-gray-200' />

      <div className='grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
        {[...Array(4)].map((_, i) => (
          <div key={i} className='border-gray-150 bg-gray-0 shadow-01 flex h-full flex-col rounded-2xl border p-7'>
            <div className='mb-6 flex items-center justify-between'>
              <div className='h-8 w-24 animate-pulse rounded-lg bg-gray-100' />
              <div className='h-5 w-12 animate-pulse rounded bg-gray-100' />
            </div>

            <div className='mb-6 flex flex-1 flex-col gap-3'>
              <div className='flex gap-2'>
                <div className='h-4 w-12 animate-pulse rounded bg-gray-100' />
                <div className='h-4 w-12 animate-pulse rounded bg-gray-100' />
              </div>
              <div className='space-y-2'>
                <div className='h-6 w-3/4 animate-pulse rounded bg-gray-200' />
                <div className='h-4 w-full animate-pulse rounded bg-gray-100' />
              </div>
              <div className='flex gap-2 pt-2'>
                <div className='h-6 w-16 animate-pulse rounded-full bg-gray-100' />
                <div className='h-6 w-20 animate-pulse rounded-full bg-gray-100' />
              </div>
            </div>

            <div className='border-gray-150 mt-auto flex items-center gap-2 border-t pt-4'>
              <div className='h-11 w-11 animate-pulse rounded-full bg-gray-100' />
              <div className='h-11 flex-1 animate-pulse rounded-lg bg-gray-100' />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
