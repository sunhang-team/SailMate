'use client';

import { startTransition, useMemo, useState } from 'react';

import { useSuspenseQuery } from '@tanstack/react-query';
import { differenceInWeeks } from 'date-fns';

import { gatheringQueries } from '@/api/gatherings/queries';
import { todoQueries } from '@/api/todos/queries';
import { ProgressBar } from '@/components/ui/Progress';

import { TodoAddForm } from './TodoAddForm';
import { TodoItem } from './TodoItem';
import { WeekSelector } from './WeekSelector';

interface MyTodoSectionProps {
  gatheringId: number;
}

const MIN_WEEK = 1;

export function MyTodoSection({ gatheringId }: MyTodoSectionProps) {
  const { data: gathering } = useSuspenseQuery(gatheringQueries.detail(gatheringId));

  const currentWeek = useMemo(() => {
    const now = new Date();
    const startDate = new Date(gathering.startDate);
    return Math.max(MIN_WEEK, differenceInWeeks(now, startDate) + 1);
  }, [gathering.startDate]);

  // 기본 선택 주차는 "현재 주차"를 우선하되, totalWeeks를 넘지 않도록 방어합니다.
  const [week, setWeek] = useState(() => Math.min(gathering.totalWeeks, currentWeek));

  const { data } = useSuspenseQuery(todoQueries.myList(gatheringId, { week }));

  const totalCount = data.todos.length;
  const completedCount = data.todos.filter((todo) => todo.isCompleted).length;
  const progressValue = totalCount === 0 ? 0 : Math.round((completedCount / totalCount) * 100);

  // 미완료를 위에, 완료를 아래에 — 같은 그룹 안에서는 id 순으로 안정 정렬
  const sortedTodos = useMemo(
    () =>
      [...data.todos].sort((a, b) => {
        if (a.isCompleted !== b.isCompleted) return a.isCompleted ? 1 : -1;
        return a.id - b.id;
      }),
    [data.todos],
  );

  const handleWeekChange = (nextWeek: number) => {
    // 주차 변경 시 Suspense 재진입으로 fallback이 깜빡일 수 있어 startTransition으로 우선순위를 낮춥니다.
    startTransition(() => {
      setWeek(nextWeek);
    });
  };

  return (
    <section className='bg-gray-0 shadow-01 border-gray-150 w-full rounded-2xl border'>
      <header className='flex flex-wrap items-center justify-between gap-6 px-7 py-6 md:gap-8'>
        <h2 className='text-small-01-sb md:text-body-01-sb lg:text-h5-sb text-gray-900'>이번주 할 일 ✅</h2>

        <div className='flex shrink-0 items-center gap-2 py-1 md:gap-8'>
          <div className='flex items-center gap-2 md:gap-4'>
            <span className='text-small-02-r md:text-body-02-r lg:text-body-01-m inline-flex items-center leading-none'>
              <span className='text-blue-300 tabular-nums'>{completedCount}</span>
              <span className='text-gray-500'>/{totalCount} 완료</span>
            </span>
            <ProgressBar
              value={progressValue}
              layout='horizontal'
              className='w-[50px] md:w-[160px] lg:w-[200px]'
              barClassName='h-2 md:h-3 lg:h-4'
            />
          </div>
          <WeekSelector week={week} totalWeeks={gathering.totalWeeks} onChange={handleWeekChange} />
        </div>
      </header>

      <div className='px-7'>
        <ul className='flex flex-col gap-3'>
          {sortedTodos.map((todo) => (
            <TodoItem key={todo.id} gatheringId={gatheringId} week={week} todo={todo} />
          ))}
        </ul>

        {/* 리스트 카드와 할 일 추가 영역 사이 가로 구분선 (피그마) */}
        <div className='bg-gray-150 mt-4 mb-4 h-px w-full md:mt-6 md:mb-6' aria-hidden />

        <div className='pb-7'>
          <TodoAddForm gatheringId={gatheringId} week={week} />
        </div>
      </div>
    </section>
  );
}
