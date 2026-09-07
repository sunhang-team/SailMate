import { SCHEDULE_STEP_FIELDS } from './steps';

import type { GetGatheringDraftDetailResponse } from '@/api/gatherings/types';

export type FunnelStep = 'BASIC' | 'SCHEDULE' | 'COMPLETE' | 'DETAIL';

/**
 * draft 상세 데이터에 SCHEDULE 단계 필드가 하나라도 채워져 있으면
 * 이미 SCHEDULE 단계까지 저장이 진행된 것으로 보고 SCHEDULE부터 시작한다.
 */
export const getInitialDraftStep = (draft: GetGatheringDraftDetailResponse): FunnelStep => {
  const hasScheduleField = SCHEDULE_STEP_FIELDS.some((field) => Boolean(draft[field]));
  return hasScheduleField ? 'SCHEDULE' : 'BASIC';
};
