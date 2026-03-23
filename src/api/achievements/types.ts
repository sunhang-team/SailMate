// 주차별 달성률
export interface WeeklyRate {
  week: number;
  rate: number;
}

// GET /gatherings/:gatheringId/achievements - 멤버별 달성률
export interface MemberAchievement {
  userId: number;
  nickname: string;
  weeklyRates: WeeklyRate[];
  overallRate: number;
}

// GET /gatherings/:gatheringId/achievements 응답
export interface GatheringAchievements {
  members: MemberAchievement[];
  teamWeeklyRates: WeeklyRate[];
  teamOverallRate: number;
}

// GET /gatherings/:gatheringId/achievements/ranking - 순위 항목
export interface AchievementRankingItem {
  rank: number;
  userId: number;
  nickname: string;
  profileImage: string;
  overallRate: number;
}

// GET /gatherings/:gatheringId/achievements/ranking 응답
export interface AchievementRanking {
  ranking: AchievementRankingItem[];
}
