'use client';

import { useSuspenseQuery } from '@tanstack/react-query';

import { Tag } from '@/components/ui/Tag';
import { gatheringQueries } from '@/api/gatherings/queries';
import { getInitialDraftStep } from '@/app/gatherings/new/CreateGatheringFunnel/getInitialDraftStep';

interface GatheringDraftStepTagProps {
  draftId: number;
}

export function GatheringDraftStepTag({ draftId }: GatheringDraftStepTagProps) {
  const { data } = useSuspenseQuery(gatheringQueries.draft(draftId));
  const isScheduleStep = getInitialDraftStep(data) === 'SCHEDULE';

  return <Tag variant='step'>{isScheduleStep ? '2단계 작성 중' : '1단계 작성 중'}</Tag>;
}
