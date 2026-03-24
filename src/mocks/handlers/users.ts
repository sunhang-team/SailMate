import { http, HttpResponse, delay } from 'msw';

import { createApiResponse } from '../utils';

import type { User, UserPublicProfile, UpdateProfileForm, UpdatePasswordResponseData } from '@/api/users/types';

const BASE = '/api/v1/users';

// 가짜 유저 데이터를 외부에 선언하여 PATCH 호출 시 상태가 유지되도록 합니다.
const mockUser: User = {
  id: 1,
  email: 'user@example.com',
  nickname: '마감왕',
  profileImage: 'https://avatars.githubusercontent.com/u/1?v=4',
  provider: 'EMAIL',
  reputationScore: 36.5,
  reputationLabel: '신뢰 메이트',
};

// 다른 유저(Public) 데이터 모의 생성
const getPublicUser = (userId: number): UserPublicProfile => ({
  id: userId,
  nickname: userId === 1 ? mockUser.nickname : `마감요정${userId}`,
  profileImage: userId === 1 ? mockUser.profileImage : 'https://avatars.githubusercontent.com/u/2?v=4',
  reputationScore: userId === 1 ? mockUser.reputationScore : 42.0,
  reputationLabel: userId === 1 ? mockUser.reputationLabel : '친절한 메이트',
});

export const usersHandlers = [
  /** GET /api/v1/users/me - 내 프로필 조회*/
  http.get(`${BASE}/me`, async () => {
    await delay(300);
    return HttpResponse.json(createApiResponse<User>(mockUser));
  }),

  /** PATCH /api/v1/users/me - 내 프로필 수정*/
  http.patch(`${BASE}/me`, async ({ request }) => {
    await delay(400); // 폼 제출 액션이므로 조금 더 길게 지연
    const body = (await request.json()) as UpdateProfileForm;

    // 임의의 프로필 데이터 업데이트
    if (body.nickname) mockUser.nickname = body.nickname;
    if (body.profileImage) mockUser.profileImage = body.profileImage;

    return HttpResponse.json(createApiResponse<User>(mockUser));
  }),

  /** PATCH /api/v1/users/me/password - 비밀번호 변경*/
  http.patch(`${BASE}/me/password`, async () => {
    await delay(400);

    // 성공 시 빈 객체 리턴
    return HttpResponse.json(createApiResponse<UpdatePasswordResponseData>({}));
  }),

  /** DELETE /api/v1/users/me - 회원 탈퇴*/
  http.delete(`${BASE}/me`, async () => {
    await delay(300);

    return new HttpResponse(null, { status: 204 });
  }),

  /** GET /api/v1/users/:userId - 다른 사람 프로필 조회*/
  http.get(`${BASE}/:userId`, async ({ params }) => {
    await delay(300);
    const userId = Number(params.userId);

    const publicProfile = getPublicUser(userId);

    return HttpResponse.json(createApiResponse<UserPublicProfile>(publicProfile));
  }),
];
