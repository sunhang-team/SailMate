import { getSiteUrl } from '@/lib/seo';

import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = getSiteUrl();
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/api/',
          '/my',
          '/auth/',
          '/login',
          '/register',
          '/gatherings/new',
          '/gatherings/*/edit',
          '/gatherings/*/dashboard',
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  };
}
