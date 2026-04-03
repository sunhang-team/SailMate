import { LandingCoreFeatures } from '@/components/landing/LandingCoreFeatures';
import { LandingFinalCta } from '@/components/landing/LandingFinalCta';
import { LandingHero } from '@/components/landing/LandingHero';
import { LandingHowToUse } from '@/components/landing/LandingHowToUse';

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
