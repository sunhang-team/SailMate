'use client';

import { useSuspenseQuery } from '@tanstack/react-query';

import { gatheringQueries } from '@/api/gatherings/queries';
import { DEFAULT_CATEGORIES } from '@/constants/gathering';
import { CreateGatheringForm } from '@/app/gatherings/new/CreateGatheringForm';

import type { GatheringDetail, GatheringForm } from '@/api/gatherings/types';

const CATEGORY_NAME_TO_ID = Object.fromEntries(DEFAULT_CATEGORIES.map((c) => [c.name, c.id])) as Record<string, number>;

const toFormValues = (detail: GatheringDetail): Partial<GatheringForm> => ({
  type: detail.type,
  categoryIds: detail.categories.map((name) => CATEGORY_NAME_TO_ID[name]).filter(Boolean),
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
  const { data } = useSuspenseQuery(gatheringQueries.detail(gatheringId));

  return <CreateGatheringForm mode='edit' gatheringId={gatheringId} initialValues={toFormValues(data)} />;
}
