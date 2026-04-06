export const GATHERING_TYPES = ['STUDY', 'PROJECT'] as const;

export const GATHERING_TYPE_LABEL: Record<(typeof GATHERING_TYPES)[number], string> = {
  STUDY: '스터디',
  PROJECT: '프로젝트',
};

export const GATHERING_CATEGORIES = ['DEVELOPMENT', 'LANGUAGE', 'BOOK', 'CERTIFICATE', 'DESIGN'] as const;

export const GATHERING_CATEGORY_LABEL: Record<(typeof GATHERING_CATEGORIES)[number], string> = {
  DEVELOPMENT: '개발',
  LANGUAGE: '어학',
  BOOK: '독서',
  CERTIFICATE: '자격증',
  DESIGN: '디자인',
};
