'use client';

import { useQuery } from '@tanstack/react-query';

import { StudyIcon, ProjectIcon, ArrowIcon } from '@/components/ui/Icon';
import { gatheringQueries } from '@/api/gatherings/queries';
import { useAuth } from '@/hooks/useAuth';

import { LeaderActionDropdown } from '../LeaderActionDropdown';

import type { GatheringType } from '@/api/gatherings/types';

const TYPE_ICON: Record<GatheringType, typeof StudyIcon> = {
  스터디: StudyIcon,
  프로젝트: ProjectIcon,
};

interface GatheringHeroProps {
  gatheringId: number;
}

export function GatheringHero({ gatheringId }: GatheringHeroProps) {
  const { user } = useAuth();
  const { data } = useQuery(gatheringQueries.detail(gatheringId));

  // 프로덕션: prefetch로 data 항상 존재. 개발(MSW): 서버 prefetch 실패 시 클라이언트 fetch 완료 전까지 undefined
  if (!data) return null;

  const TypeIcon = TYPE_ICON[data.type] || StudyIcon;
  const isLeader = data.members.some((m) => m.userId === user?.id && m.role === 'LEADER');

  return (
    <section className='bg-gradient-sub-200 px-4 pt-20 pb-6 md:px-7 xl:px-30'>
      <div className='flex items-start justify-between'>
        <div className='flex flex-col gap-1'>
          <p className='flex items-center gap-0.5 text-blue-500'>
            <TypeIcon size={14} className='text-blue-500' />
            <span className='text-small-01-sb'>{data.type}</span>
            <ArrowIcon size={14} />
            <span className='text-small-01-r'>{data.categories.join(', ')}</span>
          </p>
          <h1 className='text-h5-b md:text-h3-b xl:text-h2-b text-blue-500'>{data.title}</h1>
        </div>
        {isLeader && <LeaderActionDropdown gatheringId={gatheringId} />}
      </div>
    </section>
  );
}
