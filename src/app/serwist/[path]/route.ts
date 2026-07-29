import { spawnSync } from 'node:child_process';

import { createSerwistRoute } from '@serwist/turbopack';

// Serwist(turbopack): src/app/sw.ts를 esbuild로 컴파일해 /serwist/sw.js로 서빙한다.
// (webpack 플러그인 대신 route handler 방식 — Next 16 Turbopack 호환)

// 프리캐시 버스팅용 revision. 배포(커밋)마다 바뀌어 /~offline이 최신으로 갱신된다.
// .git이 없는 환경(일부 배포)에서는 임의값으로 폴백.
const revision = spawnSync('git', ['rev-parse', 'HEAD'], { encoding: 'utf-8' }).stdout?.trim() || crypto.randomUUID();

export const { dynamic, dynamicParams, revalidate, generateStaticParams, GET } = createSerwistRoute({
  // L2 오프라인 폴백 페이지를 프리캐시 (sw.ts의 fallbacks가 이 URL을 가리킴)
  additionalPrecacheEntries: [{ url: '/~offline', revision }],
  // /images/landing/* 은 파일명에 공백이 있어(예: "Route 1-PC.png") SW 프리캐시 fetch가
  // 308 리다이렉트로 실패 → install 전체가 깨짐(엔트리 하나라도 비200이면 실패).
  // 랜딩 장식 이미지라 오프라인에 불필요하므로 제외한다.
  // (로고 /images/logo.svg 등 공백 없는 정적 이미지는 그대로 precache → 오프라인 보장)
  manifestTransforms: [
    (entries) => ({
      manifest: entries.filter((entry) => !entry.url.includes('/images/landing/')),
      warnings: [],
    }),
  ],
  swSrc: 'src/app/sw.ts',
  useNativeEsbuild: true,
});
