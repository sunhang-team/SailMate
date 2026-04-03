import { SuspenseBoundary } from '@/components/SuspenseBoundary';

import { MotivationSection } from '../MotivationSection';
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

export function DashboardContent({ activeTab, gatheringId }: DashboardContentProps) {
  return (
    <section className='px-4 py-10 md:px-8 xl:px-30'>
      <div>
        {activeTab === 'summary' && (
          <div className='flex flex-col gap-6'>
            <SuspenseBoundary
              pendingFallback={<div className='h-96 animate-pulse rounded-2xl bg-gray-100' />}
              errorFallback={<p className='text-body-02-r text-gray-400'>동기부여 섹션을 불러오는데 실패했습니다.</p>}
            >
              <MotivationSection gatheringId={gatheringId} />
            </SuspenseBoundary>
            <SuspenseBoundary
              pendingFallback={<WeeklySummarySkeleton />}
              errorFallback={<p className='text-body-02-r text-gray-400'>활동 요약을 불러오는데 실패했습니다.</p>}
            >
              <WeeklySummarySection gatheringId={gatheringId} />
            </SuspenseBoundary>
            <SuspenseBoundary
              pendingFallback={<div className='h-96 animate-pulse rounded-2xl bg-gray-100' />}
              errorFallback={
                <p className='text-body-02-r text-gray-400'>주차별 달성률 추이를 불러오는데 실패했습니다.</p>
              }
            >
              <WeeklyTrendChart gatheringId={gatheringId} />
            </SuspenseBoundary>
          </div>
        )}
      </div>
    </section>
  );
}
