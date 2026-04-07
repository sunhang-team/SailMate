import { http, HttpResponse, delay } from 'msw';

import { createApiResponse } from '../utils';

import type {
  ApplicationListResponse,
  CreateApplicationResponse,
  UpdateApplicationStatusRequest,
  UpdateApplicationStatusResponse,
} from '@/api/applications/types';

const MOCK_DELAY = 300;

const mockApplicationListResponse: ApplicationListResponse = {
  applications: [
    {
      id: 1,
      applicant: {
        id: 1,
        nickname: '김선장',
        profileImage: 'https://example.com/profile.jpg',
        reputationScore: 36.5,
        reviewSummary: {
          reviewCount: 12,
          topTags: ['성실해요', '소통이 좋아요'],
        },
        recentReviews: [
          {
            id: 1,
            comment: '항상 열심히 참여해주셨어요!',
            tags: ['성실해요', '소통이 좋아요'],
          },
          {
            id: 2,
            comment: '시간 약속을 잘 지켜요',
            tags: ['시간을 잘 지켜요'],
          },
        ],
      },
      personalGoal: 'React 기초 완벽 이해',
      selfIntroduction: '안녕하세요! React 기초를 배우고 싶어서 신청했습니다. 잘 부탁드립니다.',
      status: 'PENDING', // 'PENDING' | 'ACCEPTED' | 'REJECTED'
      createdAt: '2026-03-24T18:24:00Z',
    },
  ],
};

export const applicationsHandlers = [
  /** POST v1/gatherings/:gatheringId/applications — 모임 참여 신청(신청자) */
  http.post(`/api/v1/gatherings/:gatheringId/applications`, async ({ request }) => {
    await delay(MOCK_DELAY);
    const responseData: CreateApplicationResponse = {
      application: {
        id: Date.now(),
        status: 'PENDING',
        createdAt: new Date().toISOString(),
      },
    };
    return HttpResponse.json(createApiResponse(responseData), { status: 201 });
  }),

  /** GET v1/gatherings/:gatheringId/applications — 신청 목록 조회(모임장) */
  http.get(`/api/v1/gatherings/:gatheringId/applications`, async () => {
    await delay(MOCK_DELAY);
    return HttpResponse.json(createApiResponse(mockApplicationListResponse));
  }),

  /** PATCH v1/gatherings/:gatheringId/applications/:applicationId — 신청 수락 / 거절(모임장) */
  http.patch(`/api/v1/gatherings/:gatheringId/applications/:applicationId`, async ({ request, params }) => {
    await delay(MOCK_DELAY);
    const body = (await request.json()) as UpdateApplicationStatusRequest;
    const applicationId = Number(params.applicationId);

    const targetApplication = mockApplicationListResponse.applications.find((app) => app.id === applicationId);

    if (targetApplication) {
      targetApplication.status = body.status;
    }

    const responseData: UpdateApplicationStatusResponse = {
      application: {
        id: applicationId,
        status: body.status,
      },
    };

    return HttpResponse.json(createApiResponse(responseData));
  }),

  /** DELETE v1/gatherings/:gatheringId/applications/:applicationId — 신청 취소(신청자 본인) */
  http.delete(`/api/v1/gatherings/:gatheringId/applications/:applicationId`, async ({ params }) => {
    await delay(MOCK_DELAY);
    const applicationId = Number(params.applicationId);

    const targetApplication = mockApplicationListResponse.applications.find((app) => app.id === applicationId);

    if (targetApplication) {
      mockApplicationListResponse.applications = mockApplicationListResponse.applications.filter(
        (app) => app.id !== applicationId,
      );
    }

    return HttpResponse.json(createApiResponse(mockApplicationListResponse));
  }),

  /** GET v1/users/me/applications — 내 신청 목록 조회(신청자) */
  http.get(`/api/v1/users/me/applications`, async () => {
    await delay(MOCK_DELAY);
    return HttpResponse.json(createApiResponse(mockApplicationListResponse));
  }),
];
