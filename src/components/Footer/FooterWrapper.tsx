'use client';

import { usePathname } from 'next/navigation';

import { Footer } from './index';

const ROUTES_WITHOUT_FOOTER = ['/login', '/register'];

export function FooterWrapper() {
  const pathname = usePathname();
  if (ROUTES_WITHOUT_FOOTER.includes(pathname)) return null;
  return <Footer />;
}
