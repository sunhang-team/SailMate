import { SuspenseBoundary } from '@/components/SuspenseBoundary';

import { DASHBOARD_TAB_ITEMS, DEFAULT_TAB } from '../../_constants';
import { MyTodoSection } from '../MyTodoSection';
import { MyTodoSectionSkeleton } from '../MyTodoSection/MyTodoSectionSkeleton';

import type { DashboardTab } from '../../_constants';

interface DashboardContentProps {
  activeTab: DashboardTab;
  gatheringId: number;
}

export function DashboardContent({ activeTab, gatheringId }: DashboardContentProps) {
  const label =
    DASHBOARD_TAB_ITEMS.find((item) => item.key === activeTab)?.label ??
    DASHBOARD_TAB_ITEMS.find((item) => item.key === DEFAULT_TAB)!.label;

  if (activeTab === 'weekly') {
    // 주차별 현황 탭 상단: "이번주 할 일" 섹션 — 유저별 데이터는 섹션 단위 SuspenseBoundary로 로딩/에러 격리
    return (
      <section className='px-4 py-10 md:px-7 xl:px-30'>
        <div className='mx-auto max-w-[1680px]'>
          <SuspenseBoundary
            pendingFallback={<MyTodoSectionSkeleton />}
            errorFallback={
              <p className='text-body-02-r py-20 text-center text-gray-500'>할 일 목록을 불러오는데 실패했습니다.</p>
            }
            resetKeys={[gatheringId]}
          >
            <MyTodoSection gatheringId={gatheringId} />
          </SuspenseBoundary>
        </div>
      </section>
    );
  }

  return (
    <section className='px-4 py-10 md:px-7 xl:px-30'>
      <div className='mx-auto max-w-[1680px]'>
        <p className='text-body-02-r text-gray-400'>{label} 콘텐츠가 여기에 표시됩니다.</p>
      </div>
    </section>
  );
}
