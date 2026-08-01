import { GATHERING_TYPE_TO_PARAM } from '@/api/gatherings/types';

import type { GatheringForm, GatheringType, GetGatheringDraftDetailResponse } from '@/api/gatherings/types';

// draft 상세 조회 응답의 type이 영문(STUDY/PROJECT)으로 올 가능성에 대비한 역변환.
// 응답이 이미 한글로 온다면 GATHERING_TYPES에 포함된 값을 그대로 통과시킨다.
const PARAM_TO_GATHERING_TYPE: Record<string, GatheringType> = Object.fromEntries(
  Object.entries(GATHERING_TYPE_TO_PARAM).map(([ko, en]) => [en, ko as GatheringType]),
);

const resolveGatheringType = (type: GetGatheringDraftDetailResponse['type']): GatheringType | undefined => {
  if (!type) return undefined;
  return PARAM_TO_GATHERING_TYPE[type] ?? (type as GatheringType);
};

/**
 * draft 상세 조회 응답을 useForm의 reset()에 넘길 폼 값으로 변환.
 * 서버가 아직 입력 안 된 필드를 null로 내려주는데, RHF에 null을 그대로 넘기면
 * controlled input 경고가 발생하고 재저장 시 그 null이 그대로 다시 나가버리므로
 * 폼 기본값(문자열 필드는 '', 배열 필드는 [])으로 정규화한다.
 */
export const mapGatheringDraftToFormValues = (draft: GetGatheringDraftDetailResponse): Partial<GatheringForm> => ({
  type: resolveGatheringType(draft.type),
  categoryIds: draft.categoryIds ?? [],
  title: draft.title ?? '',
  shortDescription: draft.shortDescription ?? '',
  description: draft.description ?? '',
  tags: draft.tags ?? [],
  goal: draft.goal ?? '',
  maxMembers: draft.maxMembers ?? undefined,
  recruitDeadline: draft.recruitDeadline ?? '',
  startDate: draft.startDate ?? '',
  endDate: draft.endDate ?? '',
  weeklyGuides: draft.weeklyGuides ?? [],
});
