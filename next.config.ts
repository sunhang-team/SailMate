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
