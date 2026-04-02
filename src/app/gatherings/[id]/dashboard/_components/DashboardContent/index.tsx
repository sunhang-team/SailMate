import { DASHBOARD_TAB_ITEMS, DEFAULT_TAB } from '../../_constants';

import type { DashboardTab } from '../../_constants';

interface DashboardContentProps {
  activeTab: DashboardTab;
  gatheringId: number;
}

export function DashboardContent({ activeTab }: DashboardContentProps) {
  const label =
    DASHBOARD_TAB_ITEMS.find((item) => item.key === activeTab)?.label ??
    DASHBOARD_TAB_ITEMS.find((item) => item.key === DEFAULT_TAB)!.label;

  return (
    <section className='px-4 py-10 md:px-8 lg:px-30'>
      <div className='mx-auto max-w-[1200px]'>
        <p className='text-body-02-r text-gray-400'>{label} 콘텐츠가 여기에 표시됩니다.</p>
      </div>
    </section>
  );
}
