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

// 카테고리: DEVELOPMENT, LANGUAGE, BOOK, CERTIFICATE / 유형: STUDY, PROJECT
const BASE_GATHERINGS: GatheringListItem[] = [
  // ── DEVELOPMENT ──
  {
    id: 1,
    type: 'STUDY',
    category: 'DEVELOPMENT',
    title: 'React 19 & Next.js 스터디',
    shortDescription: 'React 19의 새 기능과 Next.js App Router를 함께 파헤쳐요.',
    tags: ['React', 'Next.js', 'TypeScript'],
    maxMembers: 6,
    currentMembers: 4,
    recruitDeadline: '2026-02-10',
    startDate: '2026-02-10',
    endDate: '2026-04-1',
    status: 'RECRUITING',
    isLiked: false,
    leader: { id: 1, nickname: '김코딩', profileImage: 'https://avatars.githubusercontent.com/u/1?v=4' },
  },
  {
    id: 2,
    type: 'PROJECT',
    category: 'DEVELOPMENT',
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
    leader: { id: 2, nickname: '박프로', profileImage: 'https://avatars.githubusercontent.com/u/2?v=4' },
  },
  {
    id: 3,
    type: 'STUDY',
    category: 'DEVELOPMENT',
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
    leader: { id: 3, nickname: '이개발', profileImage: 'https://avatars.githubusercontent.com/u/3?v=4' },
  },
  // ── LANGUAGE ──
  {
    id: 4,
    type: 'STUDY',
    category: 'LANGUAGE',
    title: '매일 영어 회화 30분 챌린지',
    shortDescription: '매일 30분씩 영어 프리토킹으로 스피킹 실력을 키워요.',
    tags: ['영어', '회화', '스피킹'],
    maxMembers: 8,
    currentMembers: 5,
    recruitDeadline: '2026-04-15',
    startDate: '2026-04-20',
    endDate: '2026-07-20',
    status: 'RECRUITING',
    isLiked: true,
    leader: { id: 4, nickname: '영어왕', profileImage: 'https://avatars.githubusercontent.com/u/4?v=4' },
  },
  {
    id: 5,
    type: 'STUDY',
    category: 'LANGUAGE',
    title: 'JLPT N2 집중 대비반',
    shortDescription: '7월 시험 목표! 문법·독해·청해를 체계적으로 준비합니다.',
    tags: ['일본어', 'JLPT', 'N2'],
    maxMembers: 6,
    currentMembers: 3,
    recruitDeadline: '2026-04-05',
    startDate: '2026-04-12',
    endDate: '2026-07-05',
    status: 'RECRUITING',
    isLiked: false,
    leader: { id: 5, nickname: '일본어마스터', profileImage: 'https://avatars.githubusercontent.com/u/5?v=4' },
  },
  // ── BOOK ──
  {
    id: 6,
    type: 'STUDY',
    category: 'BOOK',
    title: '한 달에 한 권 완독 모임',
    shortDescription: '매달 한 권을 선정해 함께 읽고 토론해요.',
    tags: ['독서', '토론', '인문'],
    maxMembers: 10,
    currentMembers: 7,
    recruitDeadline: '2026-04-08',
    startDate: '2026-04-15',
    endDate: '2026-10-15',
    status: 'RECRUITING',
    isLiked: false,
    leader: { id: 1, nickname: '김코딩', profileImage: 'https://avatars.githubusercontent.com/u/1?v=4' },
  },
  {
    id: 7,
    type: 'PROJECT',
    category: 'BOOK',
    title: '독서 기록 앱 만들기',
    shortDescription: '읽은 책을 기록하고 공유하는 앱을 직접 만들어 봐요.',
    tags: ['독서', '사이드프로젝트', 'Flutter'],
    maxMembers: 4,
    currentMembers: 4,
    recruitDeadline: '2026-03-25',
    startDate: '2026-04-01',
    endDate: '2026-07-31',
    status: 'COMPLETED',
    isLiked: false,
    leader: { id: 6, nickname: '책벌레', profileImage: 'https://avatars.githubusercontent.com/u/6?v=4' },
  },
  // ── CERTIFICATE ──
  {
    id: 8,
    type: 'STUDY',
    category: 'CERTIFICATE',
    title: '정보처리기사 실기 스터디',
    shortDescription: '기출 분석 + 모의고사로 실기 합격을 목표로 합니다.',
    tags: ['정보처리기사', '자격증', '실기'],
    maxMembers: 8,
    currentMembers: 6,
    recruitDeadline: '2026-04-12',
    startDate: '2026-04-20',
    endDate: '2026-06-20',
    status: 'RECRUITING',
    isLiked: true,
    leader: { id: 7, nickname: '합격러', profileImage: 'https://avatars.githubusercontent.com/u/7?v=4' },
  },
  {
    id: 9,
    type: 'STUDY',
    category: 'CERTIFICATE',
    title: 'SQLD 자격증 4주 완성',
    shortDescription: 'SQL 기초부터 시험 대비까지 4주 만에 끝내요.',
    tags: ['SQLD', 'SQL', '데이터베이스'],
    maxMembers: 6,
    currentMembers: 1,
    recruitDeadline: '2026-04-25',
    startDate: '2026-05-05',
    endDate: '2026-06-02',
    status: 'RECRUITING',
    isLiked: false,
    leader: { id: 8, nickname: 'DB마스터', profileImage: 'https://avatars.githubusercontent.com/u/8?v=4' },
  },
  {
    id: 10,
    type: 'STUDY',
    category: 'CERTIFICATE',
    title: 'TOEIC 900+ 달성 스터디',
    shortDescription: '파트별 전략 학습으로 900점 이상을 목표로 합니다.',
    tags: ['TOEIC', '영어', '자격증'],
    maxMembers: 10,
    currentMembers: 9,
    recruitDeadline: '2026-04-03',
    startDate: '2026-04-10',
    endDate: '2026-06-10',
    status: 'RECRUITING',
    isLiked: false,
    leader: { id: 4, nickname: '영어왕', profileImage: 'https://avatars.githubusercontent.com/u/4?v=4' },
  },
];

// 페이지네이션 테스트를 위해 기본 10개 × 3 = 30개로 확장
const generateMockGatherings = (): GatheringListItem[] => {
  const result: GatheringListItem[] = [];
  for (let round = 0; round < 3; round++) {
    for (const base of BASE_GATHERINGS) {
      result.push({
        ...base,
        id: round * BASE_GATHERINGS.length + base.id,
        title: round === 0 ? base.title : `${base.title} (${round + 1}기)`,
        currentMembers: Math.max(1, (base.currentMembers + round) % (base.maxMembers + 1)),
        isLiked: (round + base.id) % 3 === 0,
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
    weeklyPlans: [
      { week: 1, title: 'React 19 개요 & useTransition', startDate: '2026-04-15', endDate: '2026-04-21' },
      { week: 2, title: 'Server Components & Actions', startDate: '2026-04-22', endDate: '2026-04-28' },
      { week: 3, title: 'Next.js App Router 심화', startDate: '2026-04-29', endDate: '2026-05-05' },
      { week: 4, title: 'Data Fetching 패턴', startDate: '2026-05-06', endDate: '2026-05-12' },
      { week: 5, title: 'TanStack Query 연동', startDate: '2026-05-13', endDate: '2026-05-19' },
      { week: 6, title: '인증 & 미들웨어', startDate: '2026-05-20', endDate: '2026-05-26' },
      { week: 7, title: '배포 & CI/CD', startDate: '2026-05-27', endDate: '2026-06-02' },
      { week: 8, title: '최종 프로젝트 발표', startDate: '2026-06-03', endDate: '2026-06-09' },
    ],
    members: [
      { userId: 1, nickname: '김코딩', profileImage: 'https://avatars.githubusercontent.com/u/1?v=4', role: 'LEADER' },
      { userId: 2, nickname: '이개발', profileImage: 'https://avatars.githubusercontent.com/u/2?v=4', role: 'MEMBER' },
      { userId: 3, nickname: '박프로', profileImage: 'https://avatars.githubusercontent.com/u/3?v=4', role: 'MEMBER' },
      {
        userId: 4,
        nickname: '최모바일',
        profileImage: 'https://avatars.githubusercontent.com/u/4?v=4',
        role: 'MEMBER',
      },
    ],
    myApplicationStatus: null,
  },
  8: {
    ...mockGatherings[7],
    type: 'STUDY',
    category: 'DESIGN',
    title: '피그마 기초 스터디',
    shortDescription: '피그마를 통해 디자인 이론부터 실습까지 목표로',
    tags: ['실습', '디자인'],
    maxMembers: 20,
    currentMembers: 6,
    recruitDeadline: '2026-03-31',
    startDate: '2026-03-15',
    endDate: '2026-04-05',
    status: 'RECRUITING',
    isLiked: false,
    leader: { id: 10, nickname: '김민수', profileImage: null },
    description:
      '디자인 전공자, 비전공자 모두 환영합니다.\n피그마 기초를 함께 공부하고 최종적으로는 웹 서비스 1개를 완성하는 걸 목표로 합니다.\n적극적으로 스터디를 참여할 분들을 기다리겠습니다.',
    goal: '피그마로 웹 서비스 1개 완성하기',
    totalWeeks: 4,
    images: [
      { url: 'https://placehold.co/336x418/2d3436/ffffff?text=Figma+1', displayOrder: 0 },
      { url: 'https://placehold.co/336x418/0984e3/ffffff?text=Figma+2', displayOrder: 1 },
      { url: 'https://placehold.co/336x418/6c5ce7/ffffff?text=Figma+3', displayOrder: 2 },
      { url: 'https://placehold.co/336x418/00b894/ffffff?text=Figma+4', displayOrder: 3 },
      { url: 'https://placehold.co/336x418/fdcb6e/333333?text=Figma+5', displayOrder: 4 },
      { url: 'https://placehold.co/336x418/e17055/ffffff?text=Figma+6', displayOrder: 5 },
      { url: 'https://placehold.co/336x418/a29bfe/ffffff?text=Figma+7', displayOrder: 6 },
      { url: 'https://placehold.co/336x418/55efc4/333333?text=Figma+8', displayOrder: 7 },
      { url: 'https://placehold.co/336x418/74b9ff/333333?text=Figma+9', displayOrder: 8 },
    ],
    weeklyPlans: [
      { week: 1, title: '피그마 이론 마스터', startDate: '2026-03-15', endDate: '2026-03-21' },
      { week: 2, title: '피그마 실무', startDate: '2026-03-22', endDate: '2026-03-28' },
      { week: 3, title: '서비스 기획 및 와이어프레임 작업', startDate: '2026-03-29', endDate: '2026-04-04' },
      { week: 4, title: '서비스 완성', startDate: '2026-04-05', endDate: '2026-04-05' },
    ],
    members: [
      {
        userId: 10,
        nickname: '김민수',
        profileImage: 'https://avatars.githubusercontent.com/u/10?v=4',
        role: 'LEADER',
      },
      {
        userId: 11,
        nickname: '최서연',
        profileImage: 'https://avatars.githubusercontent.com/u/11?v=4',
        role: 'MEMBER',
      },
      {
        userId: 12,
        nickname: '박수철',
        profileImage: 'https://avatars.githubusercontent.com/u/12?v=4',
        role: 'MEMBER',
      },
      {
        userId: 13,
        nickname: '이수태',
        profileImage: 'https://avatars.githubusercontent.com/u/13?v=4',
        role: 'MEMBER',
      },
      {
        userId: 14,
        nickname: '김경아',
        profileImage: 'https://avatars.githubusercontent.com/u/14?v=4',
        role: 'MEMBER',
      },
      {
        userId: 15,
        nickname: '정수진',
        profileImage: 'https://avatars.githubusercontent.com/u/15?v=4',
        role: 'MEMBER',
      },
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
      tags: body.tags ?? [],
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
