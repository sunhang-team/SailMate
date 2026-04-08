export const GATHERING_TYPES = ['스터디', '프로젝트'] as const;

/** 모임 상태 → Tag variant state 매핑 */
export const GATHERING_STATUS_TAG_STATE = {
  RECRUITING: 'recruiting',
  IN_PROGRESS: 'progressing',
  COMPLETED: 'completed',
} as const;

/** 모임 상태 → 한글 라벨 매핑 */
export const GATHERING_STATUS_LABEL = {
  RECRUITING: '모집중',
  IN_PROGRESS: '진행중',
  COMPLETED: '진행완료',
} as const;

export const DEFAULT_CATEGORIES = [
  { id: 1, name: '개발' },
  { id: 2, name: '어학' },
  { id: 3, name: '독서' },
  { id: 4, name: '자격증' },
  { id: 5, name: '디자인' },
] as const;
