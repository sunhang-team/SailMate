import { SuspenseBoundary } from '@/components/SuspenseBoundary';

import { DASHBOARD_TAB_ITEMS, DEFAULT_TAB } from '../../_constants';
import { MemberListSection } from '../MemberListSection';
import { MemberRankingSection } from '../MemberRankingSection';
import { MemberTodoSection } from '../MemberTodoSection';
import { MotivationSection } from '../MotivationSection';
import { MyTodoSection } from '../MyTodoSection';
import { MyTodoSectionSkeleton } from '../MyTodoSection/MyTodoSectionSkeleton';
import { WeeklySummarySection } from '../WeeklySummarySection';
import { WeeklyTrendChart } from '../WeeklyTrendChart';

import type { DashboardTab } from '../../_constants';

interface DashboardContentProps {
  activeTab: DashboardTab;
  gatheringId: number;
}

function WeeklySummarySkeleton() {
  return (
    <div className='border-gray-150 h-[677px] animate-pulse rounded-2xl border bg-white p-4 shadow-(--shadow-02) md:h-[1044px] md:p-6 lg:h-[723px]'>
      <div className='bg-gray-150 mb-4 h-6 w-32 rounded' />
      <div className='flex flex-col gap-4'>
        <div className='h-20 rounded-2xl bg-gray-100' />
        <div className='flex flex-col gap-4 lg:flex-row'>
          <div className='h-60 flex-1 rounded-2xl bg-gray-100' />
          <div className='h-60 flex-1 rounded-2xl bg-gray-100' />
        </div>
        <div className='h-20 rounded-2xl bg-gray-100' />
      </div>
    </div>
  );
}

const shellWeeklyMembers = 'px-4 py-10 md:py-15 lg:py-20 md:px-7 xl:px-30';
const innerMax = 'mx-auto max-w-[1680px]';

export function DashboardContent({ activeTab, gatheringId }: DashboardContentProps) {
  const label =
    DASHBOARD_TAB_ITEMS.find((item) => item.key === activeTab)?.label ??
    DASHBOARD_TAB_ITEMS.find((item) => item.key === DEFAULT_TAB)!.label;

  if (activeTab === 'summary') {
    return (
      <section className='mb-40 px-4 py-10 md:px-8 md:py-20 xl:px-30'>
        <div className={innerMax}>
          <div className='flex flex-col gap-10'>
            <SuspenseBoundary
              pendingFallback={<div className='h-96 animate-pulse rounded-2xl bg-gray-100' />}
              errorFallback={<p className='text-body-02-r text-gray-400'>동기부여 섹션을 불러오는데 실패했습니다.</p>}
              resetKeys={[gatheringId]}
            >
              <MotivationSection gatheringId={gatheringId} />
            </SuspenseBoundary>
            <SuspenseBoundary
              pendingFallback={<WeeklySummarySkeleton />}
              errorFallback={<p className='text-body-02-r text-gray-400'>활동 요약을 불러오는데 실패했습니다.</p>}
              resetKeys={[gatheringId]}
            >
              <WeeklySummarySection gatheringId={gatheringId} />
            </SuspenseBoundary>
            <SuspenseBoundary
              pendingFallback={<div className='h-96 animate-pulse rounded-2xl bg-gray-100' />}
              errorFallback={<p className='text-body-02-r text-gray-400'>멤버 랭킹을 불러오는데 실패했습니다.</p>}
              resetKeys={[gatheringId]}
            >
              <MemberRankingSection gatheringId={gatheringId} />
            </SuspenseBoundary>
            <SuspenseBoundary
              pendingFallback={<div className='h-96 animate-pulse rounded-2xl bg-gray-100' />}
              errorFallback={
                <p className='text-body-02-r text-gray-400'>주차별 달성률 추이를 불러오는데 실패했습니다.</p>
              }
              resetKeys={[gatheringId]}
            >
              <WeeklyTrendChart gatheringId={gatheringId} />
            </SuspenseBoundary>
          </div>
        </div>
      </section>
    );
  }

  if (activeTab === 'weekly') {
    return (
      <section className={shellWeeklyMembers}>
        <div className={`${innerMax} flex flex-col gap-10`}>
          <SuspenseBoundary
            pendingFallback={<MyTodoSectionSkeleton />}
            errorFallback={
              <p className='text-body-02-r py-20 text-center text-gray-500'>할 일 목록을 불러오는데 실패했습니다.</p>
            }
            resetKeys={[gatheringId]}
          >
            <MyTodoSection gatheringId={gatheringId} />
          </SuspenseBoundary>
          <SuspenseBoundary
            pendingFallback={<div className='h-96 animate-pulse rounded-2xl bg-gray-100' />}
            errorFallback={<p className='text-body-02-r text-gray-400'>멤버 할 일을 불러오는데 실패했습니다.</p>}
            resetKeys={[gatheringId]}
          >
            <MemberTodoSection gatheringId={gatheringId} />
          </SuspenseBoundary>
        </div>
      </section>
    );
  }

  if (activeTab === 'members') {
    return (
      <section className={shellWeeklyMembers}>
        <div className={innerMax}>
          <SuspenseBoundary
            pendingFallback={<div className='h-96 animate-pulse rounded-2xl bg-gray-100' />}
            errorFallback={<p className='text-body-02-r text-gray-400'>멤버 목록을 불러오는데 실패했습니다.</p>}
            resetKeys={[gatheringId]}
          >
            <MemberListSection gatheringId={gatheringId} />
          </SuspenseBoundary>
        </div>
      </section>
    );
  }

  return (
    <section className={shellWeeklyMembers}>
      <div className={innerMax}>
        <p className='text-body-02-r text-gray-400'>{label} 콘텐츠가 여기에 표시됩니다.</p>
      </div>
    </section>
  );
}
