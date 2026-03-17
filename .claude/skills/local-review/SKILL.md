---
name: local-review
description: 프로젝트 규칙 기반 코드 리뷰 수행
disable-model-invocation: true
allowed-tools: Read, Grep, Glob, Bash(gh *)
---

현재 변경된 파일들을 프로젝트 규칙 기준으로 리뷰해줘.

## 리뷰 체크리스트

### 1. 서버/클라이언트 분리 (CRITICAL)

- page.tsx, layout.tsx에 'use client' 없는지
- 'use client'가 말단 컴포넌트에만 있는지
- 인터랙션 없는 컴포넌트가 불필요하게 클라이언트인지
- 서버 컴포넌트에서 useQuery, useState 등 훅 사용하지 않는지

### 2. 데이터 Fetch 패턴 (CRITICAL)

- 공개 데이터: prefetchQuery + HydrationBoundary + useQuery 패턴인지
- 유저별 데이터: useSuspenseQuery + SuspenseBoundary인지
- 서버에서 fetch 사용하는지 (axios 사용 금지)
- 클라이언트에서 axios 사용하는지
- 병렬 fetch에 Promise.all 사용하는지

### 3. 캐싱 & 무효화 (HIGH)

- 서버 fetch에 next: { tags } 지정했는지
- mutation 시 이중 무효화 (invalidateQueries + revalidateTag) 하는지
- staleTime > 0 설정했는지
- queryKey가 서버/클라이언트에서 일치하는지

### 4. ErrorBoundary / SuspenseBoundary (HIGH)

- API 호출 있는 컴포넌트에 ErrorBoundary 있는지
- prefetch 없는 클라이언트 컴포넌트에 SuspenseBoundary 있는지
- 섹션 단위로 개별 감싸고 있는지 (페이지 전체 X)

### 5. 코드 스타일 (MEDIUM)

- named export 사용하는지 (page.tsx 제외)
- TypeScript strict: any 사용하지 않는지
- interface로 Props 정의했는지
- 파일 명명 규칙 (PascalCase, useCamelCase)

### 6. 보안 (HIGH)

- 서버 전용 코드 (API 키, DB 접근)가 클라이언트에 유출되지 않는지
- process.env를 클라이언트 컴포넌트에서 직접 사용하지 않는지

## 참조 문서

- 렌더링 규칙: @.claude/rules/rendering.md
- TanStack Query 규칙: @.claude/rules/tanstack-query.md
- 코드 스타일: @.claude/rules/code-style.md

## 출력 형식

발견된 이슈를 심각도별로 정리:

- **CRITICAL**: 반드시 수정 필요
- **HIGH**: 수정 권장
- **MEDIUM**: 개선 제안
- **OK**: 문제 없음 (체크리스트 통과 항목)
