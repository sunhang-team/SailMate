import './globals.css';
import { QueryParamsProvider } from '@/providers/QueryParamsProvider';
import { QueryProvider } from '@/providers/QueryProvider';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='ko'>
      <body>
        <QueryProvider>
          <QueryParamsProvider>{children}</QueryParamsProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
