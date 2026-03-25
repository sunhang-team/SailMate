import { HttpResponse, http, delay } from 'msw';

import { createApiResponse } from '../utils';

import type { UserReviewListResponse } from '@/api/reviews/types';

const MOCK_DELAY = 300;

const mockUserReviewListResponse: UserReviewListResponse = {
  reviews: [
    {
      id: 30,
      reviewer: { id: 1, nickname: '마감왕' },
      gatheringTitle: 'React 완전 정복 스터디',
      tags: ['성실해요', '소통이 좋아요'],
      comment: '항상 열심히 참여해주셨어요!',
      createdAt: '2025-04-20T10:00:00Z',
    },
    {
      id: 31,
      reviewer: { id: 2, nickname: '항해사' },
      gatheringTitle: 'JavaScript 딥다이브',
      tags: ['시간을 잘 지켜요', '잘 도와줘요'],
      comment: '시간 약속도 잘 지키고 많이 도와주셨습니다.',
      createdAt: '2025-04-22T14:30:00Z',
    },
  ],
  totalCount: 12,
};

export const reviewsHandlers = [
  /** POST v1/gatherings/:gatheringId/reviews — 리뷰 작성 */
  http.post('/api/v1/gatherings/:gatheringId/reviews', async () => {
    await delay(MOCK_DELAY);
    return HttpResponse.json(createApiResponse({ success: true }), { status: 201 });
  }),

  /** GET v1/users/:userId/reviews — 리뷰 목록 조회 */
  http.get('/api/v1/users/:userId/reviews', async () => {
    await delay(MOCK_DELAY);
    return HttpResponse.json(createApiResponse(mockUserReviewListResponse));
  }),
];
