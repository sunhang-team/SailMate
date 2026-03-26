import { Fragment } from 'react';

import Image from 'next/image';
import Link from 'next/link';

const NAV_LINKS = [
  { label: '서비스 소개', href: '/about' },
  { label: '이용 약관', href: '/terms' },
  { label: '개인정보 처리방침', href: '/privacy' },
];

export function Footer() {
  return (
    <footer className='bg-gray-150 h-[100px] w-full max-lg:h-auto max-lg:py-6'>
      <div className='grid h-full w-full grid-cols-3 items-center px-[100px] max-lg:flex max-lg:flex-col max-lg:items-center max-lg:gap-4 max-lg:px-6'>
        <Link href='/'>
          <Image src='/images/logo.svg' alt='완성도 로고' width={97} height={20} />
        </Link>
        <nav className='text-body-02-r flex items-center justify-center gap-4 text-gray-500'>
          {NAV_LINKS.map(({ label, href }, index) => (
            <Fragment key={href}>
              {index > 0 && <span>|</span>}
              <Link href={href}>{label}</Link>
            </Fragment>
          ))}
        </nav>
        <p className='text-body-02-r justify-self-end text-gray-300 max-lg:justify-self-auto'>
          © 2026. Codeit Sprint Team 3 All right reserved.
        </p>
      </div>
    </footer>
  );
}
