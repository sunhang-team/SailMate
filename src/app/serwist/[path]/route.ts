import { createSerwistRoute } from '@serwist/turbopack';

// Serwist(turbopack): src/app/sw.ts를 esbuild로 컴파일해 /serwist/sw.js로 서빙한다.
// (webpack 플러그인 대신 route handler 방식 — Next 16 Turbopack 호환)
// L2에서 오프라인 폴백을 도입할 때 additionalPrecacheEntries로 /offline 등을 추가한다.
export const { dynamic, dynamicParams, revalidate, generateStaticParams, GET } = createSerwistRoute({
  swSrc: 'src/app/sw.ts',
  useNativeEsbuild: true,
});
