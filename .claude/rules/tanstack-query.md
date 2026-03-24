---
paths:
  - 'src/**/*.tsx'
  - 'src/**/*.ts'
  - 'src/api/**/*.ts'
---

# TanStack Query 규칙

## QueryClient 설정

- 서버: 요청마다 새로 생성 (getQueryClient → React.cache)
- 클라이언트: 싱글턴 재사용 (useState로 생성)
- defaultOptions.queries.staleTime: 60 \* 1000 (1분) 이상 필수

## queryKey 관리

- `src/api/도메인별/queries.ts`에서 팩토리 패턴으로 중앙 정의
- 서버 prefetchQuery와 클라이언트 useQuery의 queryKey 정확히 일치
- 키 불일치 = 캐시 미스 = prefetch 무의미
- 팩토리 구조: `all → list(filters) → detail(id)` 계층으로 구성하고 `as const` 사용

## prefetch 패턴 (서버 컴포넌트)

- queryFn에 fetch 사용 (axios 금지), `next: { tags }` 로 Data Cache 태그 지정
- 병렬 prefetch: Promise.all 필수
- HydrationBoundary로 감싸서 클라이언트에 전달

## 클라이언트 Query 패턴

- **prefetch된 데이터 이어받기**: useQuery에 동일 queryKey 사용 → 캐시 히트로 isLoading = false
- **유저별 데이터 (prefetch 없음)**: useSuspenseQuery 사용 → Suspense 연동 자동 로딩 처리
- 클라이언트 queryFn에서는 axios 인스턴스 사용 가능

## Mutation + 이중 캐시 무효화

- mutation 성공 시 반드시 클라이언트 + 서버 캐시 둘 다 무효화
- `invalidateQueries` → 현재 유저 화면 즉시 갱신
- `updateTag` (Server Action) → 서버 Data Cache 무효화, 다른 유저도 최신 데이터
- invalidateQueries만 → 새로고침 시 옛날 데이터 / updateTag만 → 현재 유저는 새로고침 필요

## Mutation 콜백 분리 패턴

| 위치                            | 담당                       | 이유                                   |
| ------------------------------- | -------------------------- | -------------------------------------- |
| `useMutation` 레벨 (훅 내부)    | 캐시 무효화, 데이터 동기화 | unmount 여부와 관계없이 항상 실행      |
| `mutate()` 호출 레벨 (컴포넌트) | toast, redirect 등 UI 콜백 | unmount 시 실행 안 됨 → UI 콜백에 적합 |

- 훅 내부 onSuccess에는 이중 캐시 무효화만 포함
- UI 부수효과(toast, navigate)를 훅 내부에 하드코딩 금지
- `UseMutationOptions` 파라미터로 소비자 콜백 주입 가능하도록 설계

## mutate vs mutateAsync

- 기본은 `mutate` 사용 (에러를 콜백으로 처리, 별도 try-catch 불필요)
- `mutateAsync`는 여러 mutation을 `Promise.all`로 병렬 실행할 때만 사용

## startTransition으로 Suspense fallback 깜빡임 방지

- `useSuspenseQuery`의 queryKey가 변경될 때 `startTransition`으로 감싸서 이전 UI 유지
- 필터/정렬/탭 전환 시 스켈레톤이 매번 깜빡이는 것을 방지
- `startTransition` 없이 queryKey 변경 → Suspense fallback 재노출 → UX 저하

## 낙관적 업데이트 (찜 등 즉각 반응 필요 시)

- onMutate: cancelQueries → getQueryData(이전값 저장) → setQueryData(낙관적 변경)
- onError: 이전값으로 롤백
- onSettled: invalidateQueries + updateTag로 서버/클라이언트 둘 다 최종 동기화

## 주의사항

- staleTime = 0이면 클라이언트 도착 즉시 재요청 → prefetch 의미 없음
- useOptimistic과 TanStack Query를 같은 데이터에 혼용 금지 (충돌)
- 서버 컴포넌트에서 useQuery/useMutation 사용 불가 (React 훅이므로)
