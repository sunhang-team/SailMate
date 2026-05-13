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
