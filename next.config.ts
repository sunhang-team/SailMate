import { withSentryConfig } from '@sentry/nextjs';
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {};

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
