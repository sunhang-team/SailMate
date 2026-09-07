import type { GatheringForm, SaveGatheringDraftRequest } from '@/api/gatherings/types';

/**
 * 폼 전체 값을 draft 저장 요청 바디로 변환.
 * images는 draft API가 지원하지 않으므로 제외.
 * 나머지 필드는 값을 그대로 보내 PUT의 "필드 지우기"(빈 문자열/빈 배열)가 정상 동작하게 한다.
 */
export const buildGatheringDraftPayload = ({
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
}: GatheringForm): SaveGatheringDraftRequest => ({
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
});
