import { http, HttpResponse, delay } from 'msw';

import { gatheringFormSchema, gatheringUpdateFormSchema } from '@/api/gatherings/schemas';
import { createApiResponse } from '../utils';

import type {
  GatheringListItem,
  GatheringDetail,
  GetGatheringsResponse,
  GetMainGatheringsResponse,
  CreateGatheringResponse,
  UpdateGatheringResponse,
} from '@/api/gatherings/types';

// gatheringFormSchema의 images 필드는 z.instanceof(File)로 브라우저 File 객체를 검사하지만,
// MSW 핸들러에서 request.json()으로 받은 바디는 순수 JSON이라 File 객체가 존재하지 않음
// → images 필드를 omit한 파생 스키마로 JSON 바디를 안전하게 파싱
// 이미지 업로드 구현 시 multipart/form-data 파싱으로 교체 필요
const createBodySchema = gatheringFormSchema.omit({ images: true });
const updateBodySchema = gatheringUpdateFormSchema.omit({ images: true });

// ─── 목 데이터 ────────────────────────────────────────────────────────────────

let mockGatherings: GatheringListItem[] = [
  {
    id: 1,
    type: '스터디',
    category: '프론트엔드',
    title: 'React 19 & Next.js 15 스터디',
    shortDescription: 'React 19의 새 기능과 Next.js App Router를 함께 파헤쳐요.',
    tags: ['React', 'Next.js', 'TypeScript'],
    maxMembers: 6,
    currentMembers: 4,
    recruitDeadline: '2026-04-10',
    startDate: '2026-04-15',
    endDate: '2026-06-30',
    status: 'RECRUITING',
    isLiked: false,
    leader: { id: 1, nickname: '김코딩', profileImage: null },
  },
  {
    id: 2,
    type: '스터디',
    category: '백엔드',
    title: 'Spring Boot 심화 스터디',
    shortDescription: 'JPA, Redis, Kafka를 활용한 실전 백엔드 구축.',
    tags: ['Java', 'Spring', 'JPA'],
    maxMembers: 8,
    currentMembers: 8,
    recruitDeadline: '2026-03-30',
    startDate: '2026-04-05',
    endDate: '2026-07-05',
    status: 'IN_PROGRESS',
    isLiked: true,
    leader: { id: 2, nickname: '이개발', profileImage: null },
  },
  {
    id: 3,
    type: '프로젝트',
    category: '풀스택',
    title: 'SaaS 사이드 프로젝트 팀 모집',
    shortDescription: '구독형 SaaS 서비스를 함께 기획·개발해요.',
    tags: ['SaaS', 'React', 'Node.js'],
    maxMembers: 5,
    currentMembers: 2,
    recruitDeadline: '2026-04-20',
    startDate: '2026-05-01',
    endDate: '2026-09-30',
    status: 'RECRUITING',
    isLiked: false,
    leader: { id: 3, nickname: '박프로', profileImage: null },
  },
  {
    id: 4,
    type: '스터디',
    category: 'CS',
    title: '알고리즘 & 자료구조 스터디',
    shortDescription: '코테 대비 알고리즘 풀이 및 CS 기초 다지기.',
    tags: ['알고리즘', '자료구조', 'Python'],
    maxMembers: 10,
    currentMembers: 7,
    recruitDeadline: '2026-04-05',
    startDate: '2026-04-12',
    endDate: '2026-08-10',
    status: 'RECRUITING',
    isLiked: true,
    leader: { id: 1, nickname: '김코딩', profileImage: null },
  },
  {
    id: 5,
    type: '프로젝트',
    category: '모바일',
    title: 'React Native 앱 개발 프로젝트',
    shortDescription: '크로스 플랫폼 모바일 앱을 처음부터 배포까지.',
    tags: ['React Native', 'Expo', 'TypeScript'],
    maxMembers: 4,
    currentMembers: 4,
    recruitDeadline: '2026-03-25',
    startDate: '2026-04-01',
    endDate: '2026-07-31',
    status: 'COMPLETED',
    isLiked: false,
    leader: { id: 4, nickname: '최모바일', profileImage: null },
  },
  {
    id: 6,
    type: '스터디',
    category: 'AI/ML',
    title: 'LLM 파인튜닝 실전 스터디',
    shortDescription: 'HuggingFace와 LoRA를 활용한 LLM 파인튜닝 실습.',
    tags: ['Python', 'LLM', 'HuggingFace'],
    maxMembers: 6,
    currentMembers: 1,
    recruitDeadline: '2026-04-25',
    startDate: '2026-05-05',
    endDate: '2026-08-31',
    status: 'RECRUITING',
    isLiked: false,
    leader: { id: 5, nickname: '정AI', profileImage: null },
  },
];

const mockDetails: Record<number, GatheringDetail> = {
  1: {
    ...mockGatherings[0],
    description:
      'React 19의 새로운 훅과 Server Components, 그리고 Next.js 15 App Router의 심화 기능을 학습합니다. 매주 정해진 분량을 공부하고 발표하는 방식으로 진행합니다.',
    goal: '8주 후 React 19 + Next.js 15 기반의 풀스택 프로젝트 완성',
    totalWeeks: 8,
    images: [{ url: 'https://placehold.co/800x400?text=React+Study', displayOrder: 0 }],
    weeklyPlans: [
      {
        week: 1,
        title: 'React 19 개요 & useTransition',
        startDate: '2026-04-15',
        endDate: '2026-04-21',
      },
      {
        week: 2,
        title: 'Server Components & Actions',
        startDate: '2026-04-22',
        endDate: '2026-04-28',
      },
      { week: 3, title: 'Next.js App Router 심화', startDate: '2026-04-29', endDate: '2026-05-05' },
    ],
    members: [
      { userId: 1, nickname: '김코딩', profileImage: null, role: 'LEADER' },
      { userId: 2, nickname: '이개발', profileImage: null, role: 'MEMBER' },
      { userId: 3, nickname: '박프로', profileImage: null, role: 'MEMBER' },
      { userId: 4, nickname: '최모바일', profileImage: null, role: 'MEMBER' },
    ],
    myApplicationStatus: null,
  },
};

// ─── 헬퍼 ─────────────────────────────────────────────────────────────────────

/**
 * URL 쿼리스트링을 읽어 목록을 필터링 + 정렬한다.
 * - 필터: type, category, status (ALL이면 스킵), query (제목·짧은설명 부분 검색)
 * - 정렬: popular(참여자 많은 순) | deadline(마감 임박 순) | 기본값(id 내림차순 = 최신순)
 * - 얕은 복사본에서 작업하므로 mockGatherings 원본은 변경되지 않는다.
 */
const applyFilters = (list: GatheringListItem[], url: URL): GatheringListItem[] => {
  const type = url.searchParams.get('type') as GatheringListItem['type'] | null;
  const category = url.searchParams.get('category');
  const sort = url.searchParams.get('sort') as 'latest' | 'popular' | 'deadline' | null;
  const status = url.searchParams.get('status') as GatheringListItem['status'] | 'ALL' | null;
  const query = url.searchParams.get('query');

  let result = [...list]; // 얕은 복사 → filter/sort가 mockGatherings 원본을 변경하지 않음

  if (type) result = result.filter((g) => g.type === type);
  if (category) result = result.filter((g) => g.category === category);
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

      const generated: GatheringDetail = {
        ...base,
        description: `${base.title} 모임입니다.`,
        goal: '목표를 함께 달성해요.',
        totalWeeks: 8,
        images: [],
        weeklyPlans: [],
        members: [
          {
            userId: base.leader.id,
            nickname: base.leader.nickname,
            profileImage: base.leader.profileImage,
            role: 'LEADER',
          },
        ],
        myApplicationStatus: null,
      };
      return HttpResponse.json(createApiResponse(generated));
    }

    return HttpResponse.json(createApiResponse(detail));
  }),

  /** POST /api/v1/gatherings — 모임 생성 */
  http.post(BASE, async ({ request }) => {
    await delay(300);

    const parsed = createBodySchema.safeParse(await request.json());
    if (!parsed.success)
      return HttpResponse.json({ success: false, data: null, message: '잘못된 요청입니다.' }, { status: 400 });
    const body = parsed.data;
    const newGathering: GatheringListItem = {
      id: Date.now(),
      type: body.type,
      category: body.category,
      title: body.title,
      shortDescription: body.shortDescription,
      tags: body.tags,
      maxMembers: body.maxMembers,
      currentMembers: 1,
      recruitDeadline: body.recruitDeadline,
      startDate: body.startDate,
      endDate: body.endDate,
      status: 'RECRUITING',
      isLiked: false,
      leader: { id: 1, nickname: '김코딩', profileImage: null },
    };

    const detail: GatheringDetail = {
      ...newGathering,
      description: body.description,
      goal: body.goal,
      totalWeeks: body.weeklyGuides.length,
      images: [],
      weeklyPlans: [],
      members: [{ userId: 1, nickname: '김코딩', profileImage: null, role: 'LEADER' }],
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
    const parsed = updateBodySchema.safeParse(await request.json());
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
