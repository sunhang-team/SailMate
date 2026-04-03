import type { Todo } from '@/api/todos/types';

/**
 * 현재 주차부터 역순으로 완료된 todo가 하나라도 있는 연속 주차 수 × 7을 반환
 *
 * TODO: 정확한 일별 연속 달성 일수를 계산하려면 일별 완료 데이터(completedAt 등)가 필요함.
 * 현재 API는 주차별 달성률만 제공하므로 주 단위로 근사 계산.
 */
export const calculateStreakDays = (todos: Todo[], currentWeek: number): number => {
  let streak = 0;
  for (let w = currentWeek; w >= 1; w--) {
    const hasCompleted = todos.some((t) => t.week === w && t.isCompleted);
    if (!hasCompleted) break;
    streak++;
  }
  return streak * 7;
};
