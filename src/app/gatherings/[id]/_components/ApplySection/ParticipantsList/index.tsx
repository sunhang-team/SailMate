'use client';

import { cn } from '@/lib/cn';
import { AvatarGroup } from '@/components/ui/AvatarGroup';
import { Dropdown } from '@/components/ui/Dropdown';
import { ArrowIcon } from '@/components/ui/Icon';
import { useOverlay } from '@/hooks/useOverlay';

import { MemberDetailModal } from '../MemberDetailModal';

import type { MemberInfo } from '@/api/gatherings/types';

interface ParticipantsListProps {
  members: MemberInfo[];
  className?: string;
}

export function ParticipantsList({ members, className }: ParticipantsListProps) {
  const overlay = useOverlay();

  return (
    <div className={cn('flex items-center justify-end gap-2', className)}>
      <Dropdown>
        <Dropdown.Trigger>
          <div className='text-body-02-m relative flex cursor-pointer items-center text-blue-400'>
            참여 멤버 보기
            <ArrowIcon size={24} className='text-body-02-m text-blue-400' />
          </div>
        </Dropdown.Trigger>
        <Dropdown.Menu className='custom-scrollbar shadow-01 absolute -top-2.5 -right-27.5 z-50 mt-2 max-h-84.5 w-55 overflow-y-auto rounded-lg bg-white p-2 md:w-48'>
          {members.map((member) => (
            <Dropdown.Item
              key={member.userId}
              onClick={() => {
                overlay.open(({ isOpen, close }) => (
                  <MemberDetailModal memberId={member.userId} isOpen={isOpen} onClose={() => close(true)} />
                ));
              }}
              className='group flex cursor-pointer items-center justify-between rounded-md p-2 hover:bg-blue-100'
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
              <span className='text-small-02-r invisible text-blue-300 transition-all duration-100 group-hover:visible'>
                상세보기
              </span>
            </Dropdown.Item>
          ))}
        </Dropdown.Menu>
      </Dropdown>
    </div>
  );
}
