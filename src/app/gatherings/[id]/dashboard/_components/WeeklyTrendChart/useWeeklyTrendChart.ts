'use client';

import { useState } from 'react';

import { useSuspenseQueries } from '@tanstack/react-query';

import { achievementQueries } from '@/api/achievements/queries';
import { gatheringQueries } from '@/api/gatherings/queries';
import { useAuth } from '@/hooks/useAuth';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { getCurrentWeek } from '@/lib/formatGatheringDate';

interface UseWeeklyTrendChartProps {
  gatheringId: number;
}

export const useWeeklyTrendChart = ({ gatheringId }: UseWeeklyTrendChartProps) => {
  const [filterType, setFilterType] = useState<'me' | 'team'>('me');
  const { user } = useAuth();

  const isDesktop = useMediaQuery('(min-width: 1024px)');
  const isTablet = useMediaQuery('(min-width: 768px)');
  const barWidth = isDesktop ? 80 : isTablet ? 50 : 25;
  const barRadius = isDesktop ? 16 : isTablet ? 12 : 6;

  const [{ data: gathering }, { data: achievements }] = useSuspenseQueries({
    queries: [gatheringQueries.detail(gatheringId), achievementQueries.detail(gatheringId)],
  });

  const currentWeek = getCurrentWeek(gathering.startDate);
  const totalWeeks = gathering.totalWeeks;
  const chartMinWidth = `${Math.max(100, (totalWeeks / 4) * 100)}%`;

  const getWeeklyRates = () => {
    if (filterType === 'team') {
      return achievements.teamWeeklyRates;
    }
    const myAchievement = achievements.members.find((m) => m.userId === user?.id);
    return myAchievement?.weeklyRates || [];
  };

  const currentRates = getWeeklyRates();

  const chartData = Array.from({ length: totalWeeks }, (_, i) => {
    const week = i + 1;
    const rateData = currentRates.find((r) => r.week === week);
    return {
      week,
      rate: rateData ? rateData.rate : null,
    };
  });

  return {
    filterType,
    setFilterType,
    chartData,
    currentWeek,
    totalWeeks,
    chartMinWidth,
    barWidth,
    barRadius,
  };
};
