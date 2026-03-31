const SKELETON_COUNT = 12;

export function GatheringListSkeleton() {
  return (
    <>
      <div className='flex flex-col gap-4'>
        <div className='h-7 w-32 animate-pulse rounded bg-gray-200' />
        <div className='h-5 w-48 animate-pulse rounded bg-gray-200' />
      </div>
      <div className='grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
        {Array.from({ length: SKELETON_COUNT }).map((_, i) => (
          <div key={i} className='h-72 animate-pulse rounded-xl bg-gray-200' />
        ))}
      </div>
    </>
  );
}
