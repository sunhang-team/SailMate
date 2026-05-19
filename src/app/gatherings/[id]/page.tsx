import { Suspense } from 'react';

import { ErrorBoundary } from '@/components/ErrorBoundary';
import { fetchGatheringDetail } from '@/api/gatherings';
import { JsonLd } from '@/components/seo/JsonLd';
import {
  OG_IMAGES,
  SITE_DESCRIPTION,
  SITE_NAME,
  TWITTER_IMAGE_PATH,
  buildGatheringEventJsonLd,
  getDefaultOpenGraph,
} from '@/lib/seo';
import { GatheringHero } from './_components/GatheringHero';
import { GatheringDetailContainer } from './_components/GatheringDetailContainer';
import { GatheringDetailSkeleton } from './_components/GatheringDetailSkeleton';
import { GatheringDetailTracker } from './_components/GatheringDetailTracker';
import { MainGatheringStreaming } from './_components/GatheringStreaming';

import type { Metadata } from 'next';
import type { GatheringDetail } from '@/api/gatherings/types';

interface GatheringDetailPageProps {
  params: Promise<{ id: string }>;
}

const truncateDescription = (raw: string): string => {
  const compact = raw.replace(/\s+/g, ' ').trim();
  if (compact.length <= 160) return compact;
  return `${compact.slice(0, 159)}…`;
};

export const generateMetadata = async ({ params }: GatheringDetailPageProps): Promise<Metadata> => {
  const { id } = await params;
  const gatheringId = Number(id);

  if (Number.isNaN(gatheringId)) {
    return { title: '모임', robots: { index: false, follow: false } };
  }

  try {
    const detail = await fetchGatheringDetail(gatheringId);
    const description = truncateDescription(detail.shortDescription || detail.description || SITE_DESCRIPTION);
    const heroImage = detail.images?.[0]?.url;
    const canonical = `/gatherings/${gatheringId}`;
    const ogTitle = `${detail.title} | ${SITE_NAME}`;

    return {
      title: detail.title,
      description,
      alternates: { canonical },
      openGraph: {
        ...getDefaultOpenGraph(),
        type: 'article',
        url: canonical,
        title: ogTitle,
        description,
        images: heroImage ? [{ url: heroImage }] : OG_IMAGES.map((img) => ({ ...img })),
      },
      twitter: {
        card: 'summary_large_image',
        title: ogTitle,
        description,
        images: [heroImage ?? TWITTER_IMAGE_PATH],
      },
    };
  } catch {
    return { title: '모임', robots: { index: false, follow: false } };
  }
};

export default async function GatheringDetailPage({ params }: GatheringDetailPageProps) {
  const { id } = await params;
  const gatheringId = Number(id);

  let detail: GatheringDetail | null = null;
  if (!Number.isNaN(gatheringId)) {
    try {
      detail = await fetchGatheringDetail(gatheringId);
    } catch {
      // SSR fetch 실패 시 클라이언트 스트리밍 컴포넌트가 자체 fallback 렌더
    }
  }

  return (
    <main className='mb-20 min-h-screen'>
      {detail && <JsonLd data={buildGatheringEventJsonLd(detail)} />}
      {!Number.isNaN(gatheringId) && <GatheringDetailTracker gatheringId={gatheringId} />}
      <MainGatheringStreaming>
        <GatheringDetailContainer gatheringId={gatheringId} />
      </MainGatheringStreaming>
    </main>
  );
}
