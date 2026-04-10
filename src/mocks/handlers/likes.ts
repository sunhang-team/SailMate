import { HttpResponse, http, delay } from 'msw';

import { createApiResponse } from '../utils';

import { BASE_GATHERINGS } from './gatherings';

import type { GetMyLikesResponse } from '@/api/likes/types';

const MOCK_DELAY = 300;

const LIKED_GATHERINGS = BASE_GATHERINGS.slice(0, 9).map((g) => ({ ...g }));

const mockMyLikesResponse: GetMyLikesResponse = {
  gatherings: LIKED_GATHERINGS,
  totalCount: LIKED_GATHERINGS.length,
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

  /** GET v1/users/me/likes/ids — 내가 찜한 모임 ID 목록 */
  http.get('/api/v1/users/me/likes/ids', async () => {
    await delay(MOCK_DELAY);
    const ids = mockMyLikesResponse.gatherings.map((g) => g.id);
    return HttpResponse.json(createApiResponse(ids));
  }),

  /** GET v1/users/me/likes — 내 찜 목록 */
  http.get('/api/v1/users/me/likes', async () => {
    await delay(MOCK_DELAY);
    return HttpResponse.json(createApiResponse(mockMyLikesResponse));
  }),
];
