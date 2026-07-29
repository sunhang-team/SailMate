import { http, HttpResponse, delay } from 'msw';

import { gatheringFormBaseSchema } from '@/api/gatherings/schemas';
import { getTotalWeeks } from '@/lib/formatGatheringDate';
import { createApiResponse } from '../utils';
import { CURRENT_USER, GATHERING_MEMBERS } from '../_data';

import type {
  Category,
  GatheringListItem,
  GatheringDetail,
  GetCategoriesResponse,
  GetGatheringsResponse,
  GetMainGatheringsResponse,
  CreateGatheringResponse,
  UpdateGatheringResponse,
} from '@/api/gatherings/types';

// 실제 API는 FormData(multipart)로 요청을 받음
// FormData 내 'request' blob에서 JSON을 추출하는 헬퍼
const parseFormDataRequest = async (request: Request): Promise<unknown> => {
  const contentType = request.headers.get('content-type') ?? '';

  if (contentType.includes('multipart/form-data')) {
    const formData = await request.formData();
    const requestBlob = formData.get('request');
    if (requestBlob instanceof Blob) {
      return JSON.parse(await requestBlob.text());
    }
    return {};
  }

  // fallback: JSON body (테스트 등에서 직접 JSON 전송 시)
  return request.json();
};

import { z } from 'zod';

import type { GatheringType } from '@/api/gatherings/types';

// API 함수에서 type이 한글 → 영어(STUDY/PROJECT)로 변환된 후 전송되므로
// MSW 스키마에서도 영어 enum을 허용
const createBodySchema = gatheringFormBaseSchema
  .omit({ images: true })
  .extend({ type: z.enum(['STUDY', 'PROJECT', '스터디', '프로젝트']) });
const updateBodySchema = gatheringFormBaseSchema
  .partial()
  .omit({ images: true })
  .extend({ type: z.enum(['STUDY', 'PROJECT', '스터디', '프로젝트']).optional() });

const PARAM_TO_TYPE: Record<string, GatheringType> = {
  STUDY: '스터디',
  PROJECT: '프로젝트',
  스터디: '스터디',
  프로젝트: '프로젝트',
};

// ─── 목 데이터 ────────────────────────────────────────────────────────────────

// 카테고리 목록 (GET /api/v1/gatherings/categories 응답)
const MOCK_CATEGORIES: Category[] = [
  { id: 7, name: '개발' },
  { id: 8, name: '어학' },
  { id: 9, name: '독서' },
  { id: 10, name: '자격증' },
  { id: 11, name: '디자인' },
];

// 카테고리: DEVELOPMENT, LANGUAGE, BOOK, CERTIFICATE / 유형: STUDY, PROJECT
export const BASE_GATHERINGS: GatheringListItem[] = [
  // ── DEVELOPMENT ──
  {
    id: 1,
    type: '스터디',
    categories: ['개발'],
    title: 'React 19 & Next.js 스터디',
    shortDescription: 'React 19의 새 기능과 Next.js App Router를 함께 파헤쳐요.',
    tags: ['React', 'Next.js', 'TypeScript'],
    maxMembers: 6,
    currentMembers: 4,
    recruitDeadline: '2026-06-15',
    startDate: '2026-06-20',
    endDate: '2026-08-15',
    status: 'RECRUITING',
    leader: { id: 1, nickname: '테스터', profileImage: 'https://avatars.githubusercontent.com/u/1?v=4' },
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
    recruitDeadline: '2026-06-25',
    startDate: '2026-07-05',
    endDate: '2026-11-30',
    status: 'RECRUITING',
    leader: { id: 5, nickname: '박프로', profileImage: 'https://avatars.githubusercontent.com/u/5?v=4' },
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
    recruitDeadline: '2026-04-30',
    startDate: '2026-05-05',
    endDate: '2026-08-05',
    status: 'IN_PROGRESS',
    leader: { id: 3, nickname: '이개발', profileImage: 'https://avatars.githubusercontent.com/u/3?v=4' },
  },
  // ── LANGUAGE ──
  {
    id: 4,
    type: '스터디',
    categories: ['어학'],
    title: '매일 영어 회화 30분 챌린지',
    shortDescription: '매일 30분씩 영어 프리토킹으로 스피킹 실력을 키워요.',
    tags: ['영어', '회화', '스피킹'],
    maxMembers: 8,
    currentMembers: 3,
    recruitDeadline: '2026-06-10',
    startDate: '2026-06-15',
    endDate: '2026-09-15',
    status: 'RECRUITING',
    leader: { id: 1, nickname: '테스터', profileImage: 'https://avatars.githubusercontent.com/u/1?v=4' },
  },
  {
    id: 5,
    type: '스터디',
    categories: ['어학'],
    title: 'JLPT N2 집중 대비반',
    shortDescription: '9월 시험 목표! 문법·독해·청해를 체계적으로 준비합니다.',
    tags: ['일본어', 'JLPT', 'N2'],
    maxMembers: 6,
    currentMembers: 3,
    recruitDeadline: '2026-06-30',
    startDate: '2026-07-07',
    endDate: '2026-09-30',
    status: 'RECRUITING',
    leader: { id: 30, nickname: '일본어마스터', profileImage: 'https://avatars.githubusercontent.com/u/30?v=4' },
  },
  // ── BOOK ──
  {
    id: 6,
    type: '스터디',
    categories: ['독서'],
    title: '한 달에 한 권 완독 모임',
    shortDescription: '매달 한 권을 선정해 함께 읽고 토론해요.',
    tags: ['독서', '토론', '인문'],
    maxMembers: 10,
    currentMembers: 7,
    recruitDeadline: '2026-06-05',
    startDate: '2026-06-12',
    endDate: '2026-12-12',
    status: 'RECRUITING',
    leader: { id: 20, nickname: '책리더', profileImage: 'https://avatars.githubusercontent.com/u/20?v=4' },
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
    recruitDeadline: '2026-03-25',
    startDate: '2026-04-01',
    endDate: '2026-05-15',
    status: 'COMPLETED',
    leader: { id: 6, nickname: '책벌레', profileImage: 'https://avatars.githubusercontent.com/u/6?v=4' },
  },
  // ── CERTIFICATE ──
  {
    id: 8,
    type: '스터디',
    categories: ['자격증'],
    title: '정보처리기사 실기 스터디',
    shortDescription: '기출 분석 + 모의고사로 실기 합격을 목표로 합니다.',
    tags: ['정보처리기사', '자격증', '실기'],
    maxMembers: 8,
    currentMembers: 6,
    recruitDeadline: '2026-06-12',
    startDate: '2026-06-20',
    endDate: '2026-08-20',
    status: 'RECRUITING',
    leader: { id: 31, nickname: '합격러', profileImage: 'https://avatars.githubusercontent.com/u/31?v=4' },
  },
  {
    id: 9,
    type: '스터디',
    categories: ['자격증'],
    title: 'SQLD 자격증 4주 완성',
    shortDescription: 'SQL 기초부터 시험 대비까지 4주 만에 끝내요.',
    tags: ['SQLD', 'SQL', '데이터베이스'],
    maxMembers: 6,
    currentMembers: 1,
    recruitDeadline: '2026-07-05',
    startDate: '2026-07-15',
    endDate: '2026-08-12',
    status: 'RECRUITING',
    leader: { id: 32, nickname: 'DB러버', profileImage: 'https://avatars.githubusercontent.com/u/32?v=4' },
  },
  {
    id: 10,
    type: '스터디',
    categories: ['자격증'],
    title: 'TOEIC 900+ 달성 스터디',
    shortDescription: '파트별 전략 학습으로 900점 이상을 목표로 합니다.',
    tags: ['TOEIC', '영어', '자격증'],
    maxMembers: 10,
    currentMembers: 9,
    recruitDeadline: '2026-06-03',
    startDate: '2026-06-10',
    endDate: '2026-08-10',
    status: 'RECRUITING',
    leader: { id: 33, nickname: '토익900', profileImage: 'https://avatars.githubusercontent.com/u/33?v=4' },
  },
];

// 페이지네이션 테스트를 위해 기본 10개 × 3 = 30개로 확장.
// round 0(원본 ID)는 BASE_GATHERINGS 값 그대로 유지 → 공유 데이터(GATHERING_MEMBERS)와 멤버 수 일치.
// round 1·2(2기·3기 복제본)는 정원 풀 회피를 위해 cap 적용.
const generateMockGatherings = (): GatheringListItem[] => {
  const result: GatheringListItem[] = [];
  for (let round = 0; round < 3; round++) {
    for (const base of BASE_GATHERINGS) {
      const currentMembers =
        round === 0
          ? base.currentMembers
          : Math.max(1, Math.min(base.maxMembers - 1, (base.currentMembers + round) % base.maxMembers));
      result.push({
        ...base,
        id: round * BASE_GATHERINGS.length + base.id,
        title: round === 0 ? base.title : `${base.title} (${round + 1}기)`,
        currentMembers,
      });
    }
  }
  return result;
};

let mockGatherings: GatheringListItem[] = generateMockGatherings();

const mockDetails: Record<number, GatheringDetail> = {
  1: {
    ...mockGatherings[0],
    description:
      'React 19의 새로운 훅과 Server Components, 그리고 Next.js 15 App Router의 심화 기능을 학습합니다. 매주 정해진 분량을 공부하고 발표하는 방식으로 진행합니다.',
    goal: '8주 후 React 19 + Next.js 15 기반의 풀스택 프로젝트 완성',
    totalWeeks: 8,
    images: [
      { url: 'https://placehold.co/800x500/0984e3/ffffff?text=React+1', displayOrder: 0 },
      { url: 'https://placehold.co/800x500/6c5ce7/ffffff?text=React+2', displayOrder: 1 },
      { url: 'https://placehold.co/800x500/00b894/ffffff?text=React+3', displayOrder: 2 },
      { url: 'https://placehold.co/800x500/fdcb6e/333333?text=React+4', displayOrder: 3 },
      { url: 'https://placehold.co/800x500/e17055/ffffff?text=React+5', displayOrder: 4 },
      { url: 'https://placehold.co/800x500/a29bfe/ffffff?text=React+6', displayOrder: 5 },
      { url: 'https://placehold.co/800x500/55efc4/333333?text=React+7', displayOrder: 6 },
      { url: 'https://placehold.co/800x500/74b9ff/333333?text=React+8', displayOrder: 7 },
      { url: 'https://placehold.co/800x500/fab1a0/333333?text=React+9', displayOrder: 8 },
      { url: 'https://placehold.co/800x500/81ecec/333333?text=React+10', displayOrder: 9 },
    ],
    // gathering startDate(2026-06-20) 기준 8주 분량
    weeklyPlans: [
      {
        week: 1,
        title: 'React 19 개요 & useTransition',
        startDate: '2026-06-20',
        endDate: '2026-06-26',
        details: ['React 19 공식문서 읽기', 'useTransition 실습'],
      },
      {
        week: 2,
        title: 'Server Components & Actions',
        startDate: '2026-06-27',
        endDate: '2026-07-03',
        details: ['Server Components 개념 정리'],
      },
      { week: 3, title: 'Next.js App Router 심화', startDate: '2026-07-04', endDate: '2026-07-10', details: [] },
      {
        week: 4,
        title: 'Data Fetching 패턴',
        startDate: '2026-07-11',
        endDate: '2026-07-17',
        details: ['TanStack Query 패턴 비교', 'SWR vs React Query'],
      },
      { week: 5, title: 'TanStack Query 연동', startDate: '2026-07-18', endDate: '2026-07-24', details: [] },
      { week: 6, title: '인증 & 미들웨어', startDate: '2026-07-25', endDate: '2026-07-31', details: [] },
      { week: 7, title: '배포 & CI/CD', startDate: '2026-08-01', endDate: '2026-08-07', details: [] },
      { week: 8, title: '최종 프로젝트 발표', startDate: '2026-08-08', endDate: '2026-08-15', details: [] },
    ],
    // GATHERING_MEMBERS[1]과 동기화 (테스터/이개발/박디자인/최풀스택)
    members: GATHERING_MEMBERS[1].map((m) => ({
      userId: m.userId,
      nickname: m.nickname,
      profileImage: m.profileImage,
      role: m.role,
    })),
    myApplicationStatus: null,
  },
  // id 8(정보처리기사)은 mockDetails 미정의 → 핸들러 auto-gen으로 BASE_GATHERINGS와 일관되게 처리.
};

// ─── 헬퍼 ─────────────────────────────────────────────────────────────────────

/**
 * URL 쿼리스트링을 읽어 목록을 필터링 + 정렬한다.
 * - 필터: type, categoryIds, status (ALL이면 스킵), query (제목·짧은설명 부분 검색)
 * - 정렬: popular(참여자 많은 순) | deadline(마감 임박 순) | 기본값(id 내림차순 = 최신순)
 * - 얕은 복사본에서 작업하므로 mockGatherings 원본은 변경되지 않는다.
 */
const applyFilters = (list: GatheringListItem[], url: URL): GatheringListItem[] => {
  // 클라이언트는 GATHERING_TYPE_TO_PARAM으로 'STUDY'/'PROJECT' 영문을 보내지만
  // mockGatherings의 type 필드는 '스터디'/'프로젝트' 한글이라 그대로 비교하면 항상 false.
  // 영문 ↔ 한글 매핑으로 정규화.
  const typeParam = url.searchParams.get('type');
  const type =
    typeParam === 'STUDY'
      ? '스터디'
      : typeParam === 'PROJECT'
        ? '프로젝트'
        : (typeParam as GatheringListItem['type'] | null);
  const categoryIds = url.searchParams.getAll('categoryIds').map(Number).filter(Boolean);
  const sort = url.searchParams.get('sort') as 'latest' | 'popular' | 'deadline' | null;
  const status = url.searchParams.get('status') as GatheringListItem['status'] | 'ALL' | null;
  const query = url.searchParams.get('query');

  let result = [...list]; // 얕은 복사 → filter/sort가 mockGatherings 원본을 변경하지 않음

  if (type) result = result.filter((g) => g.type === type);
  // categoryIds 필터링: BASE_GATHERINGS의 categoryIds는 명시되어 있지 않으니
  // categories(한글 라벨) 기반으로 매핑. MOCK_CATEGORIES의 id ↔ name 매핑 활용.
  if (categoryIds.length > 0) {
    const selectedNames = new Set(
      categoryIds.map((cid) => MOCK_CATEGORIES.find((c) => c.id === cid)?.name).filter(Boolean) as string[],
    );
    if (selectedNames.size > 0) {
      result = result.filter((g) => g.categories.some((c) => selectedNames.has(c)));
    }
  }
  if (status && status !== 'ALL') result = result.filter((g) => g.status === status);
  if (query) {
    const q = query.toLowerCase();
    result = result.filter((g) => g.title.toLowerCase().includes(q) || g.shortDescription.toLowerCase().includes(q));
  }

  if (sort === 'popular') result.sort((a, b) => b.currentMembers - a.currentMembers);
  else if (sort === 'deadline')
    result.sort((a, b) => new Date(a.recruitDeadline).getTime() - new Date(b.recruitDeadline).getTime());
  else result.sort((a, b) => b.id - a.id); // latest

  return result;
};

/**
 * 필터링된 목록을 페이지 단위로 잘라 GetGatheringsResponse 형태로 반환한다.
 * - page: 기본 1, 최소 1
 * - limit: 기본 10, 최소 1 ~ 최대 50
 * - slice 공식: (page-1)*limit ~ page*limit
 */
const paginate = (list: GatheringListItem[], url: URL) => {
  const page = Math.max(1, Number(url.searchParams.get('page') ?? 1));
  const limit = Math.min(50, Math.max(1, Number(url.searchParams.get('limit') ?? 10)));
  const total = list.length;
  const sliced = list.slice((page - 1) * limit, page * limit);

  return {
    gatherings: sliced,
    totalCount: total,
    totalPages: Math.ceil(total / limit),
    currentPage: page,
  };
};

// ─── 핸들러 ───────────────────────────────────────────────────────────────────

const BASE = '/api/v1/gatherings';

export const gatheringsHandlers = [
  /** GET /api/v1/gatherings/categories — 카테고리 목록 */
  http.get(`${BASE}/categories`, async () => {
    await delay(200);
    return HttpResponse.json(createApiResponse<GetCategoriesResponse>({ categories: MOCK_CATEGORIES }));
  }),

  /** GET /api/v1/gatherings/:gatheringId/application-status — 모임 신청 상태 */
  http.get(`${BASE}/:gatheringId/application-status`, async () => {
    await delay(200);
    return HttpResponse.json(createApiResponse({ myApplicationStatus: null }));
  }),

  /** GET /api/v1/gatherings/main — 메인 페이지 모임 목록 */
  http.get(`${BASE}/main`, async ({ request }) => {
    await delay(300);

    const url = new URL(request.url);
    const limit = Math.max(1, Number(url.searchParams.get('limit') ?? 4));

    const popular = [...mockGatherings].sort((a, b) => b.currentMembers - a.currentMembers).slice(0, limit);

    const deadline = [...mockGatherings]
      .filter((g) => g.status === 'RECRUITING')
      .sort((a, b) => new Date(a.recruitDeadline).getTime() - new Date(b.recruitDeadline).getTime())
      .slice(0, limit);

    const latest = [...mockGatherings].sort((a, b) => b.id - a.id).slice(0, limit);

    return HttpResponse.json(createApiResponse<GetMainGatheringsResponse>({ popular, deadline, latest }));
  }),

  /** GET /api/v1/gatherings — 모임 목록 검색 + 필터링 + 페이지네이션 */
  http.get(BASE, async ({ request }) => {
    await delay(300);

    const url = new URL(request.url);
    const filtered = applyFilters(mockGatherings, url);
    const result = paginate(filtered, url);

    return HttpResponse.json(createApiResponse<GetGatheringsResponse>(result));
  }),

  /** GET /api/v1/gatherings/:gatheringId — 모임 상세 */
  http.get(`${BASE}/:gatheringId`, async ({ params }) => {
    await delay(300);

    const gatheringId = Number(params.gatheringId);
    const detail = mockDetails[gatheringId];

    if (!detail) {
      // mockDetails에 상세 데이터가 없으면 mockGatherings 기반으로 최소 상세를 즉석 생성
      const base = mockGatherings.find((g) => g.id === gatheringId);
      if (!base)
        return HttpResponse.json({ success: false, data: null, message: '모임을 찾을 수 없습니다.' }, { status: 404 });

      // 공유 mock(GATHERING_MEMBERS)에 멤버가 있으면 그걸 사용, 없으면 leader 1명만
      const sharedMembers = GATHERING_MEMBERS[gatheringId];
      const members = sharedMembers
        ? sharedMembers.map((m) => ({
            userId: m.userId,
            nickname: m.nickname,
            profileImage: m.profileImage,
            role: m.role,
          }))
        : [
            {
              userId: base.leader.id,
              nickname: base.leader.nickname,
              profileImage: base.leader.profileImage,
              role: 'LEADER' as const,
            },
          ];

      const generated: GatheringDetail = {
        ...base,
        description: `${base.title} 모임입니다.`,
        goal: '목표를 함께 달성해요.',
        totalWeeks: 8,
        images: [],
        weeklyPlans: [],
        members,
        myApplicationStatus: null,
      };
      return HttpResponse.json(createApiResponse(generated));
    }

    return HttpResponse.json(createApiResponse(detail));
  }),

  /** POST /api/v1/gatherings — 모임 생성 */
  http.post(BASE, async ({ request }) => {
    await delay(300);

    const parsed = createBodySchema.safeParse(await parseFormDataRequest(request));
    if (!parsed.success)
      return HttpResponse.json({ success: false, data: null, message: '잘못된 요청입니다.' }, { status: 400 });
    const body = parsed.data;
    const newGathering: GatheringListItem = {
      id: Date.now(),
      type: PARAM_TO_TYPE[body.type] ?? '스터디',
      categories: body.categoryIds.map((id: number) => {
        // MOCK_CATEGORIES와 동일한 ID 매핑 (7~11). lookup 실패 시 MOCK_CATEGORIES에서 직접 찾기.
        return MOCK_CATEGORIES.find((c) => c.id === id)?.name ?? `카테고리${id}`;
      }),
      title: body.title,
      shortDescription: body.shortDescription,
      tags: body.tags ?? [],
      maxMembers: body.maxMembers,
      currentMembers: 1,
      recruitDeadline: body.recruitDeadline,
      startDate: body.startDate,
      endDate: body.endDate,
      status: 'RECRUITING',
      leader: { id: CURRENT_USER.id, nickname: CURRENT_USER.nickname, profileImage: CURRENT_USER.profileImage },
    };

    const detail: GatheringDetail = {
      ...newGathering,
      description: body.description,
      goal: body.goal,
      totalWeeks: getTotalWeeks(body.startDate, body.endDate),
      images: [],
      weeklyPlans: [],
      members: [
        {
          userId: CURRENT_USER.id,
          nickname: CURRENT_USER.nickname,
          profileImage: CURRENT_USER.profileImage,
          role: 'LEADER',
        },
      ],
      myApplicationStatus: null,
    };

    // 목록 맨 앞에 추가 → 이후 latest 정렬 시 상단 노출
    mockGatherings.unshift(newGathering);
    mockDetails[newGathering.id] = detail;

    return HttpResponse.json(createApiResponse<CreateGatheringResponse>({ gathering: detail }), { status: 201 });
  }),

  /** PUT /api/v1/gatherings/:gatheringId — 모임 수정 */
  http.put(`${BASE}/:gatheringId`, async ({ request, params }) => {
    await delay(300);

    const gatheringId = Number(params.gatheringId);
    const parsed = updateBodySchema.safeParse(await parseFormDataRequest(request));
    if (!parsed.success)
      return HttpResponse.json({ success: false, data: null, message: '잘못된 요청입니다.' }, { status: 400 });
    const body = parsed.data;

    const idx = mockGatherings.findIndex((g) => g.id === gatheringId);
    if (idx === -1)
      return HttpResponse.json({ success: false, data: null, message: '모임을 찾을 수 없습니다.' }, { status: 404 });

    // 목록 아이템 업데이트
    mockGatherings[idx] = { ...mockGatherings[idx], ...body } as GatheringListItem;

    // mockDetails에 id 1번만 상세 데이터가 있고 2~6번은 없음
    // 상세가 없는 id를 수정할 경우 mockGatherings 목록 아이템을 기반으로 빈 상세를 즉석 생성(초기화)한 뒤,
    // 수정 요청 바디를 덮어씌워(병합) 최종 상세 데이터를 만든다
    const existingDetail = mockDetails[gatheringId] ?? {
      ...mockGatherings[idx],
      description: '',
      goal: '',
      totalWeeks: 4,
      images: [],
      weeklyPlans: [],
      members: [],
      myApplicationStatus: null,
    };
    const updatedDetail: GatheringDetail = { ...existingDetail, ...mockGatherings[idx], ...body } as GatheringDetail;
    mockDetails[gatheringId] = updatedDetail;

    return HttpResponse.json(createApiResponse<UpdateGatheringResponse>({ gathering: updatedDetail }));
  }),

  /** DELETE /api/v1/gatherings/:gatheringId — 모임 삭제 */
  http.delete(`${BASE}/:gatheringId`, async ({ params }) => {
    await delay(300);

    const gatheringId = Number(params.gatheringId);
    mockGatherings = mockGatherings.filter((g) => g.id !== gatheringId);
    delete mockDetails[gatheringId];

    return new HttpResponse(null, { status: 204 });
  }),
];
