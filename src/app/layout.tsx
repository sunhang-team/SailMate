import './globals.css';
import Script from 'next/script';
import { SerwistProvider } from '@serwist/turbopack/react';

import { pretendard } from './fonts';
import { AnalyticsScripts } from '@/components/analytics/AnalyticsScripts';
import { BeusableScript } from '@/components/analytics/BeusableScript';
import { Header } from '@/components/Header';
import { NetworkStatusToast } from '@/components/NetworkStatusToast';
import { MSWProvider } from '@/providers/MSWProvider';
import { QueryParamsProvider } from '@/providers/QueryParamsProvider';
import { QueryProvider } from '@/providers/QueryProvider';
import { OverlayProvider } from '@/providers/OverlayProvider';
import { FooterWrapper } from '@/components/Footer/FooterWrapper';
import { ToastProvider } from '@/components/ui/Toast/ToastProvider';
import { JsonLd } from '@/components/seo/JsonLd';
import { isMswEnabled } from '@/lib/msw';
import {
  SITE_NAME,
  SITE_TITLE_DEFAULT,
  SITE_DESCRIPTION,
  SITE_KEYWORDS,
  TWITTER_IMAGE_PATH,
  buildOrganizationJsonLd,
  buildWebSiteJsonLd,
  getDefaultOpenGraph,
  getSiteUrl,
} from '@/lib/seo';

import type { Metadata } from 'next';

const shouldUseSerwist = !isMswEnabled;

export const generateMetadata = async (): Promise<Metadata> => {
  const siteUrl = getSiteUrl();
  return {
    metadataBase: new URL(siteUrl),
    title: {
      default: SITE_TITLE_DEFAULT,
      template: `%s | ${SITE_NAME}`,
    },
    description: SITE_DESCRIPTION,
    keywords: SITE_KEYWORDS,
    applicationName: SITE_NAME,
    alternates: {
      canonical: '/',
    },
    openGraph: {
      ...getDefaultOpenGraph(),
      url: '/',
    },
    twitter: {
      card: 'summary_large_image',
      title: SITE_TITLE_DEFAULT,
      description: SITE_DESCRIPTION,
      images: [TWITTER_IMAGE_PATH],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    // verification: { google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION },
    // verification: { other: { 'naver-site-verification': process.env.NEXT_PUBLIC_NAVER_SITE_VERIFICATION ?? '' } },
  };
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const app = (
    <MSWProvider>
      <QueryProvider>
        <QueryParamsProvider>
          <ToastProvider>
            <NetworkStatusToast />
            <Header />
            {children}
            <FooterWrapper />
            <OverlayProvider />
            <div id='modal-root' />
          </ToastProvider>
        </QueryParamsProvider>
      </QueryProvider>
    </MSWProvider>
  );

  return (
    <html lang='ko' className={`${pretendard.variable} relative`}>
      <body className='font-pretendard relative'>
        {/* beforeinstallprompt는 하이드레이션 전에 발생할 수 있어, React 이펙트 등록보다
            먼저 실행되도록 beforeInteractive 스크립트로 최대한 일찍 캡처해둔다. */}
        <Script id='pwa-install-prompt-capture' strategy='beforeInteractive'>
          {`
            window.addEventListener('beforeinstallprompt', function (e) {
              e.preventDefault();
              window.__deferredInstallPrompt = e;
            });
          `}
        </Script>
        {shouldUseSerwist ? <SerwistProvider swUrl='/serwist/sw.js'>{app}</SerwistProvider> : app}
        <>
          <JsonLd data={buildOrganizationJsonLd()} />
          <JsonLd data={buildWebSiteJsonLd()} />
          <AnalyticsScripts />
          <BeusableScript />
        </>
      </body>
    </html>
  );
}
