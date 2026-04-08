export const MY_PAGE_TAB_ITEMS = [
  { key: 'my-gatherings', label: '나의 모임' },
  { key: 'created-gatherings', label: '만든 모임' },
  { key: 'pending-gatherings', label: '대기중인 모임' },
  { key: 'received-reviews', label: '받은 리뷰' },
  { key: 'liked-gatherings', label: '찜한 모임' },
] as const;

export type MyPageTab = (typeof MY_PAGE_TAB_ITEMS)[number]['key'];
export const DEFAULT_TAB: MyPageTab = 'my-gatherings';

/** 대기중인 모임 탭 — 신청일시 정렬 (URL `pendingSort`) */
export const PENDING_GATHERING_SORT_VALUES = ['latest', 'oldest'] as const;
export type PendingGatheringSort = (typeof PENDING_GATHERING_SORT_VALUES)[number];
export const DEFAULT_PENDING_GATHERING_SORT: PendingGatheringSort = 'latest';

export const parsePendingGatheringSort = (value: string | undefined): PendingGatheringSort => {
  if (value === 'latest' || value === 'oldest') return value;
  return DEFAULT_PENDING_GATHERING_SORT;
};
