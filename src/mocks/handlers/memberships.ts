import { http, HttpResponse, delay } from 'msw';

import { createApiResponse } from '../utils';

import type { ApiError } from '@/api/common/types';
import type {
  MembershipGathering,
  MyGatheringList,
  Member,
  GatheringMembersList,
  DeleteMember,
  GatheringStatus,
} from '@/api/memberships/types';

const CURRENT_USER_ID = 1;

const STATUS_FILTER_MAP: Record<string, GatheringStatus> = {
  recruiting: 'RECRUITING',
  in_progress: 'IN_PROGRESS',
  completed: 'COMPLETED',
};

const mockGatherings: MembershipGathering[] = [
  {
    id: 1,
    type: '스터디',
    categories: ['개발'],
    title: 'React 완전 정복 스터디',
    shortDescription: '리액트 공식문서를 같이 읽어요',
    tags: ['React', '프론트엔드'],
    maxMembers: 6,
    currentMembers: 3,
    startDate: '2025-03-22',
    endDate: '2025-04-19',
    status: 'IN_PROGRESS',
    myRole: 'LEADER',
    isLiked: false,
  },
  {
    id: 2,
    type: '프로젝트',
    categories: ['개발'],
    title: '사이드 프로젝트 팀원 모집',
    shortDescription: 'Spring Boot 기반 협업 프로젝트',
    tags: ['Spring', '백엔드'],
    maxMembers: 5,
    currentMembers: 4,
    startDate: '2025-04-01',
    endDate: '2025-05-30',
    status: 'RECRUITING',
    myRole: 'MEMBER',
    isLiked: false,
  },
  {
    id: 3,
    type: '스터디',
    categories: ['디자인'],
    title: 'Figma 마스터 클래스',
    shortDescription: 'Figma 기초부터 실전까지',
    tags: ['Figma', 'UI/UX'],
    maxMembers: 8,
    currentMembers: 8,
    startDate: '2025-01-10',
    endDate: '2025-02-28',
    status: 'COMPLETED',
    myRole: 'MEMBER',
    isLiked: false,
  },
  {
    id: 4,
    type: '스터디',
    categories: ['개발'],
    title: 'React 완전 정복 스터디',
    shortDescription: '리액트 공식문서를 같이 읽어요',
    tags: ['React', '프론트엔드'],
    maxMembers: 6,
    currentMembers: 3,
    startDate: '2025-03-22',
    endDate: '2025-04-19',
    status: 'RECRUITING',
    myRole: 'MEMBER',
    isLiked: false,
  },
  {
    id: 5,
    type: '스터디',
    categories: ['개발'],
    title: 'React 완전 정복 스터디',
    shortDescription: '리액트 공식문서를 같이 읽어요',
    tags: ['React', '프론트엔드'],
    maxMembers: 6,
    currentMembers: 3,
    startDate: '2025-03-22',
    endDate: '2025-04-19',
    status: 'RECRUITING',
    myRole: 'MEMBER',
    isLiked: false,
  },
  {
    id: 6,
    type: '스터디',
    categories: ['개발'],
    title: 'React 완전 정복 스터디',
    shortDescription: '리액트 공식문서를 같이 읽어요',
    tags: ['React', '프론트엔드'],
    maxMembers: 6,
    currentMembers: 3,
    startDate: '2025-03-22',
    endDate: '2025-04-19',
    status: 'RECRUITING',
    myRole: 'MEMBER',
    isLiked: false,
  },
  {
    id: 7,
    type: '스터디',
    categories: ['개발'],
    title: 'React 완전 정복 스터디',
    shortDescription: '리액트 공식문서를 같이 읽어요',
    tags: ['React', '프론트엔드'],
    maxMembers: 6,
    currentMembers: 3,
    startDate: '2025-03-22',
    endDate: '2025-04-19',
    status: 'RECRUITING',
    myRole: 'MEMBER',
    isLiked: false,
  },
  {
    id: 8,
    type: '스터디',
    categories: ['개발'],
    title: 'React 완전 정복 스터디',
    shortDescription: '리액트 공식문서를 같이 읽어요',
    tags: ['React', '프론트엔드'],
    maxMembers: 6,
    currentMembers: 3,
    startDate: '2025-03-22',
    endDate: '2025-04-19',
    status: 'RECRUITING',
    myRole: 'MEMBER',
    isLiked: false,
  },
];

const mockMembers: Record<number, Member[]> = {
  1: [
    {
      userId: 1,
      nickname: '마감왕',
      profileImage: 'https://picsum.photos/seed/user1/200',
      role: 'LEADER',
      overallAchievementRate: 85.0,
      isActive: true,
    },
    {
      userId: 2,
      nickname: '이개발',
      profileImage: 'https://picsum.photos/seed/user2/200',
      role: 'MEMBER',
      overallAchievementRate: 72.5,
      isActive: true,
    },
    {
      userId: 3,
      nickname: '박디자인',
      profileImage: 'https://picsum.photos/seed/user3/200',
      role: 'MEMBER',
      overallAchievementRate: 90.0,
      isActive: true,
    },
  ],
  2: [
    {
      userId: 4,
      nickname: '최백엔드',
      profileImage: 'https://picsum.photos/seed/user4/200',
      role: 'LEADER',
      overallAchievementRate: 88.0,
      isActive: true,
    },
    {
      userId: 1,
      nickname: '마감왕',
      profileImage: 'https://picsum.photos/seed/user1/200',
      role: 'MEMBER',
      overallAchievementRate: 65.0,
      isActive: true,
    },
    {
      userId: 5,
      nickname: '마감왕',
      profileImage: 'https://picsum.photos/seed/user1/200',
      role: 'MEMBER',
      overallAchievementRate: 65.0,
      isActive: true,
    },
    {
      userId: 6,
      nickname: '마감왕',
      profileImage: 'https://picsum.photos/seed/user1/200',
      role: 'MEMBER',
      overallAchievementRate: 65.0,
      isActive: true,
    },
    {
      userId: 7,
      nickname: '마감왕',
      profileImage: 'https://picsum.photos/seed/user1/200',
      role: 'MEMBER',
      overallAchievementRate: 65.0,
      isActive: true,
    },
    {
      userId: 8,
      nickname: '모임원8',
      profileImage: 'https://picsum.photos/seed/user8/200',
      role: 'MEMBER',
      overallAchievementRate: 65.0,
      isActive: true,
    },
    {
      userId: 9,
      nickname: '모임원9',
      profileImage: 'https://picsum.photos/seed/user9/200',
      role: 'MEMBER',
      overallAchievementRate: 70.0,
      isActive: true,
    },
    {
      userId: 10,
      nickname: '모임원10',
      profileImage: 'https://picsum.photos/seed/user10/200',
      role: 'MEMBER',
      overallAchievementRate: 40.0,
      isActive: true,
    },
    {
      userId: 11,
      nickname: '모임원11',
      profileImage: 'https://picsum.photos/seed/user11/200',
      role: 'MEMBER',
      overallAchievementRate: 80.0,
      isActive: true,
    },
    {
      userId: 12,
      nickname: '모임원12',
      profileImage: 'https://picsum.photos/seed/user12/200',
      role: 'MEMBER',
      overallAchievementRate: 90.0,
      isActive: true,
    },
    {
      userId: 13,
      nickname: '모임원13',
      profileImage: 'https://picsum.photos/seed/user13/200',
      role: 'MEMBER',
      overallAchievementRate: 55.0,
      isActive: true,
    },
    {
      userId: 14,
      nickname: '모임원14',
      profileImage: 'https://picsum.photos/seed/user14/200',
      role: 'MEMBER',
      overallAchievementRate: 75.0,
      isActive: true,
    },
    {
      userId: 15,
      nickname: '모임원15',
      profileImage: 'https://picsum.photos/seed/user15/200',
      role: 'MEMBER',
      overallAchievementRate: 85.0,
      isActive: true,
    },
  ],
};

const MEMBERS_BASE = '/api/v1/gatherings/:gatheringId/members';

export const membershipsHandlers = [
  /** GET /api/v1/users/me/gatherings — 내 모임 목록 */
  http.get('/api/v1/users/me/gatherings', async ({ request }) => {
    await delay(300);

    const url = new URL(request.url);
    const status = url.searchParams.get('status') ?? 'all';
    const page = Number(url.searchParams.get('page') ?? '1');
    const limit = Number(url.searchParams.get('limit') ?? '12');

    const filtered =
      status === 'all' ? mockGatherings : mockGatherings.filter((g) => g.status === STATUS_FILTER_MAP[status]);

    const totalCount = filtered.length;
    const totalPages = Math.max(1, Math.ceil(totalCount / limit));
    const start = (page - 1) * limit;
    const paged = filtered.slice(start, start + limit);

    return HttpResponse.json(
      createApiResponse<MyGatheringList>({
        gatherings: paged,
        totalCount,
        totalPages,
        currentPage: page,
      }),
    );
  }),

  /** GET /api/v1/gatherings/:gatheringId/members — 모임 멤버 목록 */
  http.get(MEMBERS_BASE, async ({ params }) => {
    await delay(300);

    const gatheringId = Number(params.gatheringId);
    const members = mockMembers[gatheringId] ?? [];

    return HttpResponse.json(createApiResponse<GatheringMembersList>({ members }));
  }),

  /** DELETE /api/v1/gatherings/:gatheringId/members/me — 모임 탈퇴 (본인) */
  http.delete(`${MEMBERS_BASE}/me`, async () => {
    await delay(200);

    return HttpResponse.json(createApiResponse<DeleteMember>({ success: true }));
  }),

  /** DELETE /api/v1/gatherings/:gatheringId/members/:userId — 멤버 강퇴 (모임장 전용) */
  http.delete(`${MEMBERS_BASE}/:userId`, async ({ params }) => {
    await delay(200);

    const userId = Number(params.userId);

    if (userId === CURRENT_USER_ID) {
      return HttpResponse.json(
        {
          success: false,
          data: null,
          message: '모임장 본인은 퇴출할 수 없습니다.',
          errorCode: 'CANNOT_REMOVE_LEADER',
        } satisfies ApiError,
        { status: 400 },
      );
    }

    return HttpResponse.json(createApiResponse<DeleteMember>({ success: true }));
  }),
];
