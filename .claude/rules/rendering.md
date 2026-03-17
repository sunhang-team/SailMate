---
paths:
  - 'src/app/**/*.tsx'
  - 'src/app/**/*.ts'
  - 'src/components/**/*.tsx'
---

# 렌더링 & 캐싱 규칙

## 페이지별 렌더링 전략

| 페이지       | 렌더링 | 캐시                                            | 비고                                     |
| ------------ | ------ | ----------------------------------------------- | ---------------------------------------- |
| 랜딩         | Static | 없음                                            | 정적 페이지                              |
| 로그인       | Static | 없음                                            | 폼은 클라이언트 컴포넌트                 |
| 회원가입     | Static | 없음                                            | 폼은 클라이언트 컴포넌트                 |
| 메인         | ISR    | 온디맨드(revalidateTag) + revalidate: 3600 보험 | prefetchQuery + HydrationBoundary        |
| 모임 상세    | ISR    | 온디맨드(revalidateTag) + revalidate: 3600 보험 | 모임 설명, 주차별 계획 등 정적 정보 캐시 |
| 그 외 페이지 | 미정   | 미정                                            | 추후 확정                                |

## 서버/클라이언트 컴포넌트 분리

### 서버 컴포넌트로 유지

- page.tsx, layout.tsx (항상)
- 텍스트/이미지 표시만 하는 컴포넌트
- SEO가 중요한 콘텐츠
- header, nav, footer

### 클라이언트 컴포넌트로 분리

- useState, useEffect, onClick 등 인터랙션이 필요한 컴포넌트
- useQuery, useMutation 등 TanStack Query 훅 사용 컴포넌트
- 폼 컴포넌트 (react-hook-form)
- 브라우저 API 사용 컴포넌트 (localStorage, window 등)

## 데이터 페칭 패턴

### 공개 데이터 (인증 불필요)

- page.tsx에서 getQueryClient() → prefetchQuery (queryFn에 fetch + next.tags 지정) → HydrationBoundary로 감싸기
- 클라이언트 컴포넌트에서 동일한 queryKey로 useQuery → 캐시 히트

### 유저별 데이터 (인증 필요)

- page.tsx에서 SuspenseBoundary로 감싸기 (fallback: Skeleton, errorFallback: ErrorFallback)
- 클라이언트 컴포넌트에서 useSuspenseQuery → Suspense 연동 자동 로딩 처리

## ErrorBoundary / SuspenseBoundary 사용 규칙

| 상황          | 감싸는 것        | 이유                                      |
| ------------- | ---------------- | ----------------------------------------- |
| prefetch 있음 | ErrorBoundary    | 로딩 없음 (이미 데이터 있음), 에러만 대비 |
| prefetch 없음 | SuspenseBoundary | 로딩 + 에러 둘 다 필요                    |
| API 호출 없음 | 불필요           | 에러 날 일 없음                           |

- 섹션 단위로 ErrorBoundary/SuspenseBoundary를 감싸서 에러가 페이지 전체를 깨뜨리지 않도록 격리

## 주의사항

- **MUST**: 서버에서 axios 사용 금지 (Next.js Data Cache 연동 불가, fetch만 사용)
- **MUST**: page.tsx에서 직접 useQuery 금지 (서버 컴포넌트)
- Mutation 성공 시 이중 캐시 무효화: invalidateQueries + revalidateTag
