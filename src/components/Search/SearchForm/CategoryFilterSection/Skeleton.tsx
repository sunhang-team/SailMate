export function CategoryDropdownSkeleton() {
  return (
    <div className='flex flex-1 items-center justify-between px-5 py-4 md:px-7 md:py-5'>
      <div className='h-5 w-32 animate-pulse rounded bg-gray-200 md:h-6 md:w-40' />
      <div className='h-4 w-4 animate-pulse rounded bg-gray-200 md:h-6 md:w-6' />
    </div>
  );
}
