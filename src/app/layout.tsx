import './globals.css';
import { pretendard } from './fonts';
import { Header } from '@/components/Header';
import { MSWProvider } from '@/providers/MSWProvider';
import { QueryParamsProvider } from '@/providers/QueryParamsProvider';
import { QueryProvider } from '@/providers/QueryProvider';
import { OverlayProvider } from '@/providers/OverlayProvider';
import { FooterWrapper } from '@/components/Footer/FooterWrapper';
import { ToastProvider } from '@/components/ui/Toast/ToastProvider';
import { JsonLd } from '@/components/seo/JsonLd';
import {
  SITE_NAME,
  SITE_TITLE_DEFAULT,
  SITE_DESCRIPTION,
  SITE_KEYWORDS,
  SITE_LOCALE,
  OG_IMAGES,
  TWITTER_IMAGE_PATH,
  buildOrganizationJsonLd,
  buildWebSiteJsonLd,
  getSiteUrl,
} from '@/lib/seo';

import type { Metadata } from 'next';

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
      type: 'website',
      locale: SITE_LOCALE,
      siteName: SITE_NAME,
      url: '/',
      title: SITE_TITLE_DEFAULT,
      description: SITE_DESCRIPTION,
      images: OG_IMAGES.map((img) => ({ ...img })),
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
  return (
    <html lang='ko' className={`${pretendard.variable} relative`}>
      <body className='font-pretendard relative'>
        <MSWProvider>
          <QueryProvider>
            <QueryParamsProvider>
              <ToastProvider>
                <Header />
                {children}
                <FooterWrapper />
                <OverlayProvider />
                <div id='modal-root' />
              </ToastProvider>
            </QueryParamsProvider>
          </QueryProvider>
        </MSWProvider>
        <JsonLd data={buildOrganizationJsonLd()} />
        <JsonLd data={buildWebSiteJsonLd()} />
      </body>
    </html>
  );
}
