import { http, HttpResponse, delay } from 'msw';

import { createApiResponse } from '../utils';
import { CURRENT_USER } from '../_data';

import type { User, UserPublicProfile, UpdateProfileResponseData, UpdatePasswordResponseData } from '@/api/users/types';

const BASE = '/api/v1/users';

// 가짜 유저 데이터 — auth.ts 로그인 핸들러 응답과 동일한 nickname을 사용.
const mockUser: User = {
  id: CURRENT_USER.id,
  email: 'user@example.com',
  nickname: CURRENT_USER.nickname,
  profileImage: CURRENT_USER.profileImage,
  provider: 'EMAIL',
  reputationScore: 36.5,
  reputationLabel: '신뢰 메이트',
  completedGatherings: 1, // GATHERING_MEMBERS[7]만 COMPLETED 상태
  avgAchievementRate: 90, // todos 9/10 = 90 (achievements.ts와 일치)
  reviewCount: 3,
};

// 공통으로 사용될 수 있는 유저 이름 목록 — 본인(id 1)은 CURRENT_USER와 동기화.
const MOCK_NICKNAMES: Record<number, string> = {
  1: CURRENT_USER.nickname,
  2: '이개발',
  3: '박디자인',
  4: '최풀스택',
  5: '박프로',
  6: '백엔드러',
  7: '데보옵',
  8: 'DB마스터',
  9: 'JPA전문가',
  10: 'Redis왕',
  11: 'Kafka잘함',
  12: '백엔드신입',
  15: '영어왕',
  16: '회화초보',
  17: '독서광',
  18: '책좋아',
  20: '책리더',
  21: '박개발',
  22: '신입주니어',
  23: '전직백엔드',
  24: '디자이너지망',
  30: '일본어마스터',
  31: '합격러',
  32: 'DB러버',
  33: '토익900',
};

// 다른 유저(Public) 데이터 모의 생성
const getPublicUser = (userId: number): UserPublicProfile => {
  const nickname = MOCK_NICKNAMES[userId] || `마감요정${userId}`;
  return {
    id: userId,
    nickname: userId === 1 ? mockUser.nickname : nickname,
    profileImage: userId === 1 ? mockUser.profileImage : `https://avatars.githubusercontent.com/u/${userId}?v=4`,
    reputationScore: Number((30 + (userId % 70)).toFixed(1)),
    reputationLabel: userId % 2 === 0 ? '불꽃 메이트' : '불씨 메이트',
    reviews: [
      {
        id: 101,
        reviewer: { id: 99, nickname: '열정맨' },
        gatheringTitle: 'React 완전 정복 스터디',
        tags: ['성실해요', '소통이 좋아요'],
        comment: '항상 열심히 참여해주셨어요!',
        createdAt: '2025-04-20T10:00:00Z',
      },
      {
        id: 102,
        reviewer: { id: 100, nickname: '친절한개발자' },
        gatheringTitle: 'Next.js 팀 프로젝트',
        tags: ['잘 도와줘요', '다시 함께하고 싶어요'],
        comment: '덕분에 많이 배웠습니다.',
        createdAt: '2025-04-21T15:30:00Z',
      },
      {
        id: 103,
        reviewer: { id: 101, nickname: '타입스크립트장인' },
        gatheringTitle: '알고리즘 코테 스터디',
        tags: ['시간을 잘 지켜요', '성실해요'],
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

  /** PATCH /api/v1/users/me - 내 프로필 수정 (multipart/form-data) */
  http.patch(`${BASE}/me`, async ({ request }) => {
    await delay(400);
    const formData = await request.formData();

    const nickname = formData.get('nickname');
    const profileImage = formData.get('profileImage');

    if (typeof nickname === 'string') mockUser.nickname = nickname;
    if (profileImage instanceof File) mockUser.profileImage = `https://example.com/${profileImage.name}`;

    const responseData: UpdateProfileResponseData = {
      id: mockUser.id,
      nickname: mockUser.nickname,
      profileImage: mockUser.profileImage,
    };

    return HttpResponse.json(createApiResponse<UpdateProfileResponseData>(responseData));
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
