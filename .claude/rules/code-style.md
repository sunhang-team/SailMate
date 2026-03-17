---
paths:
  - 'src/**/*.tsx'
  - 'src/**/*.ts'
---

# 코드 스타일 규칙

## 함수 선언 스타일

- 컴포넌트, 페이지: **function 선언문** 사용
- 훅, 유틸리티, API 함수, 스키마 등 나머지: **화살표 함수** 사용

## 파일 & 폴더 명명

- 컴포넌트: PascalCase 폴더 + index.tsx (예: `GatheringCard/index.tsx`)
- 훅: useCamelCase.ts (예: `useJoinGathering.ts`)
- 유틸리티: camelCase.ts (예: `formatDate.ts`)
- API: 도메인별 폴더 (예: `api/users/index.ts`)
- Server Action: camelCase.ts (예: `cache.ts`)

## Export

- named export 기본 (예: `export function GatheringCard()`)
- default export는 page.tsx, layout.tsx, loading.tsx, error.tsx만

## TypeScript

- strict 모드 사용
- any 사용 금지. unknown 후 타입 가드 사용
- interface 우선 (type은 유니온, 교차 타입 시만)
- Props interface는 같은 파일, 컴포넌트 바로 위에 선언

## 컴포넌트 구조

- `'use client'`는 파일 최상단, 첫 줄에만
- 컴포넌트는 폴더 단위로 관리 (index.tsx, index.test.tsx, index.stories.tsx)
- Props destructuring은 함수 파라미터에서
- early return 활용 (조건부 렌더링보다 우선)

## import 순서

1. React / Next.js (`react`, `next/*`)
2. 외부 라이브러리 (`@tanstack/*`, `zustand`, `zod`, `axios` 등)
3. 내부 모듈 (`@/components/*`, `@/hooks/*`, `@/lib/*`, `@/api/*` 등)
4. 상대 경로 (`./`, `../`)
5. 타입 import (`import type`)

- 각 그룹 사이에 빈 줄 구분
