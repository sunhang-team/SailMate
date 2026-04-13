import { cn } from '@/lib/cn';
import { Profile } from '@/components/ui/Profile';
import { HandIcon } from '@/components/ui/Icon';
import { Button } from '@/components/ui/Button';

import { ReviewButton } from '../ReviewButton';
import { MemberBadge, MeBadge } from './Badge';

import type { Member } from '@/api/memberships/types';

type BadgeType = 'streak' | 'warning' | null;

interface MemberCardProps {
  member: Member;
  isMe: boolean;
  badgeType: BadgeType;
  badgeLabel: string;
  achievedWeeks: number;
  totalWeeks: number;
  /**현재 개인의 goalText가 없어서 모임의 goalText로 임시 연결 */
  goalText: string;
  isGatheringEnded: boolean;
  onReviewClick: () => void;
  onPokeClick: () => void;
  /** 임시: 리뷰 작성 완료 여부 */
  hasReviewed: boolean;
}

export function MemberCard({
  member,
  isMe,
  badgeType,
  badgeLabel,
  achievedWeeks,
  totalWeeks,
  goalText,
  isGatheringEnded,
  onReviewClick,
  onPokeClick,
  hasReviewed,
}: MemberCardProps) {
  return (
    <article className={cn('rounded-2xl border bg-white', 'p-6 md:p-7', isMe ? 'border-focus-100' : 'border-gray-150')}>
      <div className='flex items-start gap-2 md:gap-4'>
        <Profile
          imageUrl={member.profileImage}
          className='h-12 w-12 shrink-0 rounded-lg md:h-[78px] md:w-[78px]'
          hasBorder={false}
        />
        <div className='min-w-0 flex-1'>
          <div className='flex items-center gap-1.5'>
            <span className='text-body-02-sb md:text-h5-sb truncate text-gray-900'>{member.nickname}</span>
            {badgeType && <MemberBadge type={badgeType} label={badgeLabel} />}
          </div>
          <p className='text-small-02-r md:text-body-01-r mt-0.5 text-gray-500'>{goalText}</p>
        </div>

        <div className='shrink-0'>
          {isMe ? (
            <MeBadge />
          ) : isGatheringEnded ? (
            <ReviewButton hasReviewed={hasReviewed} onClick={onReviewClick} />
          ) : (
            <Button
              variant='icon-hand'
              size='icon-hand'
              onClick={onPokeClick}
              aria-label={`${member.nickname}에게 콕 찌르기`}
            >
              <HandIcon />
            </Button>
          )}
        </div>
      </div>

      <div className='border-gray-150 mt-3 flex rounded-lg border md:mt-4'>
        <div className='flex flex-1 items-center justify-center gap-2 py-2.5'>
          <span className='text-small-02-m md:text-body-01-m text-gray-500'>전체 달성률</span>
          <span className='text-small-02-sb md:text-body-01-sb text-blue-300'>{member.overallAchievementRate}%</span>
        </div>
        <div className='bg-gray-150 w-px' />
        <div className='flex flex-1 items-center justify-center gap-2 py-2.5'>
          <span className='text-small-02-m md:text-body-01-m text-gray-500'>달성 주차</span>
          <span className='text-small-02-sb md:text-body-01-sb text-blue-300'>
            {achievedWeeks}/{totalWeeks}
          </span>
        </div>
      </div>
    </article>
  );
}
