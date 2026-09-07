import { http, HttpResponse, delay } from 'msw';
import { z } from 'zod';

import { createApiResponse } from '../utils';
import { CURRENT_USER } from '../_data';

import type {
  GatheringDraftSummary,
  GetGatheringDraftsResponse,
  SaveGatheringDraftResponse,
} from '@/api/gatherings/types';

const BASE = '/api/v1/gatherings/drafts';
const DRAFT_LIMIT_PER_USER = 5;

const draftRequestSchema = z
  .object({
    type: z.enum(['STUDY', 'PROJECT', '스터디', '프로젝트']).or(z.literal('')).nullable().optional(),
    categoryIds: z.array(z.number()).optional(),
    title: z.string().nullable().optional(),
    shortDescription: z.string().nullable().optional(),
    description: z.string().nullable().optional(),
    tags: z.array(z.string()).optional(),
    goal: z.string().nullable().optional(),
    maxMembers: z.number().nullable().optional(),
    recruitDeadline: z.string().nullable().optional(),
    startDate: z.string().nullable().optional(),
    endDate: z.string().nullable().optional(),
    weeklyGuides: z
      .array(
        z.object({
          week: z.number(),
          title: z.string(),
          details: z.array(z.string()).optional(),
        }),
      )
      .optional(),
  })
  .partial();

type DraftRequestBody = z.infer<typeof draftRequestSchema>;

const hasDraftContent = (body: DraftRequestBody): boolean => {
  const hasText = [
    body.type,
    body.title,
    body.shortDescription,
    body.description,
    body.goal,
    body.recruitDeadline,
    body.startDate,
    body.endDate,
  ].some((value) => typeof value === 'string' && value.trim().length > 0);

  const hasArray = [body.categoryIds, body.tags, body.weeklyGuides].some(
    (value) => Array.isArray(value) && value.length > 0,
  );
  const hasMaxMembers = typeof body.maxMembers === 'number' && Number.isFinite(body.maxMembers);

  return hasText || hasArray || hasMaxMembers;
};

// API 함수(createGatheringDraft/updateGatheringDraft)가 type을 한글 → 영어(STUDY/PROJECT)로
// 변환한 뒤 전송하므로, mock 저장/조회 왕복 시 다시 한글로 되돌리기 위한 역변환 테이블.
// gatherings.ts의 PARAM_TO_TYPE과 동일한 역할.
const PARAM_TO_TYPE: Record<string, GatheringDraftSummary['type']> = {
  STUDY: '스터디',
  PROJECT: '프로젝트',
  스터디: '스터디',
  프로젝트: '프로젝트',
};

// 진짜 DB가 없으므로 draft 한 건을 흉내내는 레코드 타입.
// 모든 필드가 필요할 때까지 채워지지 않을 수 있어(퍼널 중간 저장) null 허용,
// ownerId는 API 응답엔 없지만 "내 임시저장만 보이게/조작하게" 하려고 mock 내부에서만 관리.
interface MockDraftRecord {
  draftId: number;
  ownerId: number;
  type: string | null;
  categoryIds: number[];
  title: string | null;
  shortDescription: string | null;
  description: string | null;
  tags: string[];
  goal: string | null;
  maxMembers: number | null;
  recruitDeadline: string | null;
  startDate: string | null;
  endDate: string | null;
  weeklyGuides: { week: number; title: string; details?: string[] }[];
  updatedAt: string;
}

// 인메모리 "가짜 DB". 페이지를 새로고침하기 전까지만 유지된다.
// let인 이유: 삭제 핸들러에서 filter로 새 배열을 만들어 통째로 재할당하기 때문.
let mockDrafts: MockDraftRecord[] = [
  {
    draftId: 1,
    ownerId: CURRENT_USER.id,
    type: 'STUDY',
    categoryIds: [7],
    title: 'React 성능 최적화 스터디',
    shortDescription: '렌더링 병목과 메모이제이션 기준을 함께 정리하는 스터디',
    description: null,
    tags: ['React', '성능', '프론트엔드'],
    goal: '실제 프로젝트에서 성능 병목을 찾고 개선할 수 있게 되기',
    maxMembers: null,
    recruitDeadline: null,
    startDate: null,
    endDate: null,
    weeklyGuides: [],
    updatedAt: '2026-08-10T13:30:00.000Z',
  },
  {
    draftId: 2,
    ownerId: CURRENT_USER.id,
    type: 'PROJECT',
    categoryIds: [7, 11],
    title: '디자인 시스템 토이 프로젝트',
    shortDescription: '컴포넌트 문서화와 Storybook 운영 흐름을 연습하는 프로젝트',
    description: '공통 UI 컴포넌트를 만들고 사용 예시를 Storybook으로 정리합니다.',
    tags: ['Storybook', 'DesignSystem'],
    goal: '재사용 가능한 UI 컴포넌트와 문서화 흐름 만들기',
    maxMembers: 4,
    recruitDeadline: '2026-08-24',
    startDate: '2026-09-01',
    endDate: '2026-09-28',
    weeklyGuides: [
      { week: 1, title: '컴포넌트 목록 정의', details: ['Button, Tag, Card 사용 기준 정리'] },
      { week: 2, title: 'Storybook 문서화', details: ['주요 상태별 스토리 작성'] },
    ],
    updatedAt: '2026-08-09T08:15:00.000Z',
  },
  {
    draftId: 3,
    ownerId: CURRENT_USER.id,
    type: 'STUDY',
    categoryIds: [8],
    title: null,
    shortDescription: null,
    description: null,
    tags: [],
    goal: null,
    maxMembers: null,
    recruitDeadline: null,
    startDate: null,
    endDate: null,
    weeklyGuides: [],
    updatedAt: '2026-08-08T11:00:00.000Z',
  },
];
// 다음 draft에 부여할 ID. 후위 증가(draftIdSeq++)라 초기 mock 다음 ID부터 순서대로 나간다.
let draftIdSeq = 4;

// GET /gatherings/drafts(목록)용 — 명세상 목록 응답은 draftId/title/type/updatedAt만 필요
const toSummary = (draft: MockDraftRecord): GatheringDraftSummary => ({
  draftId: draft.draftId,
  title: draft.title,
  type: draft.type ? (PARAM_TO_TYPE[draft.type] ?? null) : null,
  updatedAt: draft.updatedAt,
});

// GET /gatherings/drafts/:id(상세)용 — 이어작성 시 폼을 채워야 하므로 전체 필드 반환
const toDetail = (draft: MockDraftRecord) => ({
  draftId: draft.draftId,
  type: draft.type ? (PARAM_TO_TYPE[draft.type] ?? null) : null,
  categoryIds: draft.categoryIds,
  title: draft.title,
  shortDescription: draft.shortDescription,
  description: draft.description,
  tags: draft.tags,
  goal: draft.goal,
  maxMembers: draft.maxMembers,
  recruitDeadline: draft.recruitDeadline,
  startDate: draft.startDate,
  endDate: draft.endDate,
  weeklyGuides: draft.weeklyGuides,
  updatedAt: draft.updatedAt,
});

// 상세 조회/수정/삭제 3개 핸들러가 공통으로 쓰는 에러 응답 (API 명세서의 404/403 규격)
const notFound = () =>
  HttpResponse.json({ success: false, data: null, message: '임시저장을 찾을 수 없습니다.' }, { status: 404 });

const forbidden = () =>
  HttpResponse.json({ success: false, data: null, message: '본인 소유의 임시저장이 아닙니다.' }, { status: 403 });

export const gatheringDraftsHandlers = [
  /** POST /api/v1/gatherings/drafts — 임시저장 생성 */
  http.post(BASE, async ({ request }) => {
    await delay(300);

    // 명세서: 유저당 최대 5개, 초과 시 409 DRAFT_LIMIT_EXCEEDED
    const ownerDraftCount = mockDrafts.filter((d) => d.ownerId === CURRENT_USER.id).length;
    if (ownerDraftCount >= DRAFT_LIMIT_PER_USER) {
      return HttpResponse.json(
        {
          success: false,
          data: null,
          message: '임시저장은 최대 5개까지 가능합니다.',
          errorCode: 'DRAFT_LIMIT_EXCEEDED',
        },
        { status: 409 },
      );
    }

    // 운영 임시저장은 작성 중인 빈 값('' / [] / null)을 허용하므로 mock도 느슨하게 받는다.
    // 단, 완전히 빈 draft는 프론트와 동일하게 저장하지 않는다.
    const parsed = draftRequestSchema.safeParse(await request.json());
    if (!parsed.success)
      return HttpResponse.json({ success: false, data: null, message: '잘못된 요청입니다.' }, { status: 400 });
    const body = parsed.data;
    if (!hasDraftContent(body)) {
      return HttpResponse.json(
        { success: false, data: null, message: '최소 1개 항목은 입력해야 임시저장할 수 있습니다.' },
        { status: 400 },
      );
    }

    const now = new Date().toISOString();
    // 폼에서 아직 안 채운 필드는 body에서 undefined로 오므로, 저장 시점에 null로 정규화
    // (mock 저장소 타입을 "필드 있고 값이 null"로 통일해 조회 응답도 일관되게 null을 내려주기 위함)
    const newDraft: MockDraftRecord = {
      draftId: draftIdSeq++,
      ownerId: CURRENT_USER.id,
      type: body.type ?? null,
      categoryIds: body.categoryIds ?? [],
      title: body.title ?? null,
      shortDescription: body.shortDescription ?? null,
      description: body.description ?? null,
      tags: body.tags ?? [],
      goal: body.goal ?? null,
      maxMembers: body.maxMembers ?? null,
      recruitDeadline: body.recruitDeadline ?? null,
      startDate: body.startDate ?? null,
      endDate: body.endDate ?? null,
      weeklyGuides: body.weeklyGuides ?? [],
      updatedAt: now,
    };
    // unshift: 최신 draft가 배열 앞쪽에 오도록 (목록 조회 시 정렬과는 별개로, 데이터 넣는 습관을 통일)
    mockDrafts.unshift(newDraft);

    return HttpResponse.json(
      createApiResponse<SaveGatheringDraftResponse>({ draftId: newDraft.draftId, updatedAt: now }),
      { status: 201 },
    );
  }),

  /** GET /api/v1/gatherings/drafts — 내 임시저장 목록 조회 */
  http.get(BASE, async () => {
    await delay(200);

    // 명세서: updatedAt 최신순 정렬. 문자열 형태의 ISO 날짜는 사전식 비교로도 최신순 정렬이 가능
    const drafts = mockDrafts
      .filter((d) => d.ownerId === CURRENT_USER.id)
      .sort((a, b) => (a.updatedAt < b.updatedAt ? 1 : -1))
      .map(toSummary);

    return HttpResponse.json(createApiResponse<GetGatheringDraftsResponse>({ drafts, totalCount: drafts.length }));
  }),

  /** GET /api/v1/gatherings/drafts/:draftId — 임시저장 상세 조회 */
  http.get(`${BASE}/:draftId`, async ({ params }) => {
    await delay(200);

    const draft = mockDrafts.find((d) => d.draftId === Number(params.draftId));
    if (!draft) return notFound();
    // 명세서: 본인 소유가 아니면 403 (다른 유저의 draftId를 URL에 직접 넣어 접근하는 경우 차단)
    if (draft.ownerId !== CURRENT_USER.id) return forbidden();

    return HttpResponse.json(createApiResponse(toDetail(draft)));
  }),

  /** PUT /api/v1/gatherings/drafts/:draftId — 임시저장 수정 (부분 업데이트) */
  http.put(`${BASE}/:draftId`, async ({ request, params }) => {
    await delay(300);

    const draftId = Number(params.draftId);
    const idx = mockDrafts.findIndex((d) => d.draftId === draftId);
    if (idx === -1) return notFound();
    if (mockDrafts[idx].ownerId !== CURRENT_USER.id) return forbidden();

    const parsed = draftRequestSchema.safeParse(await request.json());
    if (!parsed.success)
      return HttpResponse.json({ success: false, data: null, message: '잘못된 요청입니다.' }, { status: 400 });
    const body = parsed.data;
    if (!hasDraftContent(body)) {
      return HttpResponse.json(
        { success: false, data: null, message: '최소 1개 항목은 입력해야 임시저장할 수 있습니다.' },
        { status: 400 },
      );
    }

    const now = new Date().toISOString();
    // 명세서 "부분 업데이트" 규칙: 요청 바디에 "보낸 필드만" 반영해야 한다.
    // body[field] !== undefined로 "이 필드를 실제로 보냈는지"를 확인 후에만 덮어쓴다 —
    // 만약 무조건 ...body를 펼쳐버리면 프론트가 안 보낸 필드까지 undefined로 밀어써서
    // 기존 값을 실수로 지워버리게 된다. 지우고 싶을 땐 프론트가 ''나 []처럼 "값 있는 빈 값"을
    // 명시적으로 보내야 하고(백엔드와 합의된 규칙), 그 경우는 여기서 정상적으로 반영된다.
    mockDrafts[idx] = {
      ...mockDrafts[idx],
      ...(body.type !== undefined && { type: body.type }),
      ...(body.categoryIds !== undefined && { categoryIds: body.categoryIds }),
      ...(body.title !== undefined && { title: body.title }),
      ...(body.shortDescription !== undefined && { shortDescription: body.shortDescription }),
      ...(body.description !== undefined && { description: body.description }),
      ...(body.tags !== undefined && { tags: body.tags }),
      ...(body.goal !== undefined && { goal: body.goal }),
      ...(body.maxMembers !== undefined && { maxMembers: body.maxMembers }),
      ...(body.recruitDeadline !== undefined && { recruitDeadline: body.recruitDeadline }),
      ...(body.startDate !== undefined && { startDate: body.startDate }),
      ...(body.endDate !== undefined && { endDate: body.endDate }),
      ...(body.weeklyGuides !== undefined && { weeklyGuides: body.weeklyGuides }),
      updatedAt: now,
    };

    return HttpResponse.json(createApiResponse<SaveGatheringDraftResponse>({ draftId, updatedAt: now }));
  }),

  /** DELETE /api/v1/gatherings/drafts/:draftId — 임시저장 삭제 */
  http.delete(`${BASE}/:draftId`, async ({ params }) => {
    await delay(200);

    const draftId = Number(params.draftId);
    const draft = mockDrafts.find((d) => d.draftId === draftId);
    if (!draft) return notFound();
    if (draft.ownerId !== CURRENT_USER.id) return forbidden();

    // filter로 새 배열을 만들어 재할당 (mockDrafts가 let인 이유)
    mockDrafts = mockDrafts.filter((d) => d.draftId !== draftId);

    // 실제 백엔드 응답이 data 필드 없이 { success: true }만 내려주므로 동일하게 맞춤
    return HttpResponse.json({ success: true });
  }),
];
