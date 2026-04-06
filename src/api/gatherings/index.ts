import { axiosClient } from '@/lib/axiosClient';
import { unwrapResponse } from '@/api/common/utils';

import type { ApiResponse } from '@/api/common/types';
import type {
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
  return unwrapResponse(json);
};

/** GET /v1/gatherings/:gatheringId — 모임 상세 (서버/클라이언트 공용) */
export const fetchGatheringDetail = async (gatheringId: number): Promise<GetGatheringDetailResponse> => {
  const isServer = typeof window === 'undefined';
  const res = await fetch(`${getBaseUrl()}/v1/gatherings/${gatheringId}`, {
    ...(isServer && { next: { tags: [GATHERING_TAGS.all, GATHERING_TAGS.detail(gatheringId)] } }),
  });
  if (!res.ok) throw new Error(`gatherings/${gatheringId} fetch failed: ${res.status}`);
  const json: ApiResponse<GetGatheringDetailResponse> = await res.json();
  return unwrapResponse(json);
};

/** GET /v1/gatherings/:gatheringId — 모임 상세 (클라이언트 전용) */
export const getGatheringDetail = async (gatheringId: number): Promise<GetGatheringDetailResponse> => {
  const { data } = await axiosClient.get<ApiResponse<GetGatheringDetailResponse>>(`/v1/gatherings/${gatheringId}`);
  return unwrapResponse(data);
};

/** GET /v1/gatherings — 모임 목록 검색 (클라이언트 전용) */
export const getGatherings = async (params?: GetGatheringsParams): Promise<GetGatheringsResponse> => {
  const { data } = await axiosClient.get<ApiResponse<GetGatheringsResponse>>('/v1/gatherings', { params });
  return unwrapResponse(data);
};

/** POST /v1/gatherings — 모임 생성 (이미지 업로드 시 multipart/form-data 처리 필요할 수 있음) */
export const createGathering = async (body: CreateGatheringRequest): Promise<CreateGatheringResponse> => {
  const formData = new FormData();

  const { images, ...requestData } = body;

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

/** PUT /v1/gatherings/:gatheringId — 모임 수정 (이미지 업로드 시 multipart/form-data 처리 필요할 수 있음) */
export const updateGathering = async (
  gatheringId: number,
  body: UpdateGatheringRequest,
): Promise<UpdateGatheringResponse> => {
  const { data } = await axiosClient.put<ApiResponse<UpdateGatheringResponse>>(`/v1/gatherings/${gatheringId}`, body);
  return unwrapResponse(data);
};

/** DELETE /v1/gatherings/:gatheringId — 모임 삭제 */
export const deleteGathering = async (gatheringId: number): Promise<void> => {
  await axiosClient.delete(`/v1/gatherings/${gatheringId}`);
};
