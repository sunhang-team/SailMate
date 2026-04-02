import { http, HttpResponse, delay } from 'msw';

import { createApiResponse } from '../utils';

import type { User, UserPublicProfile, UpdateProfileForm, UpdatePasswordResponseData } from '@/api/users/types';

const BASE = '/api/v1/users';

// 가짜 유저 데이터를 외부에 선언하여 PATCH 호출 시 상태가 유지되도록 합니다.
const mockUser: User = {
  id: 1,
  email: 'user@example.com',
  nickname: '김코딩',
  profileImage: 'https://avatars.githubusercontent.com/u/1?v=4',
  provider: 'EMAIL',
  reputationScore: 36.5,
  reputationLabel: '신뢰 메이트',
};

// 공통으로 사용될 수 있는 유저 이름 목록
const MOCK_NICKNAMES: Record<number, string> = {
  1: '김코딩',
  2: '이개발',
  3: '박프로',
  4: '최모바일',
  5: '일본어마스터',
  6: '책벌레',
  7: '합격러',
  8: 'DB마스터',
  10: '김민수',
  11: '최서연',
  12: '박수철',
  13: '이수태',
  14: '김경아',
  15: '정수진',
};

// 다른 유저(Public) 데이터 모의 생성
const getPublicUser = (userId: number): UserPublicProfile => {
  const nickname = MOCK_NICKNAMES[userId] || `마감요정${userId}`;
  return {
    id: userId,
    nickname: userId === 1 ? mockUser.nickname : nickname,
    profileImage: userId === 1 ? mockUser.profileImage : `https://avatars.githubusercontent.com/u/${userId}?v=4`,
    reputationScore: (30 + (userId % 70)).toFixed(1) as unknown as number,
    reputationLabel: userId % 2 === 0 ? '불꽃 메이트' : '불씨 메이트',
    reviews: [
      {
        id: 101,
        reviewer: { id: 99, nickname: '열정맨' },
        gatheringTitle: 'React 완전 정복 스터디',
        tags: ['소통이 좋아요', '다시 함께하고 싶어요'],
        comment: '항상 열심히 참여해주셨어요!',
        createdAt: '2025-04-20T10:00:00Z',
      },
      {
        id: 102,
        reviewer: { id: 100, nickname: '친절한개발자' },
        gatheringTitle: 'Next.js 팀 프로젝트',
        tags: ['소통이 좋아요', '다시 함께하고 싶어요'],
        comment: '덕분에 많이 배웠습니다.',
        createdAt: '2025-04-21T15:30:00Z',
      },
      {
        id: 103,
        reviewer: { id: 101, nickname: '타입스크립트장인' },
        gatheringTitle: '알고리즘 코테 스터디',
        tags: ['시간을 잘 지켜요', '다시 함께하고 싶어요'],
        comment: '시간 엄수 최고입니다!',
        createdAt: '2025-04-22T09:15:00Z',
      },
    ],
  };
};

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
