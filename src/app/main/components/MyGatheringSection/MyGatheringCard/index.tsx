import { differenceInDays, startOfDay } from 'date-fns';

import { cn } from '@/lib/cn';
import { AvatarGroup } from '@/components/ui/AvatarGroup';
import { GatheringCard } from '@/components/ui/GatheringCard';
import { ProjectIcon, StudyIcon } from '@/components/ui/Icon';
import { ProgressBar } from '@/components/ui/Progress';
import { Tag } from '@/components/ui/Tag';

import type { Member, MembershipGathering } from '@/api/memberships/types';
import { GATHERING_CATEGORY_LABEL, GATHERING_TYPE_LABEL } from '@/constants/gathering';

interface MyGatheringCardProps {
  gathering: MembershipGathering;
  members?: Member[];
  onClick?: () => void;
  className?: string;
}

const TYPE_ICON = {
  STUDY: ProjectIcon,
  PROJECT: StudyIcon,
} as const;

export function MyGatheringCard({ gathering, members = [], onClick, className }: MyGatheringCardProps) {
  const now = startOfDay(new Date());
  const startDate = new Date(gathering.startDate);
  const endDate = new Date(gathering.endDate);

  const dDay = differenceInDays(endDate, now);
  const totalDays = differenceInDays(endDate, startDate);
  const totalWeeks = Math.max(1, Math.ceil((totalDays + 1) / 7));
  const passedDays = differenceInDays(now, startDate);
  const progressRate = totalDays > 0 ? Math.min(100, Math.max(0, Math.floor((passedDays / totalDays) * 100))) : 0;

  const dDayText = dDay > 0 ? `D-${dDay}` : dDay === 0 ? 'D-Day' : `D+${Math.abs(dDay)}`;

  return (
    <GatheringCard onClick={onClick} className={cn('w-full cursor-pointer', className)}>
      <GatheringCard.Header className='items-center'>
        <Tag
          variant='category'
          icon={(() => {
            const Icon = TYPE_ICON[gathering.type as keyof typeof TYPE_ICON] || StudyIcon;
            return <Icon size={14} className='text-blue-200' />;
          })()}
          label={GATHERING_TYPE_LABEL[gathering.type as keyof typeof GATHERING_TYPE_LABEL] || gathering.type}
          sublabel={
            GATHERING_CATEGORY_LABEL[gathering.category as keyof typeof GATHERING_CATEGORY_LABEL] || gathering.category
          }
        />
        <AvatarGroup max={4} avatars={members.map((m) => ({ id: m.userId, imageUrl: m.profileImage }))} size='sm' />
      </GatheringCard.Header>
      <GatheringCard.Body>
        <div className='flex flex-col gap-0.5'>
          <div>
            <div className='flex gap-1'>
              {gathering.tags.slice(0, 2).map((tag) => (
                <div key={tag} className='text-small-01-r text-gray-500'>
                  #{tag}
                </div>
              ))}
            </div>
            <div className='text-body-01-b text-gray-900'>{gathering.title}</div>
          </div>
        </div>
        <div className='mb-1.5 flex gap-1'>
          <Tag variant='duration'>총 {totalWeeks}주</Tag>
          <Tag variant='deadline' state='goal'>
            목표 {dDayText}
          </Tag>
        </div>
        <div className='border-gray-150 mb-4.5 border'></div>
      </GatheringCard.Body>
      <GatheringCard.Footer className='flex-col gap-1'>
        <ProgressBar value={progressRate} label='달성률' />
      </GatheringCard.Footer>
    </GatheringCard>
  );
}
