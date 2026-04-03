'use client';

import { Pagination } from '@/components/ui/Pagination';

import { useOverlay } from '@/hooks/useOverlay';

import { MemberCard } from './MemberCard';
import { useMemberList } from './useMemberList';
import { ReviewModal } from '../ReviewModal';

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

  const { open } = useOverlay();
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
                open(({ isOpen, close }) => (
                  <ReviewModal
                    isOpen={isOpen}
                    onClose={() => close(false)}
                    member={member}
                    achievedWeeks={achievedWeeks}
                    totalWeeks={totalWeeks}
                    gatheringId={gatheringId}
                  />
                ));
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
