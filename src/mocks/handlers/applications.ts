import { http, HttpResponse, delay } from 'msw';

import { createApiResponse } from '../utils';

import type {
  ApplicationListResponse,
  CreateApplicationResponse,
  MyApplicationListResponse,
  UpdateApplicationStatusRequest,
  UpdateApplicationStatusResponse,
} from '@/api/applications/types';

const MOCK_DELAY = 300;

const mockApplicationListResponse: ApplicationListResponse = {
  applications: [
    {
      id: 1,
      applicant: {
        id: 20,
        nickname: '이수정',
        profileImage: 'https://avatars.githubusercontent.com/u/20?v=4',
        reputationScore: 70,
        reviewSummary: {
          reviewCount: 12,
          topTags: ['불꽃 메이트', '소통이 좋아요'],
        },
        recentReviews: [{ id: 1, comment: '항상 열심히 참여해주셨어요!', tags: ['성실해요', '소통이 좋아요'] }],
      },
      personalGoal: '비전공생으로 피그마 기초를 마스터하는 걸 목표로 합니다.',
      selfIntroduction: '디자인 분야로 직무 전환을 준비하는 취업 준비생입니다. 열심히 활동하겠습니다.',
      status: 'PENDING',
      createdAt: '2026-03-24T18:24:00Z',
    },
    {
      id: 2,
      applicant: {
        id: 21,
        nickname: '김민수',
        profileImage: 'https://avatars.githubusercontent.com/u/21?v=4',
        reputationScore: 80,
        reviewSummary: {
          reviewCount: 8,
          topTags: ['불꽃 메이트'],
        },
        recentReviews: [{ id: 3, comment: '시간 약속을 잘 지켜요', tags: ['시간을 잘 지켜요'] }],
      },
      personalGoal: 'UI/UX 디자인 포트폴리오를 완성하고 싶습니다.',
      selfIntroduction: '현직 프론트엔드 개발자이고, 디자인 역량을 키우고 싶어서 신청합니다.',
      status: 'PENDING',
      createdAt: '2026-03-25T10:00:00Z',
    },
    {
      id: 3,
      applicant: {
        id: 22,
        nickname: '박지영',
        profileImage: 'https://avatars.githubusercontent.com/u/22?v=4',
        reputationScore: 55,
        reviewSummary: {
          reviewCount: 5,
          topTags: ['성실해요'],
        },
        recentReviews: [],
      },
      personalGoal: '피그마 기본 기능을 익혀서 실무에 바로 적용하고 싶습니다.',
      status: 'PENDING',
      createdAt: '2026-03-25T14:30:00Z',
    },
    {
      id: 4,
      applicant: {
        id: 23,
        nickname: '최현우',
        profileImage: 'https://avatars.githubusercontent.com/u/23?v=4',
        reputationScore: 92,
        reviewSummary: {
          reviewCount: 20,
          topTags: ['불꽃 메이트', '잘 도와줘요'],
        },
        recentReviews: [{ id: 4, comment: '덕분에 많이 배웠습니다.', tags: ['잘 도와줘요', '다시 함께하고 싶어요'] }],
      },
      personalGoal: '디자인 시스템 구축 경험을 쌓고 싶습니다.',
      selfIntroduction: 'IT 스타트업에서 PM으로 일하고 있습니다.',
      status: 'PENDING',
      createdAt: '2026-03-26T09:15:00Z',
    },
    {
      id: 5,
      applicant: {
        id: 24,
        nickname: '정다은',
        profileImage: 'https://avatars.githubusercontent.com/u/24?v=4',
        reputationScore: 45,
        reviewSummary: {
          reviewCount: 3,
          topTags: ['소통이 좋아요'],
        },
        recentReviews: [],
      },
      personalGoal: '웹 디자인 기초부터 차근차근 배우고 싶어요.',
      selfIntroduction: '디자인 전공 대학생입니다.',
      status: 'PENDING',
      createdAt: '2026-03-26T16:00:00Z',
    },
    {
      id: 6,
      applicant: {
        id: 25,
        nickname: '한승민',
        profileImage: 'https://avatars.githubusercontent.com/u/25?v=4',
        reputationScore: 63,
        reviewSummary: {
          reviewCount: 7,
          topTags: ['시간을 잘 지켜요'],
        },
        recentReviews: [],
      },
      personalGoal: '피그마 플러그인 개발까지 도전해보고 싶습니다.',
      status: 'PENDING',
      createdAt: '2026-03-27T11:45:00Z',
    },
    {
      id: 7,
      applicant: {
        id: 26,
        nickname: '윤서아',
        profileImage: '',
        reputationScore: 38,
        reviewSummary: {
          reviewCount: 2,
          topTags: ['성실해요'],
        },
        recentReviews: [],
      },
      personalGoal: '협업 도구로서의 피그마 활용법을 배우고 싶습니다.',
      selfIntroduction: '백엔드 개발자인데 디자이너와 소통을 잘 하고 싶어서 신청합니다.',
      status: 'PENDING',
      createdAt: '2026-03-28T08:30:00Z',
    },
    {
      id: 8,
      applicant: {
        id: 27,
        nickname: '송태호',
        profileImage: 'https://avatars.githubusercontent.com/u/27?v=4',
        reputationScore: 75,
        reviewSummary: {
          reviewCount: 15,
          topTags: ['불꽃 메이트', '성실해요'],
        },
        recentReviews: [{ id: 5, comment: '리더십이 좋아요!', tags: ['성실해요', '잘 도와줘요'] }],
      },
      personalGoal: '디자인 툴 숙련도를 높여서 1인 개발에 활용하고 싶습니다.',
      status: 'PENDING',
      createdAt: '2026-03-28T20:00:00Z',
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
    const myApplicationListResponse: MyApplicationListResponse = {
      applications: [
        {
          id: 101,
          gathering: {
            id: 1,
            title: '피그마 기초 스터디',
            type: 'STUDY',
            status: 'RECRUITING',
          },
          personalGoal: 'React 기초 완벽 이해',
          status: 'PENDING',
          createdAt: '2026-03-24T18:24:00Z',
        },
      ],
    };
    return HttpResponse.json(createApiResponse(myApplicationListResponse));
  }),
];
