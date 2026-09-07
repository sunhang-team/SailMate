import type { GatheringDetail, GatheringForm } from '@/api/gatherings/types';

export const mapGatheringDetailToFormValues = (
  detail: GatheringDetail,
  nameToId: Record<string, number>,
): Partial<GatheringForm> => ({
  type: detail.type,
  categoryIds: detail.categories.map((name) => nameToId[name]).filter((id): id is number => typeof id === 'number'),
  title: detail.title,
  shortDescription: detail.shortDescription,
  description: detail.description ?? '',
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
