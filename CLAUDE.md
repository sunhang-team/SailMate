# 완성도 (스터디, 프로젝트 모임 서비스)

## 빌드 & 실행

- `npm install` → 의존성 설치
- `npm run dev` → 개발 서버
- `npm run build` → 프로덕션 빌드
- `npm run lint` → ESLint 검사
- `npm run storybook` → Storybook 개발 서버

## 검증

- 코드 변경 후 반드시 `npm run build`로 빌드 확인
- 린트: `npm run lint`
- 타입 체크: `npx tsc --noEmit`
- 단위 테스트: `npx jest` (단일 파일: `npx jest path/to/file`)
- E2E 테스트: `npx playwright test`
- **IMPORTANT**: 전체 테스트 대신 관련 파일만 단일 실행 선호

## 기술 스택

- Next.js 16 (App Router), React 19, TypeScript strict
- TanStack Query v5, Zustand (클라이언트 상태), react-hook-form + Zod
- Axios (클라이언트), fetch (서버)
- TailwindCSS v4, CVA, clsx, tailwind-merge
- Storybook 10

## 아키텍처 원칙

- **IMPORTANT**: page.tsx, layout.tsx는 항상 서버 컴포넌트 유지
- **MUST**: 'use client'는 인터랙션이 필요한 말단(leaf) 컴포넌트에만 선언
- 서버에서 fetch 가능하면 서버에서. 클라이언트 fetch는 최후 수단
- 병렬 fetch는 Promise.all 필수

## 렌더링 & 캐싱 전략

- 상세 규칙: @.claude/rules/rendering.md
- 공개 데이터: 서버 prefetchQuery + HydrationBoundary + 클라이언트 useQuery
- 유저별 데이터: 클라이언트 useSuspenseQuery + Suspense 경계
- API 호출 있는 컴포넌트: ErrorBoundary로 에러 격리
- Mutation 성공 시 이중 캐시 무효화: invalidateQueries + revalidateTag

## TanStack Query

- 상세 규칙: @.claude/rules/tanstack-query.md

## Git 컨벤션

- 브랜치: `feat/SM-XX`, `fix/SM-XX`, `chore/SM-XX` (Jira 이슈 키 기반)
- 커밋: Conventional Commits (`feat:`, `fix:`, `chore:`, `style:`, `refactor:`, `docs:`)
- Jira 이슈 키: SM-XX 형식
- **IMPORTANT**: PR은 Squash and Merge만 사용 (PR 제목 = 최종 커밋 메시지)
- PR 전 base 브랜치(dev) 최신화: `git fetch origin && git rebase origin/dev`
- 충돌 발생 시: 충돌 해결 → `git add .` → `git rebase --continue`

## 코드 스타일

- 상세 규칙: @.claude/rules/code-style.md
- 함수 선언: 컴포넌트/페이지는 `function`, 나머지(훅, 유틸, API 등)는 화살표 함수
- named export 사용 (default export는 page.tsx, layout.tsx만)
- 컴포넌트는 폴더로 관리: `ComponentName/index.tsx`, `index.test.tsx`, `index.stories.tsx`
- 훅 파일명: `useCamelCase.ts`
- 타입은 interface 우선 (type은 유니온/교차 시만)
- Props interface는 같은 파일, 컴포넌트 바로 위에 선언

## 폴더 구조

```
src/
├── app/                    # Next.js App Router (페이지, 레이아웃)
├── components/             # 공통 컴포넌트
│   └── GatheringCard/      # 컴포넌트 폴더 단위
│       ├── index.tsx
│       ├── index.test.tsx
│       └── index.stories.tsx
├── hooks/                  # 공통 커스텀 훅
├── stores/                 # Zustand 스토어
├── lib/                    # 유틸리티, 헬퍼
├── types/                  # 공통 타입 정의
├── api/                    # API 관련
│   └── users/              # 도메인별 폴더
│       ├── index.ts        # API 함수
│       ├── types.ts        # 요청/응답 타입
│       ├── schemas.ts      # Zod 스키마
│       └── queries.ts      # queryKey, queryFn
└── actions/                # Server Actions
```
