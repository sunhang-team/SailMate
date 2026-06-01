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
        id: 21,
        nickname: '박개발',
        profileImage: 'https://avatars.githubusercontent.com/u/21?v=4',
        reputationScore: 38.5,
        reviewSummary: {
          reviewCount: 12,
          topTags: ['성실해요', '소통이 좋아요'],
        },
        recentReviews: [
          { id: 1, comment: '항상 열심히 참여해주셨어요!', tags: ['성실해요', '소통이 좋아요'] },
          { id: 2, comment: '시간 약속을 잘 지켜요', tags: ['시간을 잘 지켜요'] },
        ],
      },
      personalGoal: 'React 19 새 기능 실전 적용',
      selfIntroduction:
        '안녕하세요! 그동안 React 18까지 사용했는데 19의 Compiler, Server Components를 실전 프로젝트에 녹여보고 싶어 신청합니다.',
      status: 'PENDING',
      createdAt: '2026-05-26T11:24:00Z',
    },
    {
      id: 2,
      applicant: {
        id: 22,
        nickname: '신입주니어',
        profileImage: 'https://avatars.githubusercontent.com/u/22?v=4',
        reputationScore: 32.0,
        reviewSummary: {
          reviewCount: 3,
          topTags: ['열정이 넘쳐요'],
        },
        recentReviews: [{ id: 3, comment: '학습 의지가 강했어요.', tags: ['열정이 넘쳐요'] }],
      },
      personalGoal: 'Next.js App Router 마스터',
      selfIntroduction:
        '프론트엔드 6개월차 신입입니다. 혼자 Next.js를 공부하다 한계를 느껴 동료들과 함께 깊이 있게 학습하고 싶습니다.',
      status: 'PENDING',
      createdAt: '2026-05-27T09:15:00Z',
    },
    {
      id: 3,
      applicant: {
        id: 23,
        nickname: '전직백엔드',
        profileImage: 'https://avatars.githubusercontent.com/u/23?v=4',
        reputationScore: 41.2,
        reviewSummary: {
          reviewCount: 18,
          topTags: ['잘 도와줘요', '다시 함께하고 싶어요'],
        },
        recentReviews: [
          { id: 4, comment: '문제 해결 능력이 뛰어났습니다.', tags: ['잘 도와줘요'] },
          { id: 5, comment: '다음 프로젝트도 같이하고 싶어요.', tags: ['다시 함께하고 싶어요'] },
        ],
      },
      personalGoal: '백엔드 → 풀스택 전환',
      selfIntroduction:
        '5년차 백엔드 개발자입니다. 프론트엔드까지 다룰 수 있는 풀스택으로 성장하기 위해 React 19를 본격적으로 배우고자 합니다.',
      status: 'PENDING',
      createdAt: '2026-05-27T18:42:00Z',
    },
    {
      id: 4,
      applicant: {
        id: 24,
        nickname: '디자이너지망',
        profileImage: 'https://avatars.githubusercontent.com/u/24?v=4',
        reputationScore: 29.8,
        reviewSummary: {
          reviewCount: 5,
          topTags: ['창의적이에요'],
        },
        recentReviews: [{ id: 6, comment: 'UI/UX 관점이 신선했습니다.', tags: ['창의적이에요'] }],
      },
      personalGoal: '디자인 시스템과 컴포넌트 설계 이해',
      selfIntroduction:
        '디자인 백그라운드에서 프론트 전향 중입니다. React 19와 함께 디자인 시스템을 구축하는 과정을 경험하고 싶습니다.',
      status: 'PENDING',
      createdAt: '2026-05-28T14:08:00Z',
    },
  ],
};

// user 1이 이미 멤버인 모임(1·2·3·4·7)은 제외하고, 아직 가입 안 한 모임에만 PENDING 신청을 둔다.
const mockMyApplicationListResponse: MyApplicationListResponse = {
  applications: [
    {
      id: 101,
      gathering: {
        id: 5,
        title: 'JLPT N2 집중 대비반',
        type: '스터디',
        status: 'RECRUITING',
      },
      personalGoal: '9월 시험 합격',
      status: 'PENDING',
      createdAt: '2026-05-26T18:24:00Z',
    },
    {
      id: 102,
      gathering: {
        id: 6,
        title: '한 달에 한 권 완독 모임',
        type: '스터디',
        status: 'RECRUITING',
      },
      personalGoal: '꾸준한 독서 습관 만들기',
      status: 'PENDING',
      createdAt: '2026-05-27T12:00:00Z',
    },
    {
      id: 103,
      gathering: {
        id: 9,
        title: 'SQLD 자격증 4주 완성',
        type: '스터디',
        status: 'RECRUITING',
      },
      personalGoal: 'SQL 기초 다지기',
      status: 'PENDING',
      createdAt: '2026-05-28T09:00:00Z',
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

    const targetApplication = mockMyApplicationListResponse.applications.find((app) => app.id === applicationId);

    if (targetApplication) {
      mockMyApplicationListResponse.applications = mockMyApplicationListResponse.applications.filter(
        (app) => app.id !== applicationId,
      );
    }

    return HttpResponse.json(createApiResponse(null));
  }),

  /** GET v1/users/me/applications — 내 신청 목록 조회(신청자) */
  http.get(`/api/v1/users/me/applications`, async () => {
    await delay(MOCK_DELAY);
    return HttpResponse.json(createApiResponse(mockMyApplicationListResponse));
  }),
];
