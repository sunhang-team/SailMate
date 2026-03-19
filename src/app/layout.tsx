import './globals.css';
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
        <QueryProvider>
          <QueryParamsProvider>
            {children}
            <OverlayProvider />
            <div id='modal-root' />
          </QueryParamsProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
