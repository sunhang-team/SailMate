import { toFormValues } from './EditGatheringContent';

import type { GatheringDetail } from '@/api/gatherings/types';

const buildDetail = (overrides: Partial<GatheringDetail> = {}): GatheringDetail => ({
  id: 1,
  type: '스터디',
  categories: ['개발', '디자인'],
  title: '테스트 모임',
  shortDescription: '한 줄 소개',
  tags: ['React', 'TypeScript'],
  maxMembers: 5,
  currentMembers: 2,
  recruitDeadline: '2026-06-01',
  startDate: '2026-06-10',
  endDate: '2026-07-10',
  status: 'RECRUITING',
  leader: { id: 1, nickname: 'leader', profileImage: null },
  description: '상세 설명',
  goal: '목표',
  totalWeeks: 4,
  images: [],
  weeklyPlans: [
    { week: 1, title: '주차 1', startDate: '2026-06-10', endDate: '2026-06-16', details: ['할 일 1', '할 일 2'] },
    { week: 2, title: '주차 2', startDate: '2026-06-17', endDate: '2026-06-23' },
  ],
  members: [],
  myApplicationStatus: null,
  ...overrides,
});

describe('toFormValues (name→id 역매핑)', () => {
  const nameToId: Record<string, number> = {
    개발: 7,
    어학: 8,
    독서: 9,
    자격증: 10,
    디자인: 11,
  };

  it('detail.categories(이름 배열)를 categoryIds(숫자 배열)로 정확히 역매핑한다', () => {
    const detail = buildDetail({ categories: ['개발', '디자인'] });
    const result = toFormValues(detail, nameToId);

    expect(result.categoryIds).toEqual([7, 11]);
  });

  it('nameToId 맵에 없는 이름은 필터링되어 categoryIds에서 제외된다', () => {
    const detail = buildDetail({ categories: ['개발', '알수없음', '어학'] });
    const result = toFormValues(detail, nameToId);

    expect(result.categoryIds).toEqual([7, 8]);
  });

  it('빈 categories는 빈 categoryIds로 매핑된다', () => {
    const detail = buildDetail({ categories: [] });
    const result = toFormValues(detail, nameToId);

    expect(result.categoryIds).toEqual([]);
  });

  it('백엔드 카테고리 id가 변경되어도 nameToId 맵 기준으로 정확히 복원된다', () => {
    const newNameToId: Record<string, number> = {
      개발: 101,
      어학: 102,
      독서: 103,
      자격증: 104,
      디자인: 105,
    };
    const detail = buildDetail({ categories: ['독서', '자격증'] });
    const result = toFormValues(detail, newNameToId);

    expect(result.categoryIds).toEqual([103, 104]);
  });

  it('상세 정보의 나머지 필드(type, title, weeklyGuides 등)를 GatheringForm 형태로 변환한다', () => {
    const detail = buildDetail();
    const result = toFormValues(detail, nameToId);

    expect(result).toMatchObject({
      type: '스터디',
      title: '테스트 모임',
      shortDescription: '한 줄 소개',
      description: '상세 설명',
      tags: ['React', 'TypeScript'],
      goal: '목표',
      maxMembers: 5,
      recruitDeadline: '2026-06-01',
      startDate: '2026-06-10',
      endDate: '2026-07-10',
    });
    expect(result.weeklyGuides).toEqual([
      { week: 1, title: '주차 1', details: ['할 일 1', '할 일 2'] },
      { week: 2, title: '주차 2', details: [] },
    ]);
  });
});
