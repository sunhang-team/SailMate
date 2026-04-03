import './globals.css';
import { pretendard } from './fonts';
import { Header } from '@/components/Header';
import { MSWProvider } from '@/providers/MSWProvider';
import { QueryParamsProvider } from '@/providers/QueryParamsProvider';
import { QueryProvider } from '@/providers/QueryProvider';
import { OverlayProvider } from '@/providers/OverlayProvider';
import { FooterWrapper } from '@/components/Footer/FooterWrapper';
import { ToastProvider } from '@/components/ui/Toast/ToastProvider';

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
      </body>
    </html>
  );
}
