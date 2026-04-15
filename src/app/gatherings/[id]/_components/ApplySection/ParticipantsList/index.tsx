'use client';

import { cn } from '@/lib/cn';
import { AvatarGroup } from '@/components/ui/AvatarGroup';
import { Dropdown } from '@/components/ui/Dropdown';
import { useOverlay } from '@/hooks/useOverlay';

import { MemberDetailModal } from '../MemberDetailModal';

import type { MemberInfo } from '@/api/gatherings/types';

interface ParticipantsListProps {
  members: MemberInfo[];
  maxMembers: number;
  className?: string;
}

export function ParticipantsList({ members, maxMembers, className }: ParticipantsListProps) {
  const overlay = useOverlay();
  const remainingCount = maxMembers - members.length;

  return (
    <div className={cn('flex items-center justify-end gap-2', className)}>
      <Dropdown>
        <Dropdown.Trigger>
          <div className='relative flex cursor-pointer items-center'>
            <AvatarGroup
              avatars={members.map((member) => ({ id: member.userId, imageUrl: member.profileImage }))}
              max={maxMembers}
              size='md'
              shape='full'
            />
          </div>
        </Dropdown.Trigger>
        <Dropdown.Menu className='scrollbar-hide custom-scrollbar absolute top-[-20px] right-[-110px] z-50 mt-2 max-h-60 w-42 overflow-y-auto rounded-xl bg-white p-2 shadow-lg md:right-[-130px] md:w-48'>
          {members.map((member) => (
            <Dropdown.Item
              key={member.userId}
              onClick={() => {
                overlay.open(({ isOpen, close }) => (
                  <MemberDetailModal memberId={member.userId} isOpen={isOpen} onClose={() => close(true)} />
                ));
              }}
              className='flex cursor-pointer items-center justify-between rounded-md p-2 hover:bg-blue-100'
            >
              <div className='flex items-center gap-2'>
                <AvatarGroup
                  avatars={[{ id: member.userId, imageUrl: member.profileImage }]}
                  size='md'
                  shape='lg'
                  hasBorder={false}
                />
                <span className='text-sm font-medium'>{member.nickname}</span>
              </div>
              <span className='text-small-02-r text-blue-300'>상세보기</span>
            </Dropdown.Item>
          ))}
        </Dropdown.Menu>
      </Dropdown>

      {remainingCount > 0 && (
        <span className='text-small-01-sb text-blue-300'>
          <span className='mr-2'>·</span> {remainingCount}명 남음
        </span>
      )}
    </div>
  );
}
