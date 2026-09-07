import { cn } from '@/lib/cn';
import { Profile } from '@/components/ui/Profile';
import { HandIcon } from '@/components/ui/Icon';
import { Button } from '@/components/ui/Button';
import { Tag } from '@/components/ui/Tag';

import { ReviewButton } from '../ReviewButton';
import { MemberBadge } from '../../MemberBadge';
import { MeBadge } from './Badge';

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
    <article
      className={cn(
        'shadow-02 rounded-2xl bg-white',
        'p-6 md:p-7',
        isMe ? 'border-gradient-primary' : 'border-gray-150',
      )}
    >
      <div className='flex items-start gap-2 md:gap-4'>
        <Profile
          imageUrl={member.profileImage}
          className='h-12 w-12 shrink-0 rounded-lg md:h-[78px] md:w-[78px]'
          hasBorder={false}
        />
        <div className='min-w-0 flex-1'>
          <div className='flex items-center gap-1.5'>
            <span className={cn('text-body-02-sb md:text-h5-sb truncate text-gray-900', isMe ? 'text-blue-300' : '')}>
              {member.nickname}
              {isMe ? <span className='text-blue-300'> (나)</span> : null}
            </span>
            {member.role === 'LEADER' && (
              <Tag variant='coreFeatureSmall' className='text-gray-0 text-small-02-m bg-blue-300 px-3 py-1'>
                모임장
              </Tag>
            )}
            {badgeType && <MemberBadge type={badgeType} label={badgeLabel} />}
          </div>
          <p className='text-small-02-r md:text-body-01-r mt-0.5 text-gray-800'>{goalText}</p>
        </div>

        <div className='shrink-0'>
          {isMe ? (
            ''
          ) : isGatheringEnded ? (
            <ReviewButton hasReviewed={hasReviewed} onClick={onReviewClick} />
          ) : (
            <Button
              variant='icon-hand'
              onClick={onPokeClick}
              aria-label={`${member.nickname}에게 콕 찌르기`}
              className='text-small-02-sb md:text-body-02-sb h-auto w-fit shrink-0 items-center gap-1 bg-blue-100 px-5 py-2.5 text-blue-300'
            >
              콕 찌르기
            </Button>
          )}
        </div>
      </div>

      <div className='border-gray-150 mt-3 flex rounded-lg border bg-gray-100 md:mt-4'>
        <div className='flex flex-1 items-center justify-center gap-7 py-4'>
          <span className='text-small-02-m md:text-body-01-m text-gray-800'>전체 달성률</span>
          <span className='text-small-02-sb md:text-body-01-sb text-blue-300'>{member.overallAchievementRate}%</span>
        </div>
        <div className='bg-gray-150 mt-4 mb-4 w-px' />
        <div className='flex flex-1 items-center justify-center gap-7 py-4'>
          <span className='text-small-02-m md:text-body-01-m text-gray-800'>달성 주차</span>
          <span className='text-small-02-sb md:text-body-01-sb text-blue-300'>
            {achievedWeeks}/{totalWeeks}
          </span>
        </div>
      </div>
    </article>
  );
}
