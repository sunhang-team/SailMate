export const MY_PAGE_TAB_ITEMS = [
  { key: 'my-gatherings', label: '나의 모임' },
  { key: 'created-gatherings', label: '만든 모임' },
  { key: 'pending-gatherings', label: '대기중인 모임' },
  { key: 'received-reviews', label: '받은 리뷰' },
  { key: 'liked-gatherings', label: '찜한 모임' },
] as const;

export type MyPageTab = (typeof MY_PAGE_TAB_ITEMS)[number]['key'];
export const DEFAULT_TAB: MyPageTab = 'my-gatherings';
