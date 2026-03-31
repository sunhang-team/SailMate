import { withSentryConfig } from '@sentry/nextjs';
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  transpilePackages: ['until-async'],
  serverExternalPackages: ['msw'],
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
