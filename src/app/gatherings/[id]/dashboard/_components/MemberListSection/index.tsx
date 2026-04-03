'use client';

import { Pagination } from '@/components/ui/Pagination';

import { MemberCard } from './MemberCard';
import { useMemberList } from './useMemberList';

interface MemberListSectionProps {
  gatheringId: number;
}

export function MemberListSection({ gatheringId }: MemberListSectionProps) {
  const {
    user,
    pagedMembers,
    totalPages,
    currentPage,
    totalWeeks,
    goalText,
    isGatheringEnded,
    getBadgeInfo,
    getAchievedWeeks,
    getHasReviewed,
    handlePageChange,
  } = useMemberList(gatheringId);

  const handlePokeClick = (_memberId: number) => {
    alert('콕 찌르기 API 추가 전입니다.');
  };

  return (
    <section className='flex flex-col gap-6'>
      <div className='grid grid-cols-1 gap-4 lg:grid-cols-2'>
        {pagedMembers.map((member, index) => {
          const isMe = user?.id === member.userId;
          const badgeInfo = getBadgeInfo(member);
          const achievedWeeks = getAchievedWeeks(member.userId);

          return (
            <MemberCard
              key={member.userId}
              member={member}
              isMe={isMe}
              badgeType={badgeInfo.type}
              badgeLabel={badgeInfo.label}
              achievedWeeks={achievedWeeks}
              totalWeeks={totalWeeks}
              goalText={goalText}
              isGatheringEnded={isGatheringEnded}
              onReviewClick={() => {
                // TODO: 리뷰 모달 열기 (useOverlay 등 사용)
              }}
              onPokeClick={() => handlePokeClick(member.userId)}
              hasReviewed={getHasReviewed(index)}
            />
          );
        })}
      </div>

      {totalPages > 1 && (
        <Pagination
          variant='numbered'
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      )}
    </section>
  );
}
