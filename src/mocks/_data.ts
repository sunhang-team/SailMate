// MSW 핸들러 공통 mock 상태.
// memberships / gatherings / achievements 핸들러가 같은 모임 ID에 대해 서로 다른 멤버 데이터를
// 들고 있어 페이지별로 불일치가 발생했음. 이 모듈을 단일 출처로 사용한다.

const avatarUrl = (id: number) => `https://avatars.githubusercontent.com/u/${id}?v=4`;

export const CURRENT_USER = {
  id: 1,
  nickname: '테스터',
  profileImage: avatarUrl(1),
} as const;

export interface SharedMember {
  userId: number;
  nickname: string;
  profileImage: string;
  role: 'LEADER' | 'MEMBER';
  overallAchievementRate: number;
  isActive: boolean;
}

// 현재 user(id=1)가 속한 모임 + 멤버 구성.
// 다른 모임(6, 8~30)은 이 맵에 없음 — 핸들러가 leader 1명만 자동 생성.
//
// ⚠ overallAchievementRate 동기화 규칙
// mockTodos에 todo가 있는 user(현재 1·2·3)는 todos.ts의 완료 비율과 일치해야 함.
//   user 1 → 9/10 = 90, user 2 → 7/10 = 70, user 3 → 8/10 = 80
// todos가 없는 user는 임의 값 사용 (achievements 핸들러가 합성)
export const GATHERING_MEMBERS: Record<number, SharedMember[]> = {
  // React 19 & Next.js — user 1이 LEADER
  1: [
    {
      userId: 1,
      nickname: '테스터',
      profileImage: avatarUrl(1),
      role: 'LEADER',
      overallAchievementRate: 90,
      isActive: true,
    },
    {
      userId: 2,
      nickname: '이개발',
      profileImage: avatarUrl(2),
      role: 'MEMBER',
      overallAchievementRate: 70,
      isActive: true,
    },
    {
      userId: 3,
      nickname: '박디자인',
      profileImage: avatarUrl(3),
      role: 'MEMBER',
      overallAchievementRate: 80,
      isActive: true,
    },
    {
      userId: 4,
      nickname: '최풀스택',
      profileImage: avatarUrl(4),
      role: 'MEMBER',
      overallAchievementRate: 78,
      isActive: true,
    },
  ],
  // SaaS 사이드 프로젝트 — user 1이 MEMBER
  2: [
    {
      userId: 5,
      nickname: '박프로',
      profileImage: avatarUrl(5),
      role: 'LEADER',
      overallAchievementRate: 88,
      isActive: true,
    },
    {
      userId: 1,
      nickname: '테스터',
      profileImage: avatarUrl(1),
      role: 'MEMBER',
      overallAchievementRate: 90,
      isActive: true,
    },
    {
      userId: 6,
      nickname: '백엔드러',
      profileImage: avatarUrl(6),
      role: 'MEMBER',
      overallAchievementRate: 72,
      isActive: true,
    },
    {
      userId: 7,
      nickname: '데보옵',
      profileImage: avatarUrl(7),
      role: 'MEMBER',
      overallAchievementRate: 80,
      isActive: true,
    },
  ],
  // Spring Boot 심화 — user 1이 MEMBER
  3: [
    {
      userId: 3,
      nickname: '이개발',
      profileImage: avatarUrl(3),
      role: 'LEADER',
      overallAchievementRate: 80,
      isActive: true,
    },
    {
      userId: 1,
      nickname: '테스터',
      profileImage: avatarUrl(1),
      role: 'MEMBER',
      overallAchievementRate: 90,
      isActive: true,
    },
    {
      userId: 8,
      nickname: 'DB마스터',
      profileImage: avatarUrl(8),
      role: 'MEMBER',
      overallAchievementRate: 68,
      isActive: true,
    },
    {
      userId: 9,
      nickname: 'JPA전문가',
      profileImage: avatarUrl(9),
      role: 'MEMBER',
      overallAchievementRate: 80,
      isActive: true,
    },
    {
      userId: 10,
      nickname: 'Redis왕',
      profileImage: avatarUrl(10),
      role: 'MEMBER',
      overallAchievementRate: 70,
      isActive: true,
    },
    {
      userId: 11,
      nickname: 'Kafka잘함',
      profileImage: avatarUrl(11),
      role: 'MEMBER',
      overallAchievementRate: 85,
      isActive: true,
    },
    {
      userId: 12,
      nickname: '백엔드신입',
      profileImage: avatarUrl(12),
      role: 'MEMBER',
      overallAchievementRate: 55,
      isActive: true,
    },
  ],
  // 영어 회화 — user 1이 LEADER
  4: [
    {
      userId: 1,
      nickname: '테스터',
      profileImage: avatarUrl(1),
      role: 'LEADER',
      overallAchievementRate: 90,
      isActive: true,
    },
    {
      userId: 15,
      nickname: '영어왕',
      profileImage: avatarUrl(15),
      role: 'MEMBER',
      overallAchievementRate: 88,
      isActive: true,
    },
    {
      userId: 16,
      nickname: '회화초보',
      profileImage: avatarUrl(16),
      role: 'MEMBER',
      overallAchievementRate: 60,
      isActive: true,
    },
  ],
  // 독서 기록 앱 만들기 — user 1이 MEMBER (COMPLETED, 리뷰 작성 대상)
  7: [
    {
      userId: 6,
      nickname: '책벌레',
      profileImage: avatarUrl(6),
      role: 'LEADER',
      overallAchievementRate: 95,
      isActive: true,
    },
    {
      userId: 1,
      nickname: '테스터',
      profileImage: avatarUrl(1),
      role: 'MEMBER',
      overallAchievementRate: 90,
      isActive: true,
    },
    {
      userId: 17,
      nickname: '독서광',
      profileImage: avatarUrl(17),
      role: 'MEMBER',
      overallAchievementRate: 78,
      isActive: true,
    },
    {
      userId: 18,
      nickname: '책좋아',
      profileImage: avatarUrl(18),
      role: 'MEMBER',
      overallAchievementRate: 90,
      isActive: true,
    },
  ],
};

export const getGatheringMemberCount = (gatheringId: number): number => GATHERING_MEMBERS[gatheringId]?.length ?? 1;

export const getCurrentUserRole = (gatheringId: number): 'LEADER' | 'MEMBER' | undefined =>
  GATHERING_MEMBERS[gatheringId]?.find((m) => m.userId === CURRENT_USER.id)?.role;
