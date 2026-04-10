import { HttpResponse, http, delay } from 'msw';

import { createApiResponse } from '../utils';

import type { UserReviewListResponse } from '@/api/reviews/types';

const MOCK_DELAY = 300;

const mockUserReviewListResponse: UserReviewListResponse = {
  reviews: [
    {
      id: 30,
      reviewer: { id: 1, nickname: '김코딩' },
      gatheringTitle: 'React 완전 정복 스터디',
      tags: ['성실해요', '소통이 좋아요'],
      comment: '항상 열심히 참여해주셨어요!',
      createdAt: '2025-04-20T10:00:00Z',
    },
    {
      id: 31,
      reviewer: { id: 2, nickname: '항해사' },
      gatheringTitle: 'JavaScript 딥다이브',
      tags: ['잘 도와줘요', '시간을 잘 지켜요'],
      comment: '시간 약속도 잘 지키고 많이 도와주셨습니다.',
      createdAt: '2025-04-22T14:30:00Z',
    },
  ],
  totalCount: 12,
  matesTagCounts: [
    { tag: '연기', count: 3 },
    { tag: '불씨', count: 2 },
    { tag: '불꽃', count: 4 },
    { tag: '태양', count: 1 },
  ],
};

const MOCK_TITLES = ['React 완전 정복 스터디', 'JavaScript 딥다이브', 'Next.js 프로그래밍', '실전 TypeScript'];
const MOCK_COMMENTS = [
  '항상 열심히 참여해주셨어요! 도움이 많이 되었습니다.',
  '시간 약속도 잘 지키고 피드백도 친절해서 좋았어요.',
  '소통이 원활하고 책임감이 강한 분입니다.',
  '함께 협업하면서 배울 점이 많았던 팀원입니다.',
];
const MOCK_TAGS = ['성실해요', '소통이 좋아요', '잘 도와줘요', '시간을 잘 지켜요', '다시 함께하고 싶어요'];
const MOCK_MATES_TAGS = ['연기', '불씨', '불꽃', '태양'];

export const reviewsHandlers = [
  /** POST v1/gatherings/:gatheringId/reviews — 리뷰 작성 */
  http.post('/api/v1/gatherings/:gatheringId/reviews', async () => {
    await delay(MOCK_DELAY);
    return HttpResponse.json(createApiResponse({ success: true }), { status: 201 });
  }),

  /** GET v1/users/:userId/reviews — 리뷰 목록 조회 */
  http.get('/api/v1/users/:userId/reviews', async ({ params, request }) => {
    await delay(MOCK_DELAY);
    const userId = Number(params.userId);
    const url = new URL(request.url);
    const page = Number(url.searchParams.get('page') || 1);
    const limit = Number(url.searchParams.get('limit') || 2); // 기본값 2

    // userId에 따라 총 리뷰 수를 다르게 설정 (0~15개)
    const totalCount = (userId * 7) % 16;

    const reviews = Array.from({ length: totalCount }).map((_, index) => ({
      id: userId * 100 + index,
      reviewer: { id: index + 10, nickname: `닉네임${index + 10}`, profileImage: undefined },
      gatheringTitle: MOCK_TITLES[index % MOCK_TITLES.length],
      tags: [MOCK_TAGS[index % MOCK_TAGS.length], MOCK_TAGS[(index + 1) % MOCK_TAGS.length]],
      matesTag: MOCK_MATES_TAGS[index % MOCK_MATES_TAGS.length],
      comment: MOCK_COMMENTS[index % MOCK_COMMENTS.length],
      createdAt: new Date(Date.now() - index * 86400000).toISOString(),
    }));

    const matesTagCounts = MOCK_MATES_TAGS.map((tag) => ({
      tag,
      count: reviews.filter((r) => r.matesTag === tag).length,
    }));

    const startIndex = (page - 1) * limit;
    const paginatedReviews = reviews.slice(startIndex, startIndex + limit);

    return HttpResponse.json(
      createApiResponse({
        reviews: paginatedReviews,
        totalCount,
        matesTagCounts,
      }),
    );
  }),
];
