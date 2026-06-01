import { http, HttpResponse, delay } from 'msw';

import { createApiResponse } from '../utils';
import { GATHERING_MEMBERS } from '../_data';
import { mockTodos } from './todos';

import type { GatheringAchievements, AchievementRanking } from '@/api/achievements/types';

const BASE = '/api/v1/gatherings/:gatheringId/achievements';

/** gatheringId=1: sunny (HP 73, 팀달성률 73.3%) */
const mockSunny: GatheringAchievements = {
  members: [
    {
      userId: 1,
      nickname: '김코딩',
      weeklyRates: [
        { week: 1, rate: 100.0 },
        { week: 2, rate: 80.0 },
        { week: 3, rate: 60.0 },
      ],
      overallRate: 80.0,
    },
    {
      userId: 2,
      nickname: '이개발',
      weeklyRates: [
        { week: 1, rate: 80.0 },
        { week: 2, rate: 60.0 },
        { week: 3, rate: 40.0 },
      ],
      overallRate: 60.0,
    },
    {
      userId: 3,
      nickname: '박프로',
      weeklyRates: [
        { week: 1, rate: 60.0 },
        { week: 2, rate: 100.0 },
        { week: 3, rate: 80.0 },
      ],
      overallRate: 80.0,
    },
  ],
  teamWeeklyRates: [
    { week: 1, rate: 80.0 },
    { week: 2, rate: 80.0 },
    { week: 3, rate: 60.0 },
  ],
  teamOverallRate: 73.3,
};

/** gatheringId=2: cloudy (HP 50, 팀달성률 40%) */
const mockCloudy: GatheringAchievements = {
  members: [
    {
      userId: 1,
      nickname: '김코딩',
      weeklyRates: [
        { week: 1, rate: 80.0 },
        { week: 2, rate: 40.0 },
        { week: 3, rate: 30.0 },
      ],
      overallRate: 50.0,
    },
    {
      userId: 2,
      nickname: '이개발',
      weeklyRates: [
        { week: 1, rate: 60.0 },
        { week: 2, rate: 40.0 },
        { week: 3, rate: 30.0 },
      ],
      overallRate: 43.3,
    },
    {
      userId: 3,
      nickname: '박디자인',
      weeklyRates: [
        { week: 1, rate: 70.0 },
        { week: 2, rate: 50.0 },
        { week: 3, rate: 50.0 },
      ],
      overallRate: 56.7,
    },
  ],
  teamWeeklyRates: [
    { week: 1, rate: 70.0 },
    { week: 2, rate: 43.3 },
    { week: 3, rate: 36.7 },
  ],
  teamOverallRate: 40.0,
};

/** gatheringId=3: stormy (HP 25, 팀달성률 15%) */
const mockStormy: GatheringAchievements = {
  members: [
    {
      userId: 1,
      nickname: '김코딩',
      weeklyRates: [
        { week: 1, rate: 40.0 },
        { week: 2, rate: 20.0 },
        { week: 3, rate: 10.0 },
      ],
      overallRate: 23.3,
    },
    {
      userId: 2,
      nickname: '이개발',
      weeklyRates: [
        { week: 1, rate: 30.0 },
        { week: 2, rate: 20.0 },
        { week: 3, rate: 10.0 },
      ],
      overallRate: 20.0,
    },
    {
      userId: 3,
      nickname: '박디자인',
      weeklyRates: [
        { week: 1, rate: 40.0 },
        { week: 2, rate: 30.0 },
        { week: 3, rate: 20.0 },
      ],
      overallRate: 30.0,
    },
  ],
  teamWeeklyRates: [
    { week: 1, rate: 36.7 },
    { week: 2, rate: 23.3 },
    { week: 3, rate: 13.3 },
  ],
  teamOverallRate: 15.0,
};

const achievementsByGathering: Record<string, GatheringAchievements> = {
  '1': mockSunny,
  '2': mockCloudy,
  '3': mockStormy,
};

const mockRanking: AchievementRanking = {
  ranking: [
    {
      rank: 1,
      userId: 1,
      nickname: '김코딩',
      profileImage: 'https://avatars.githubusercontent.com/u/1?v=4',
      overallRate: 80.0,
    },
    {
      rank: 2,
      userId: 3,
      nickname: '박프로',
      profileImage: 'https://avatars.githubusercontent.com/u/3?v=4',
      overallRate: 79.0,
    },
    {
      rank: 3,
      userId: 5,
      nickname: '일본어마스터',
      profileImage: 'https://avatars.githubusercontent.com/u/5?v=4',
      overallRate: 76.0,
    },
    {
      rank: 4,
      userId: 4,
      nickname: '최모바일',
      profileImage: 'https://avatars.githubusercontent.com/u/4?v=4',
      overallRate: 73.3,
    },
    {
      rank: 5,
      userId: 6,
      nickname: '책벌레',
      profileImage: 'https://avatars.githubusercontent.com/u/6?v=4',
      overallRate: 66.7,
    },
    {
      rank: 6,
      userId: 7,
      nickname: '합격러',
      profileImage: 'https://avatars.githubusercontent.com/u/7?v=4',
      overallRate: 63.3,
    },
    {
      rank: 7,
      userId: 2,
      nickname: '이개발',
      profileImage: 'https://avatars.githubusercontent.com/u/2?v=4',
      overallRate: 60.0,
    },
    {
      rank: 8,
      userId: 8,
      nickname: 'DB마스터',
      profileImage: 'https://avatars.githubusercontent.com/u/8?v=4',
      overallRate: 55.0,
    },
    {
      rank: 9,
      userId: 10,
      nickname: '김민수',
      profileImage: 'https://avatars.githubusercontent.com/u/10?v=4',
      overallRate: 52.0,
    },
    {
      rank: 10,
      userId: 11,
      nickname: '최서연',
      profileImage: 'https://avatars.githubusercontent.com/u/11?v=4',
      overallRate: 48.0,
    },
    {
      rank: 11,
      userId: 12,
      nickname: '박수철',
      profileImage: 'https://avatars.githubusercontent.com/u/12?v=4',
      overallRate: 40.0,
    },
    {
      rank: 12,
      userId: 13,
      nickname: '이수태',
      profileImage: 'https://avatars.githubusercontent.com/u/13?v=4',
      overallRate: 33.3,
    },
    {
      rank: 13,
      userId: 14,
      nickname: '김경아',
      profileImage: 'https://avatars.githubusercontent.com/u/14?v=4',
      overallRate: 26.7,
    },
    {
      rank: 14,
      userId: 15,
      nickname: '정수진',
      profileImage: 'https://avatars.githubusercontent.com/u/15?v=4',
      overallRate: 20.0,
    },
  ],
};

const MOCK_DELAY = 300;

// 랭킹은 공유 mock(GATHERING_MEMBERS)에서 해당 gathering의 멤버들을
// 달성률 내림차순으로 정렬해 동적으로 생성한다. 공유 mock에 없는 gathering은 빈 랭킹.
const buildRankingFromShared = (gatheringId: number): AchievementRanking => {
  const members = GATHERING_MEMBERS[gatheringId];
  if (!members) return { ranking: [] };

  const sorted = [...members].sort((a, b) => b.overallAchievementRate - a.overallAchievementRate);
  return {
    ranking: sorted.map((m, idx) => ({
      rank: idx + 1,
      userId: m.userId,
      nickname: m.nickname,
      profileImage: m.profileImage,
      overallRate: m.overallAchievementRate,
    })),
  };
};

// 주차별 달성률 — mockTodos가 있는 멤버는 todos에서 직접 derive (todos handler의 weeklyAchievementRate와 일치),
// 없는 멤버는 GATHERING_MEMBERS.overallAchievementRate를 시드로 합성.
const TOTAL_WEEKS = 8;

const round1 = (n: number) => Math.round(n * 10) / 10;

const buildWeeklyRatesFromTodos = (userId: number): { week: number; rate: number }[] | null => {
  const userTodos = mockTodos.filter((t) => t.userId === userId);
  if (userTodos.length === 0) return null;

  return Array.from({ length: TOTAL_WEEKS }, (_, i) => {
    const week = i + 1;
    const weekTodos = userTodos.filter((t) => t.week === week);
    const rate = weekTodos.length === 0 ? 0 : (weekTodos.filter((t) => t.isCompleted).length / weekTodos.length) * 100;
    return { week, rate: round1(rate) };
  });
};

const computeOverallRateFromTodos = (userId: number): number | null => {
  const userTodos = mockTodos.filter((t) => t.userId === userId);
  if (userTodos.length === 0) return null;
  return round1((userTodos.filter((t) => t.isCompleted).length / userTodos.length) * 100);
};

const synthesizeWeeklyRates = (overall: number) =>
  Array.from({ length: TOTAL_WEEKS }, (_, i) => {
    const variance = ((i * 7 + Math.floor(overall)) % 30) - 15;
    const rate = Math.max(0, Math.min(100, overall + variance));
    return { week: i + 1, rate: round1(rate) };
  });

const buildAchievementsFromShared = (gatheringId: number): GatheringAchievements | null => {
  const members = GATHERING_MEMBERS[gatheringId];
  if (!members) return null;

  const memberAchievements = members.map((m) => {
    const todosWeekly = buildWeeklyRatesFromTodos(m.userId);
    const todosOverall = computeOverallRateFromTodos(m.userId);
    return {
      userId: m.userId,
      nickname: m.nickname,
      weeklyRates: todosWeekly ?? synthesizeWeeklyRates(m.overallAchievementRate),
      overallRate: todosOverall ?? m.overallAchievementRate,
    };
  });

  const teamWeeklyRates = Array.from({ length: TOTAL_WEEKS }, (_, i) => {
    const week = i + 1;
    const sum = memberAchievements.reduce((acc, m) => acc + (m.weeklyRates.find((w) => w.week === week)?.rate ?? 0), 0);
    return { week, rate: round1(sum / memberAchievements.length) };
  });

  const teamOverallRate = round1(
    memberAchievements.reduce((acc, m) => acc + m.overallRate, 0) / memberAchievements.length,
  );

  return { members: memberAchievements, teamWeeklyRates, teamOverallRate };
};

export const achievementsHandlers = [
  /** GET /api/v1/gatherings/:gatheringId/achievements — 모임 전체 달성률 현황 */
  http.get(BASE, async ({ params }) => {
    await delay(MOCK_DELAY);
    const gatheringId = Number(params.gatheringId);
    // 공유 데이터(GATHERING_MEMBERS)에 있는 모임이면 멤버 기반으로 생성, 없으면 기존 시드(Sunny/Cloudy/Stormy)
    const fromShared = buildAchievementsFromShared(gatheringId);
    const data = fromShared ?? achievementsByGathering[String(gatheringId)] ?? mockSunny;
    return HttpResponse.json(createApiResponse<GatheringAchievements>(data));
  }),

  /** GET /api/v1/gatherings/:gatheringId/achievements/ranking — 달성률 순위 */
  http.get(`${BASE}/ranking`, async ({ params }) => {
    await delay(MOCK_DELAY);
    const gatheringId = Number(params.gatheringId);
    return HttpResponse.json(createApiResponse<AchievementRanking>(buildRankingFromShared(gatheringId)));
  }),
];
