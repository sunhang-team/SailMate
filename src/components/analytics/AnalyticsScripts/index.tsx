import { GoogleAnalytics } from '@next/third-parties/google';

export function AnalyticsScripts() {
  if (process.env.NODE_ENV !== 'production') return null;

  const gaId = process.env.NEXT_PUBLIC_GA_ID;
  if (!gaId) return null;

  return <GoogleAnalytics gaId={gaId} />;
}
