import { fetchGatheringsForSitemap } from '@/api/gatherings';
import { getSiteUrl } from '@/lib/seo';

import type { MetadataRoute } from 'next';

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = getSiteUrl();
  const now = new Date();

  const staticEntries: MetadataRoute.Sitemap = [
    { url: `${baseUrl}/`, lastModified: now, changeFrequency: 'daily', priority: 1.0 },
    { url: `${baseUrl}/main`, lastModified: now, changeFrequency: 'hourly', priority: 0.9 },
    { url: `${baseUrl}/gatherings`, lastModified: now, changeFrequency: 'hourly', priority: 0.8 },
  ];

  const gatherings = await fetchGatheringsForSitemap();
  const gatheringEntries: MetadataRoute.Sitemap = gatherings.map(({ id }) => ({
    url: `${baseUrl}/gatherings/${id}`,
    lastModified: now,
    changeFrequency: 'daily',
    priority: 0.7,
  }));

  return [...staticEntries, ...gatheringEntries];
}
