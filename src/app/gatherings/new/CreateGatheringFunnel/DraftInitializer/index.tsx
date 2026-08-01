'use client';

import { useEffect, type ReactNode } from 'react';
import { useSuspenseQuery } from '@tanstack/react-query';
import { useFormContext } from 'react-hook-form';

import { gatheringQueries } from '@/api/gatherings/queries';

import { mapGatheringDraftToFormValues } from '../mapGatheringDraftToFormValues';

import type { GatheringForm } from '@/api/gatherings/types';

interface DraftInitializerProps {
  draftId: number;
  children: ReactNode;
}

/**
 * initialDraftId가 있을 때만 렌더되는 래퍼.
 * SuspenseBoundary 안쪽에서 draft를 조회해 폼을 채운 뒤 children(퍼널 UI)을 그대로 렌더한다.
 * reset()은 렌더 중 호출할 수 없으므로 useEffect로 데이터 도착 후 1회 반영한다.
 */
export function DraftInitializer({ draftId, children }: DraftInitializerProps) {
  const { data } = useSuspenseQuery(gatheringQueries.draft(draftId));
  const { reset } = useFormContext<GatheringForm>();

  useEffect(() => {
    reset(mapGatheringDraftToFormValues(data));
  }, [data, reset]);

  return children;
}
