import { withSentryConfig } from '@sentry/nextjs';
import type { NextConfig } from 'next';
import type { Configuration, RuleSetRule } from 'webpack';

const nextConfig: NextConfig = {
  transpilePackages: ['until-async'],
  webpack(config: Configuration) {
    const rules = config.module?.rules as RuleSetRule[] | undefined;

    if (!rules) {
      return config;
    }

    const fileLoaderRule = rules.find(
      (rule) => rule && typeof rule === 'object' && rule.test instanceof RegExp && rule.test.test('.svg'),
    );

    if (fileLoaderRule && typeof fileLoaderRule === 'object') {
      fileLoaderRule.exclude = /\.svg$/i;
    }

    rules.push({
      test: /\.svg$/i,
      issuer: /\.[jt]sx?$/,
      use: ['@svgr/webpack'],
    });

    return config;
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
