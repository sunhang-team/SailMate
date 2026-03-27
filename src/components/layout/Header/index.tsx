import Image from 'next/image';
import Link from 'next/link';

import { AuthSection } from './AuthSection';

const NAVIGATION_ITEMS = [
  { href: '/', label: '홈' },
  { href: '/gatherings', label: '모임 탐색' },
  { href: '/gatherings/new', label: '모임 만들기' },
  { href: '/my', label: '내 모임' },
] as const;

export function Header() {
  return (
    <header className='border-gray-150 bg-gray-0 h-[88px] border-b px-15 max-lg:h-auto max-lg:py-3'>
      <div className='mx-auto flex h-full w-full max-w-[1200px] items-center justify-between'>
        <div className='flex items-center gap-20'>
          <Link href='/'>
            <Image src='/images/logo.svg' alt='logo' width={136} height={28} />
          </Link>

          <nav aria-label='주요 네비게이션'>
            <ul className='flex h-[88px] items-center gap-11'>
              {NAVIGATION_ITEMS.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className='text-body-01-m text-gray-700 transition-colors hover:text-blue-400'>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <AuthSection />
      </div>
    </header>
  );
}
