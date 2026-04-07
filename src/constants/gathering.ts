export const GATHERING_TYPES = ['스터디', '프로젝트'] as const;

/** 카테고리 기본값 (서버에서 GET /gatherings/categories로 동적 조회 가능) */
export const DEFAULT_CATEGORIES = [
  { id: 1, name: '개발' },
  { id: 2, name: '어학' },
  { id: 3, name: '독서' },
  { id: 4, name: '자격증' },
  { id: 5, name: '디자인' },
] as const;
