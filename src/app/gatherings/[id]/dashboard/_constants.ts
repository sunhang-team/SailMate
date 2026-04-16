export const DASHBOARD_TAB_ITEMS = [
  { key: 'summary', label: '활동 요약' },
  { key: 'weekly', label: '주차별 현황' },
  { key: 'members', label: '멤버' },
  { key: 'meeting', label: '회의' },
] as const;

export type DashboardTab = (typeof DASHBOARD_TAB_ITEMS)[number]['key'];

export const DEFAULT_TAB: DashboardTab = 'summary';
