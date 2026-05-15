'use client';

import { useMemo } from 'react';
import { useSuspenseQueries } from '@tanstack/react-query';

import { gatheringQueries } from '@/api/gatherings/queries';
import { CreateGatheringForm } from '@/app/gatherings/new/CreateGatheringForm';

import type { Category, GatheringDetail, GatheringForm } from '@/api/gatherings/types';

export const toFormValues = (detail: GatheringDetail, nameToId: Record<string, number>): Partial<GatheringForm> => ({
  type: detail.type,
  categoryIds: detail.categories.map((name) => nameToId[name]).filter((id): id is number => typeof id === 'number'),
  title: detail.title,
  shortDescription: detail.shortDescription,
  description: detail.description,
  tags: detail.tags,
  goal: detail.goal,
  maxMembers: detail.maxMembers,
  recruitDeadline: detail.recruitDeadline,
  startDate: detail.startDate,
  endDate: detail.endDate,
  weeklyGuides: detail.weeklyPlans.map((plan) => ({
    week: plan.week,
    title: plan.title,
    details: plan.details ?? [],
  })),
});

interface EditGatheringContentProps {
  gatheringId: number;
}

export function EditGatheringContent({ gatheringId }: EditGatheringContentProps) {
  const [{ data: detail }, { data: categoriesData }] = useSuspenseQueries({
    queries: [gatheringQueries.detail(gatheringId), gatheringQueries.categories()],
  });

  const nameToId = useMemo(
    () => Object.fromEntries(categoriesData.categories.map((c: Category) => [c.name, c.id])) as Record<string, number>,
    [categoriesData.categories],
  );

  const initialValues = useMemo(() => toFormValues(detail, nameToId), [detail, nameToId]);

  return <CreateGatheringForm mode='edit' gatheringId={gatheringId} initialValues={initialValues} />;
}
