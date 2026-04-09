import { axiosClient } from '@/lib/axiosClient';
import { unwrapResponse } from '@/api/common/utils';

import type { ApiResponse } from '@/api/common/types';
import type {
  GatheringListItem,
  GatheringDetail,
  GetApplicationStatusResponse,
  GetCategoriesResponse,
  GetGatheringsParams,
  GetGatheringsResponse,
  GetMainGatheringsParams,
  GetMainGatheringsResponse,
  GetGatheringDetailResponse,
  CreateGatheringRequest,
  CreateGatheringResponse,
  UpdateGatheringRequest,
  UpdateGatheringResponse,
} from './types';
import { GATHERING_TYPE_TO_PARAM } from './types';

// ── 백엔드 호환 레이어 ──────

/** 백엔드 category 키 → 한글 라벨 매핑 */
const CATEGORY_KEY_TO_LABEL: Record<string, string> = {
  DEVELOPMENT: '개발',
  LANGUAGE: '어학',
  BOOK: '독서',
  CERTIFICATE: '자격증',
  DESIGN: '디자인',
};

/** 백엔드 응답의 category(단일 문자열) → categories(문자열 배열) 변환 */
const normalizeGathering = <T extends GatheringListItem>(item: T): T => {
  if (item.categories) return item;

  const raw = item as T & { category?: string };
  const label = raw.category ? (CATEGORY_KEY_TO_LABEL[raw.category] ?? raw.category) : '';
  return { ...item, categories: label ? [label] : [] };
};

const normalizeGatheringList = <T extends GatheringListItem>(list: T[]): T[] => list.map(normalizeGathering);

const normalizeDetail = (detail: GatheringDetail): GatheringDetail => normalizeGathering(detail);

export const GATHERING_TAGS = {
  all: 'gatherings',
  main: 'gatherings-main',
  detail: (gatheringId: number) => `gatherings-detail-${gatheringId}`,
} as const;

const getBaseUrl = () => {
  if (typeof window !== 'undefined') {
    return '/api'; // 클라이언트: 상대 경로 → 브라우저 MSW Service Worker가 인터셉트
  }
  const baseUrl = process.env.BACKEND_BASE_URL;
  if (!baseUrl) throw new Error('BACKEND_BASE_URL is not defined');
  return baseUrl.replace(/\/+$/, '');
};

/** GET /v1/gatherings/categories — 카테고리 목록 조회 */
export const getCategories = async (): Promise<GetCategoriesResponse> => {
  const { data } = await axiosClient.get<ApiResponse<GetCategoriesResponse>>('/v1/gatherings/categories');
  return unwrapResponse(data);
};

/**
 * GET /v1/gatherings/:gatheringId/application-status — 모임 신청 상태 조회
 * 백엔드 미구현 시 상세 조회의 myApplicationStatus로 fallback
 */
export const getApplicationStatus = async (gatheringId: number): Promise<GetApplicationStatusResponse> => {
  try {
    const { data } = await axiosClient.get<ApiResponse<GetApplicationStatusResponse>>(
      `/v1/gatherings/${gatheringId}/application-status`,
    );
    return unwrapResponse(data);
  } catch {
    // fallback: 상세 조회에서 myApplicationStatus 추출
    const detail = await getGatheringDetail(gatheringId);
    return { myApplicationStatus: detail.myApplicationStatus };
  }
};

/** GET /v1/gatherings/main — 메인 페이지 모임 목록 (서버/클라이언트 공용) */
export const fetchMainGatherings = async (params?: GetMainGatheringsParams): Promise<GetMainGatheringsResponse> => {
  const searchParams = new URLSearchParams();
  if (params?.limit !== undefined) searchParams.set('limit', String(params.limit));
  const qs = searchParams.toString();

  const isServer = typeof window === 'undefined';
  const res = await fetch(`${getBaseUrl()}/v1/gatherings/main${qs ? `?${qs}` : ''}`, {
    ...(isServer && { next: { tags: [GATHERING_TAGS.all, GATHERING_TAGS.main] } }),
  });
  if (!res.ok) throw new Error(`gatherings/main fetch failed: ${res.status}`);
  const json: ApiResponse<GetMainGatheringsResponse> = await res.json();
  const data = unwrapResponse(json);
  return {
    popular: normalizeGatheringList(data.popular),
    deadline: normalizeGatheringList(data.deadline),
    latest: normalizeGatheringList(data.latest),
  };
};

/** GET /v1/gatherings/:gatheringId — 모임 상세 (서버/클라이언트 공용) */
export const fetchGatheringDetail = async (gatheringId: number): Promise<GetGatheringDetailResponse> => {
  const isServer = typeof window === 'undefined';
  const res = await fetch(`${getBaseUrl()}/v1/gatherings/${gatheringId}`, {
    ...(isServer && { next: { tags: [GATHERING_TAGS.all, GATHERING_TAGS.detail(gatheringId)] } }),
  });
  if (!res.ok) throw new Error(`gatherings/${gatheringId} fetch failed: ${res.status}`);
  const json: ApiResponse<GetGatheringDetailResponse> = await res.json();
  return normalizeDetail(unwrapResponse(json));
};

/** GET /v1/gatherings/:gatheringId — 모임 상세 (클라이언트 전용) */
export const getGatheringDetail = async (gatheringId: number): Promise<GetGatheringDetailResponse> => {
  const { data } = await axiosClient.get<ApiResponse<GetGatheringDetailResponse>>(`/v1/gatherings/${gatheringId}`);
  return normalizeDetail(unwrapResponse(data));
};

/** GET /v1/gatherings — 모임 목록 검색 (클라이언트 전용) */
export const getGatherings = async (params?: GetGatheringsParams): Promise<GetGatheringsResponse> => {
  const { data } = await axiosClient.get<ApiResponse<GetGatheringsResponse>>('/v1/gatherings', { params });
  const result = unwrapResponse(data);
  return { ...result, gatherings: normalizeGatheringList(result.gatherings) };
};

/** POST /v1/gatherings — 모임 생성 (이미지 업로드 시 multipart/form-data 처리 필요할 수 있음) */
export const createGathering = async (body: CreateGatheringRequest): Promise<CreateGatheringResponse> => {
  const formData = new FormData();

  const { images, type, ...rest } = body;
  const requestData = { ...rest, type: GATHERING_TYPE_TO_PARAM[type] };

  const requestBlob = new Blob([JSON.stringify(requestData)], { type: 'application/json' });
  formData.append('request', requestBlob);

  if (images && images.length > 0) {
    images.forEach((file) => {
      formData.append('images', file);
    });
  }

  const { data } = await axiosClient.post<ApiResponse<CreateGatheringResponse>>('/v1/gatherings', formData);
  return unwrapResponse(data);
};

/** PUT /v1/gatherings/:gatheringId — 모임 수정 */
export const updateGathering = async (
  gatheringId: number,
  body: UpdateGatheringRequest,
): Promise<UpdateGatheringResponse> => {
  const formData = new FormData();

  const { images, type, ...rest } = body;
  const requestData = { ...rest, ...(type && { type: GATHERING_TYPE_TO_PARAM[type] }) };

  const requestBlob = new Blob([JSON.stringify(requestData)], { type: 'application/json' });
  formData.append('request', requestBlob);

  if (images && images.length > 0) {
    images.forEach((file) => {
      formData.append('images', file);
    });
  }

  const { data } = await axiosClient.put<ApiResponse<UpdateGatheringResponse>>(
    `/v1/gatherings/${gatheringId}`,
    formData,
  );
  return unwrapResponse(data);
};

/** DELETE /v1/gatherings/:gatheringId — 모임 삭제 */
export const deleteGathering = async (gatheringId: number): Promise<void> => {
  await axiosClient.delete(`/v1/gatherings/${gatheringId}`);
};
