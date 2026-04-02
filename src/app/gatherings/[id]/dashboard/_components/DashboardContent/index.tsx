import { SuspenseBoundary } from '@/components/SuspenseBoundary';

import { MotivationSection } from '../MotivationSection';

import type { DashboardTab } from '../../_constants';

interface DashboardContentProps {
  activeTab: DashboardTab;
  gatheringId: number;
}

export function DashboardContent({ activeTab, gatheringId }: DashboardContentProps) {
  return (
    <section className='px-4 py-10 md:px-8 xl:px-30'>
      <div>
        {activeTab === 'summary' && (
          <SuspenseBoundary
            pendingFallback={<div className='h-96 animate-pulse rounded-2xl bg-gray-100' />}
            errorFallback={<p className='text-body-02-r text-gray-400'>동기부여 섹션을 불러오는데 실패했습니다.</p>}
          >
            <MotivationSection gatheringId={gatheringId} />
          </SuspenseBoundary>
        )}
      </div>
    </section>
  );
}
