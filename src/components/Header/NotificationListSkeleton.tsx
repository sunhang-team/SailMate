const NOTIFICATIONS_LIMIT = 5;

export const NotificationListSkeleton = () => {
  return (
    <div className='flex max-h-[80vh] w-[320px] flex-col bg-white text-left'>
      <div className='border-gray-150 flex items-center justify-between border-b p-4'>
        <h3 className='text-body-01-b text-gray-800'>알림</h3>
        <div className='h-4 w-12 animate-pulse rounded bg-gray-200' />
      </div>
      <div className='flex flex-col overflow-hidden'>
        {Array.from({ length: NOTIFICATIONS_LIMIT }).map((_, i) => (
          <div key={i} className='flex items-start gap-4 p-4'>
            <div className='mt-1 h-6 w-6 shrink-0 animate-pulse rounded-full bg-gray-200' />
            <div className='min-w-0 flex-1 space-y-2'>
              <div className='h-4 w-full animate-pulse rounded bg-gray-200' />
              <div className='h-4 w-2/3 animate-pulse rounded bg-gray-200' />
              <div className='mt-2 h-3 w-1/4 animate-pulse rounded bg-gray-200' />
            </div>
          </div>
        ))}
      </div>
      <div className='border-gray-150 flex items-center justify-between border-t p-3'>
        <div className='h-8 w-8 animate-pulse rounded-md bg-gray-200' />
        <div className='h-4 w-4 animate-pulse rounded bg-gray-200' />
        <div className='h-8 w-8 animate-pulse rounded-md bg-gray-200' />
      </div>
    </div>
  );
};
