import './globals.css';
import { MSWProvider } from '@/providers/MSWProvider';
import { QueryParamsProvider } from '@/providers/QueryParamsProvider';
import { QueryProvider } from '@/providers/QueryProvider';
import { OverlayProvider } from '@/providers/OverlayProvider';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='ko'>
      <body>
        <MSWProvider>
          <QueryProvider>
            <QueryParamsProvider>
              {children}
              <OverlayProvider />
              <div id='modal-root' />
            </QueryParamsProvider>
          </QueryProvider>
        </MSWProvider>
      </body>
    </html>
  );
}
