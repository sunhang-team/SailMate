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
    <footer className='bg-gray-150 h-[100px] w-full max-xl:h-auto max-xl:py-6'>
      <div className='flex h-full w-full flex-col items-center gap-4 px-6 md:flex-row md:justify-between xl:grid xl:grid-cols-3 xl:items-center xl:px-[100px]'>
        <Link href='/'>
          <Image
            src='/images/logo.svg'
            alt='완성도 로고'
            width={110}
            height={22}
            className='h-[16px] w-[82px] md:h-[22px] md:w-[110px] xl:h-[20px] xl:w-[97px]'
          />
        </Link>
        <div className='flex flex-col items-center gap-2 md:items-end xl:contents'>
          <nav className='text-small-02-r md:text-small-01-r xl:text-body-02-r flex items-center justify-center gap-6 text-gray-500'>
            {NAV_LINKS.map(({ label, href }, index) => (
              <Fragment key={href}>
                {index > 0 && <span>|</span>}
                <Link href={href}>{label}</Link>
              </Fragment>
            ))}
          </nav>
          <p className='text-small-02-r md:text-small-01-r xl:text-body-02-r text-gray-300 xl:justify-self-end'>
            © 2026. Codeit Sprint Team 3 All right reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
