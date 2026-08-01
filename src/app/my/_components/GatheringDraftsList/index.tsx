'use client';

import { useSuspenseQuery } from '@tanstack/react-query';

import { gatheringQueries } from '@/api/gatherings/queries';

import { GatheringDraftCard } from '../GatheringDraftCard';

export function GatheringDraftsList() {
  const { data } = useSuspenseQuery(gatheringQueries.drafts());

  if (data.drafts.length === 0) {
    return (
      <div className='flex h-40 items-center justify-center'>
        <p className='text-body-02-r text-gray-400'>임시저장한 모임이 없습니다.</p>
      </div>
    );
  }

  return (
    <div className='mt-8 grid grid-cols-1 gap-4 md:mt-10 xl:grid-cols-2'>
      {data.drafts.map((draft) => (
        <GatheringDraftCard key={draft.draftId} draft={draft} />
      ))}
    </div>
  );
}
