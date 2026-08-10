'use client';

import { useEffect, useMemo, type ReactNode } from 'react';
import { useSuspenseQueries } from '@tanstack/react-query';
import { useFormContext } from 'react-hook-form';

import { gatheringQueries } from '@/api/gatherings/queries';

import { mapGatheringDetailToFormValues } from '../mapGatheringDetailToFormValues';

import type { Category, GatheringForm } from '@/api/gatherings/types';

interface GatheringDetailFormInitializerProps {
  gatheringId: number;
  children: ReactNode;
}

/**
 * initialGatheringId가 있을 때만 렌더되는 래퍼.
 * 이미 생성된 모임의 상세 데이터로 폼을 채운다. reset()은 렌더 중 호출할 수 없으므로
 * useEffect로 데이터 도착 후 1회 반영한다.
 */
export function GatheringDetailFormInitializer({ gatheringId, children }: GatheringDetailFormInitializerProps) {
  const [{ data: detail }, { data: categoriesData }] = useSuspenseQueries({
    queries: [gatheringQueries.detail(gatheringId), gatheringQueries.categories()],
  });
  const { reset } = useFormContext<GatheringForm>();

  const nameToId = useMemo(
    () => Object.fromEntries(categoriesData.categories.map((c: Category) => [c.name, c.id])) as Record<string, number>,
    [categoriesData.categories],
  );

  const initialValues = useMemo(() => mapGatheringDetailToFormValues(detail, nameToId), [detail, nameToId]);

  useEffect(() => {
    reset(initialValues);
  }, [initialValues, reset]);

  return children;
}
