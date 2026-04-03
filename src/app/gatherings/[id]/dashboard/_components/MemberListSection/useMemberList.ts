import { useState } from 'react';

import { useSuspenseQueries } from '@tanstack/react-query';

import { achievementQueries } from '@/api/achievements/queries';
import { gatheringQueries } from '@/api/gatherings/queries';
import { membershipQueries } from '@/api/memberships/queries';
import { reviewQueries } from '@/api/reviews/queries';
import { useAuth } from '@/hooks/useAuth';
import { getCurrentWeek, getRemainingDays } from '@/lib/formatGatheringDate';

import type { MemberAchievement } from '@/api/achievements/types';
import type { Member } from '@/api/memberships/types';

const MEMBERS_PER_PAGE = 10;
const WARNING_ACHIEVEMENT_THRESHOLD = 0.5; // 50% 이하면 주의 배지 (현재 주차 기준)
const MIN_WEEKS_FOR_WARNING = 2;
const DAYS_PER_WEEK = 7;

export const useMemberList = (gatheringId: number) => {
  const [currentPage, setCurrentPage] = useState(1);

  const { user } = useAuth();

  const [{ data: membersData }, { data: achievementData }, { data: gatheringData }] = useSuspenseQueries({
    queries: [
      membershipQueries.members(gatheringId),
      achievementQueries.detail(gatheringId),
      gatheringQueries.detail(gatheringId),
    ],
  });

  const { totalWeeks, startDate, endDate, shortDescription } = gatheringData;
  const currentWeek = getCurrentWeek(startDate);
  const isGatheringEnded = getRemainingDays(endDate) <= 0;
  const members = membersData.members;
  const totalPages = Math.max(1, Math.ceil(members.length / MEMBERS_PER_PAGE));

  const startIndex = (currentPage - 1) * MEMBERS_PER_PAGE;
  const pagedMembers = members.slice(startIndex, startIndex + MEMBERS_PER_PAGE);

  const memberReviewResults = useSuspenseQueries({
    queries: pagedMembers.map((m) => reviewQueries.list(m.userId)),
  });

  const getAchievedWeeks = (userId: number): number => {
    const memberAchievement = achievementData.members.find((m: MemberAchievement) => m.userId === userId);
    if (!memberAchievement) return 0;
    return memberAchievement.weeklyRates.filter((wr) => wr.rate > 0).length;
  };

  const getBadgeInfo = (member: Member): { type: 'streak' | 'warning' | null; label: string } => {
    const achievedWeeks = getAchievedWeeks(member.userId);
    const achievementRatio = currentWeek > 0 ? achievedWeeks / currentWeek : 0;

    if (achievementRatio <= WARNING_ACHIEVEMENT_THRESHOLD && currentWeek >= MIN_WEEKS_FOR_WARNING) {
      return { type: 'warning', label: '주의' };
    }

    const STREAK_WEEKS_THRESHOLD = 2;
    const memberAchievement = achievementData.members.find((m: MemberAchievement) => m.userId === member.userId);
    if (memberAchievement) {
      let streak = 0;
      for (let w = currentWeek; w >= 1; w--) {
        const weekRate = memberAchievement.weeklyRates.find((wr) => wr.week === w);
        if (weekRate && weekRate.rate > 0) {
          streak++;
        } else {
          break;
        }
      }
      if (streak >= STREAK_WEEKS_THRESHOLD) {
        return { type: 'streak', label: `${streak * DAYS_PER_WEEK}일` };
      }
    }

    return { type: null, label: '' };
  };

  const getHasReviewed = (index: number): boolean => {
    const userReviews = memberReviewResults[index]?.data?.reviews || [];
    return userReviews.some((r) => r.reviewer.id === user?.id);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return {
    user,
    pagedMembers,
    totalPages,
    currentPage,
    totalWeeks,
    goalText: shortDescription,
    isGatheringEnded,
    getBadgeInfo,
    getAchievedWeeks,
    getHasReviewed,
    handlePageChange,
  };
};
