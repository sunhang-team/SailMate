import type { GatheringForm } from '@/api/gatherings/types';

/** 저장할 값이 하나도 입력되지 않은 폼인지 판단 (type 포함 전체 필드 대상) */
export const isGatheringDraftEmpty = (values: GatheringForm): boolean => {
  const {
    type,
    categoryIds,
    title,
    shortDescription,
    description,
    tags,
    goal,
    maxMembers,
    recruitDeadline,
    startDate,
    endDate,
    weeklyGuides,
  } = values;

  const hasText = !title && !shortDescription && !description && !goal && !recruitDeadline && !startDate && !endDate;
  const hasArray = !categoryIds?.length && !tags?.length && !weeklyGuides?.length;
  const hasType = !type;
  const hasMaxMembers = !maxMembers || Number.isNaN(maxMembers);

  return hasText && hasArray && hasType && hasMaxMembers;
};
