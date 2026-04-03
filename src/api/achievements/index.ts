import { axiosClient } from '@/lib/axiosClient';
import { unwrapResponse } from '@/api/common/utils';

import type { ApiResponse } from '@/api/common/types';
import type { GatheringAchievements, AchievementRanking } from './types';

/** GET /v1/gatherings/:gatheringId/achievements — 모임 전체 달성률 현황 */
export const getAchievements = async (gatheringId: number): Promise<GatheringAchievements> => {
  const { data } = await axiosClient.get<ApiResponse<GatheringAchievements>>(
    `/v1/gatherings/${gatheringId}/achievements`,
  );
  return unwrapResponse(data);
};

/** GET /v1/gatherings/:gatheringId/achievements/ranking — 달성률 순위 */
export const getAchievementRanking = async (gatheringId: number): Promise<AchievementRanking> => {
  const { data } = await axiosClient.get<ApiResponse<AchievementRanking>>(
    `/v1/gatherings/${gatheringId}/achievements/ranking`,
  );
  return unwrapResponse(data);
};
