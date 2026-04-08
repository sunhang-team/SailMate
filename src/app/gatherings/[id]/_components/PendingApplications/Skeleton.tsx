const SKELETON_COUNT = 3;

function CardSkeleton() {
  return (
    <div className='border-gray-150 rounded-lg border bg-white'>
      <div className='flex items-center justify-between px-4 py-4 md:px-7'>
        <div className='flex items-center gap-2 md:gap-4'>
          {/* 아바타 */}
          <div className='bg-gray-150 size-8 animate-pulse rounded-lg md:size-12' />
          {/* 닉네임 */}
          <div className='bg-gray-150 h-[22px] w-14 animate-pulse rounded md:h-[26px] md:w-16' />
        </div>
        <div className='flex items-center gap-2 md:gap-4'>
          <div className='flex items-center gap-2 md:gap-4'>
            {/* 메이트 태그 */}
            <div className='bg-gray-150 h-[26px] w-[72px] animate-pulse rounded-lg' />
            {/* 활동 에너지 + 점수 */}
            <div className='flex items-center gap-2'>
              <div className='bg-gray-150 h-[22px] w-[60px] animate-pulse rounded md:h-[26px] md:w-[72px]' />
              <div className='bg-gray-150 h-[22px] w-[32px] animate-pulse rounded md:h-[26px] md:w-[40px]' />
            </div>
          </div>
          {/* 화살표 */}
          <div className='bg-gray-150 size-6 animate-pulse rounded md:size-8' />
        </div>
      </div>
    </div>
  );
}

export function PendingApplicationsSkeleton() {
  return (
    <div className='flex flex-col gap-4'>
      {/* 헤더: "신청 대기자" + 카운트 */}
      <div className='flex items-center justify-between'>
        <div className='flex items-center gap-2'>
          <div className='bg-gray-150 h-[26px] w-[88px] animate-pulse rounded lg:h-[30px] lg:w-[104px]' />
          <div className='bg-gray-150 h-[26px] w-[16px] animate-pulse rounded lg:h-[30px]' />
        </div>
      </div>
      {/* 카드 목록 */}
      <div className='flex flex-col gap-2 md:gap-4'>
        {Array.from({ length: SKELETON_COUNT }, (_, i) => (
          <CardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}
