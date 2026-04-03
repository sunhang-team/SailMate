import { queryOptions } from '@tanstack/react-query';

import { getAchievements, getAchievementRanking } from './index';

export const achievementKeys = {
  all: (gatheringId: number) => ['achievements', gatheringId] as const,
  detail: (gatheringId: number) => [...achievementKeys.all(gatheringId), 'detail'] as const,
  ranking: (gatheringId: number) => [...achievementKeys.all(gatheringId), 'ranking'] as const,
};

export const achievementQueries = {
  /** GET /gatherings/:gatheringId/achievements — 모임 전체 달성률 현황 */
  detail: (gatheringId: number) =>
    queryOptions({
      queryKey: achievementKeys.detail(gatheringId),
      queryFn: () => getAchievements(gatheringId),
    }),
  /** GET /gatherings/:gatheringId/achievements/ranking — 달성률 순위 */
  ranking: (gatheringId: number) =>
    queryOptions({
      queryKey: achievementKeys.ranking(gatheringId),
      queryFn: () => getAchievementRanking(gatheringId),
    }),
};
