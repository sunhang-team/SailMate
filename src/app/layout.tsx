import './globals.css';
import { pretendard } from './fonts';
import { Header } from '@/components/layout/Header';
import { MSWProvider } from '@/providers/MSWProvider';
import { QueryParamsProvider } from '@/providers/QueryParamsProvider';
import { QueryProvider } from '@/providers/QueryProvider';
import { OverlayProvider } from '@/providers/OverlayProvider';
import { FooterWrapper } from '@/components/Footer/FooterWrapper';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='ko' className={pretendard.variable}>
      <body className='font-pretendard'>
        <MSWProvider>
          <QueryProvider>
            <QueryParamsProvider>
              <Header />
              {children}
              <FooterWrapper />
              <OverlayProvider />
              <div id='modal-root' />
            </QueryParamsProvider>
          </QueryProvider>
        </MSWProvider>
      </body>
    </html>
  );
}
