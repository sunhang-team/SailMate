import { LandingCoreFeatures } from '@/components/landing/LandingCoreFeatures';
import { LandingFinalCta } from '@/components/landing/LandingFinalCta';
import { LandingHero } from '@/components/landing/LandingHero';
import { LandingHowToUse } from '@/components/landing/LandingHowToUse';

import { getDefaultOpenGraph } from '@/lib/seo';

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '함께 완주하는 스터디·프로젝트 모임',
  alternates: { canonical: '/' },
  openGraph: {
    ...getDefaultOpenGraph(),
    url: '/',
    title: '함께 완주하는 스터디·프로젝트 모임 | 완성도',
  },
};

export default function Home() {
  return (
    <main>
      <LandingHero />
      <LandingCoreFeatures />
      <LandingHowToUse />
      <LandingFinalCta />
    </main>
  );
}
