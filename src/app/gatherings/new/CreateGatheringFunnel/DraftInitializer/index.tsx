'use client';

import { useEffect, type ReactNode } from 'react';
import { useSuspenseQuery } from '@tanstack/react-query';
import { useFormContext } from 'react-hook-form';

import { gatheringQueries } from '@/api/gatherings/queries';

import { getInitialDraftStep } from '../getInitialDraftStep';
import { mapGatheringDraftToFormValues } from '../mapGatheringDraftToFormValues';

import type { FunnelStep } from '../getInitialDraftStep';
import type { GatheringForm } from '@/api/gatherings/types';

interface DraftInitializerProps {
  draftId: number;
  children: (initialStep: FunnelStep) => ReactNode;
}

/**
 * initialDraftId가 있을 때만 렌더되는 래퍼.
 * SuspenseBoundary 안쪽에서 draft를 조회해 폼을 채우고, SCHEDULE 단계 필드 존재 여부로
 * 계산한 초기 퍼널 스텝을 children(render-prop)에 전달한다.
 * reset()은 렌더 중 호출할 수 없으므로 useEffect로 데이터 도착 후 1회 반영한다.
 */
export function DraftInitializer({ draftId, children }: DraftInitializerProps) {
  const { data } = useSuspenseQuery(gatheringQueries.draft(draftId));
  const { reset } = useFormContext<GatheringForm>();

  useEffect(() => {
    reset(mapGatheringDraftToFormValues(data));
  }, [data, reset]);

  return children(getInitialDraftStep(data));
}
