import { HttpResponse, http, delay } from 'msw';

import { createApiResponse } from '../utils';

import type { GetMyLikesResponse } from '@/api/likes/types';

const MOCK_DELAY = 300;

const mockMyLikesResponse: GetMyLikesResponse = {
  gatherings: [
    {
      id: 1,
      type: 'STUDY',
      category: 'DEVELOPMENT',
      title: 'React 완전 정복 스터디',
      shortDescription: 'React 심화 학습을 함께해요',
      tags: ['React', 'Frontend'],
      maxMembers: 10,
      currentMembers: 6,
      recruitDeadline: '2025-05-01',
      startDate: '2025-05-10',
      endDate: '2025-07-10',
      status: 'RECRUITING',
      isLiked: true,
      leader: { id: 2, nickname: '항해사', profileImage: null },
    },
    {
      id: 2,
      type: 'PROJECT',
      category: 'DEVELOPMENT',
      title: 'TypeScript 딥다이브',
      shortDescription: 'TypeScript를 깊게 파봐요',
      tags: ['TypeScript', 'Backend'],
      maxMembers: 8,
      currentMembers: 3,
      recruitDeadline: '2025-05-15',
      startDate: '2025-05-20',
      endDate: '2025-08-20',
      status: 'RECRUITING',
      isLiked: true,
      leader: { id: 3, nickname: '마감왕', profileImage: null },
    },
  ],
  totalCount: 2,
  totalPages: 1,
  currentPage: 1,
};

export const likesHandlers = [
  /** POST v1/gatherings/:gatheringId/likes — 찜 추가 */
  http.post('/api/v1/gatherings/:gatheringId/likes', async () => {
    await delay(MOCK_DELAY);
    return HttpResponse.json(createApiResponse({ success: true }), { status: 201 });
  }),

  /** DELETE v1/gatherings/:gatheringId/likes — 찜 취소 */
  http.delete('/api/v1/gatherings/:gatheringId/likes', async () => {
    await delay(MOCK_DELAY);
    return HttpResponse.json(createApiResponse({ success: true }));
  }),

  /** GET v1/users/me/likes — 내 찜 목록 */
  http.get('/api/v1/users/me/likes', async () => {
    await delay(MOCK_DELAY);
    return HttpResponse.json(createApiResponse(mockMyLikesResponse));
  }),
];
