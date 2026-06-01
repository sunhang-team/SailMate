import { http, HttpResponse, delay } from 'msw';

import { createApiResponse } from '../utils';
import { CURRENT_USER, GATHERING_MEMBERS } from '../_data';

import type { ApiError } from '@/api/common/types';
import type {
  MembershipGathering,
  MyGatheringList,
  Member,
  GatheringMembersList,
  DeleteMember,
  GatheringStatus,
} from '@/api/memberships/types';

const CURRENT_USER_ID = CURRENT_USER.id;

const STATUS_FILTER_MAP: Record<string, GatheringStatus> = {
  recruiting: 'RECRUITING',
  in_progress: 'IN_PROGRESS',
  completed: 'COMPLETED',
};

// gatherings.ts BASE_GATHERINGS와 ID·title·dates를 일치시킨 "내 모임" 데이터.
// 리뷰 작성 흐름 테스트를 위해 id 7(독서 기록 앱, COMPLETED)을 포함.
const mockGatherings: MembershipGathering[] = [
  {
    id: 1,
    type: '스터디',
    categories: ['개발'],
    title: 'React 19 & Next.js 스터디',
    shortDescription: 'React 19의 새 기능과 Next.js App Router를 함께 파헤쳐요.',
    tags: ['React', 'Next.js', 'TypeScript'],
    maxMembers: 6,
    currentMembers: 4,
    startDate: '2026-06-20',
    endDate: '2026-08-15',
    status: 'RECRUITING',
    myRole: 'LEADER',
    hasReviewed: false,
    reviewedMembersCount: 0,
    pendingApplicationCount: 4,
  },
  {
    id: 2,
    type: '프로젝트',
    categories: ['개발'],
    title: 'SaaS 사이드 프로젝트 팀 모집',
    shortDescription: '구독형 SaaS 서비스를 함께 기획·개발해요.',
    tags: ['SaaS', 'React', 'Node.js'],
    maxMembers: 5,
    currentMembers: 4,
    startDate: '2026-07-05',
    endDate: '2026-11-30',
    status: 'RECRUITING',
    myRole: 'MEMBER',
    hasReviewed: false,
    reviewedMembersCount: 0,
    pendingApplicationCount: 2,
  },
  {
    id: 3,
    type: '스터디',
    categories: ['개발'],
    title: 'Spring Boot 심화 스터디',
    shortDescription: 'JPA, Redis, Kafka를 활용한 실전 백엔드 구축.',
    tags: ['Java', 'Spring', 'JPA'],
    maxMembers: 8,
    currentMembers: 7,
    startDate: '2026-05-05',
    endDate: '2026-08-05',
    status: 'IN_PROGRESS',
    myRole: 'MEMBER',
    hasReviewed: false,
    reviewedMembersCount: 0,
    pendingApplicationCount: 0,
  },
  {
    id: 4,
    type: '스터디',
    categories: ['어학'],
    title: '매일 영어 회화 30분 챌린지',
    shortDescription: '매일 30분씩 영어 프리토킹으로 스피킹 실력을 키워요.',
    tags: ['영어', '회화'],
    maxMembers: 8,
    currentMembers: 3, // GATHERING_MEMBERS[4].length와 일치
    startDate: '2026-06-15',
    endDate: '2026-09-15',
    status: 'RECRUITING',
    myRole: 'LEADER',
    hasReviewed: false,
    reviewedMembersCount: 0,
    pendingApplicationCount: 1,
  },
  {
    id: 7,
    type: '프로젝트',
    categories: ['독서'],
    title: '독서 기록 앱 만들기',
    shortDescription: '읽은 책을 기록하고 공유하는 앱을 직접 만들어 봐요.',
    tags: ['독서', '사이드프로젝트', 'Flutter'],
    maxMembers: 4,
    currentMembers: 4,
    startDate: '2026-04-01',
    endDate: '2026-05-15',
    status: 'COMPLETED',
    myRole: 'MEMBER',
    hasReviewed: false,
    reviewedMembersCount: 0,
    pendingApplicationCount: 0,
  },
];

// GATHERING_MEMBERS(공유 mock)를 Member 타입으로 변환해 노출.
// 단일 출처 보장 — gatherings/achievements 핸들러와 동일한 멤버 데이터를 사용한다.
const mockMembers: Record<number, Member[]> = Object.fromEntries(
  Object.entries(GATHERING_MEMBERS).map(([id, members]) => [Number(id), members as Member[]]),
);

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
