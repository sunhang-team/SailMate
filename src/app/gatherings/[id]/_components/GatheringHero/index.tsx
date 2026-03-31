'use client';

import { useQuery } from '@tanstack/react-query';

import { StudyIcon, ProjectIcon, ArrowIcon } from '@/components/ui/Icon';
import { gatheringQueries } from '@/api/gatherings/queries';

import type { GatheringType } from '@/api/gatherings/types';

const TYPE_ICON: Record<GatheringType, typeof StudyIcon> = {
  스터디: StudyIcon,
  프로젝트: ProjectIcon,
};

interface GatheringHeroProps {
  gatheringId: number;
}

export function GatheringHero({ gatheringId }: GatheringHeroProps) {
  const { data } = useQuery(gatheringQueries.detail(gatheringId));

  if (!data) return null;

  const TypeIcon = TYPE_ICON[data.type];

  return (
    <section className='bg-gradient-sub-200 px-4 pt-20 pb-6 md:px-7 xl:px-30'>
      <div className=''>
        <div className='flex flex-col gap-1'>
          <p className='flex items-center gap-0.5 text-blue-500'>
            <TypeIcon size={14} className='text-blue-500' />
            <span className='text-small-01-sb'>{data.type}</span>
            <ArrowIcon size={14} />
            <span className='text-small-01-r'>{data.category}</span>
          </p>
          <h1 className='text-h5-b md:text-h3-b xl:text-h2-b text-blue-500'>{data.title}</h1>
        </div>
      </div>
    </section>
  );
}
