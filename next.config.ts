import { withSentryConfig } from '@sentry/nextjs';
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
    ],
  },
};

export default withSentryConfig(nextConfig, {
  org: 'completionisland',
  project: 'javascript-nextjs',
  silent: !process.env.CI,
  widenClientFileUpload: true,
  automaticVercelMonitors: true,
  webpack: {
    treeshake: {
      removeDebugLogging: true,
    },
  },
});
