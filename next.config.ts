import { withSentryConfig } from '@sentry/nextjs';
import { withSerwist } from '@serwist/turbopack';
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  transpilePackages: ['until-async'],
  serverExternalPackages: ['msw'],

  async rewrites() {
    const backendBaseUrl = process.env.BACKEND_BASE_URL?.replace(/\/+$/, '');
    if (!backendBaseUrl) return [];
    return [
      {
        source: '/images/:path*',
        destination: `${backendBaseUrl}/images/:path*`,
      },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'img1.kakaocdn.net',
      },
      {
        protocol: 'https',
        hostname: 'img1.kakaocdn.net',
      },
      {
        protocol: 'http',
        hostname: 't1.kakaocdn.net',
      },
      {
        protocol: 'https',
        hostname: 't1.kakaocdn.net',
      },
      {
        protocol: 'https',
        hostname: 'chukjibeob.store',
      },
      {
        protocol: 'https',
        hostname: 'sailmate.store',
      },
      // prod에 MSW용 호스트가 섞이지 않도록 NODE_ENV로 이중 가드.
      ...(process.env.NODE_ENV !== 'production' && process.env.NEXT_PUBLIC_MSW_ENABLED === 'true'
        ? [
            { protocol: 'https' as const, hostname: 'avatars.githubusercontent.com' },
            { protocol: 'https' as const, hostname: 'placehold.co' },
          ]
        : []),
    ],
  },
};

// Serwist(turbopack): swSrc 컴파일·SW 서빙은 app/serwist/[path]/route.ts에서 처리.
// 여기서는 turbopack 통합만 활성화한다. Sentry는 바깥에서 감싼다.
export default withSentryConfig(withSerwist(nextConfig), {
  org: 'completionisland',
  project: 'javascript-nextjs',
  silent: !process.env.CI,
  widenClientFileUpload: true,
  webpack: {
    automaticVercelMonitors: true,
    treeshake: {
      removeDebugLogging: true,
    },
  },
});
