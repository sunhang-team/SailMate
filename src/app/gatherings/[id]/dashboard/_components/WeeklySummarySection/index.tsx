'use client';

import { useSuspenseQueries, useSuspenseQuery } from '@tanstack/react-query';

import { achievementQueries } from '@/api/achievements/queries';
import { gatheringQueries } from '@/api/gatherings/queries';
import { todoQueries } from '@/api/todos/queries';
import { getCurrentWeek, getRemainingDays } from '@/lib/formatGatheringDate';
import { calculateStreakDays } from '@/lib/streakUtils';

import { AchievementGauge } from './AchievementGauge';
import { StreakBadge } from './StreakBadge';
import { SummaryInfoCard } from './SummaryInfoCard';

const MY_ARC_COLOR = '#1e58f8'; // blue-400
const TEAM_ARC_COLOR = '#00ccff'; // blue-200

interface WeeklySummarySectionProps {
  gatheringId: number;
}

export function WeeklySummarySection({ gatheringId }: WeeklySummarySectionProps) {
  const [{ data: gatheringData }, { data: achievementData }] = useSuspenseQueries({
    queries: [gatheringQueries.detail(gatheringId), achievementQueries.detail(gatheringId)],
  });

  const currentWeek = getCurrentWeek(gatheringData.startDate);
  const remainingDays = getRemainingDays(gatheringData.endDate);

  const { data: myTodoData } = useSuspenseQuery(todoQueries.myList(gatheringId, { week: currentWeek }));

  const currentWeekTodos = myTodoData.todos.filter((t) => t.week === currentWeek);
  const incompleteTodoCount = currentWeekTodos.filter((t) => !t.isCompleted).length;
  const myRate = myTodoData.weeklyAchievementRate;
  const teamRate = achievementData.teamWeeklyRates.find((r) => r.week === currentWeek)?.rate ?? 0;
  const streakDays = calculateStreakDays(myTodoData.todos, currentWeek);

  return (
    <div className='border-gray-150 h-[677px] rounded-2xl border bg-white p-4 shadow-(--shadow-02) md:h-[1044px] md:p-6 lg:h-[723px]'>
      <p className='text-small-01-sb md:text-body-01-sb lg:text-h5-sb mb-4 text-gray-900'>이번주 요약 ✅</p>

      <div className='flex flex-col gap-4'>
        <SummaryInfoCard
          currentWeek={currentWeek}
          remainingDays={remainingDays}
          incompleteTodoCount={incompleteTodoCount}
        />

        <div className='flex flex-col gap-4 lg:flex-row'>
          <AchievementGauge label='내 달성률' rate={myRate} arcColor={MY_ARC_COLOR} />
          <AchievementGauge label='팀 달성률' rate={teamRate} arcColor={TEAM_ARC_COLOR} />
        </div>

        {streakDays > 0 && <StreakBadge streakDays={streakDays} />}
      </div>
    </div>
  );
}
