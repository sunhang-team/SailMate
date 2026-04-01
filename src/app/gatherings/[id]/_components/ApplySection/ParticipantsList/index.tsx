'use client';

import { cn } from '@/lib/cn';

import type { MemberInfo } from '@/api/gatherings/types';
import { AvatarGroup } from '@/components/ui/AvatarGroup';

interface ParticipantsListProps {
  members: MemberInfo[];
  maxMembers: number;
  className?: string;
}

export function ParticipantsList({ members, maxMembers, className }: ParticipantsListProps) {
  return (
    <div className={cn('flex items-center justify-end gap-2', className)}>
      <AvatarGroup
        avatars={members.map((member) => ({ id: member.userId, imageUrl: member.profileImage }))}
        max={maxMembers}
        size='md'
      />

      {maxMembers - members.length > 0 && (
        <span className='text-small-01-sb text-blue-300'>
          <span className='mr-2'>·</span> {maxMembers - members.length}명 남음
        </span>
      )}
    </div>
  );
}
