'use client';

import { useEffect } from 'react';

import { trackGatheringDashboardView } from '@/lib/analytics/gathering';

import type { DashboardTab } from '../../_constants';

interface DashboardViewTrackerProps {
  gatheringId: number;
  tab: DashboardTab;
}

// 페이지 진입(직접 URL/내부 navigation 모두) + 탭 변경 시마다 1회 발사.
// 탭은 ?tab= 쿼리로만 바뀌고 page.tsx 가 re-render 되어 이 컴포넌트의 props 가 갱신되므로
// deps 에 [tab, gatheringId] 만 두면 충분하다. 동일 tab 내 재마운트는 effect 가 같은 deps 로
// 다시 실행되지만 view_dashboard 는 "탭별 활성도" 신호라 의도된 동작.
export function DashboardViewTracker({ gatheringId, tab }: DashboardViewTrackerProps) {
  useEffect(() => {
    trackGatheringDashboardView({ gatheringId: String(gatheringId), tab });
  }, [gatheringId, tab]);

  return null;
}
