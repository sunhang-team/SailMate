'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';

import { AuthSection } from './AuthSection';
import { useAuth } from '@/hooks/useAuth';
import { CloseIcon, ArrowIcon } from '@/components/ui/Icon';

const NAVIGATION_ITEMS = [
  { href: '/', label: '홈' },
  { href: '/gatherings', label: '모임 탐색' },
  { href: '/gatherings/new', label: '모임 만들기' },
  { href: '/my', label: '내 모임' },
] as const;

export function Header() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const { isLoggedIn, isLoading } = useAuth();

  useEffect(() => {
    if (!isSidebarOpen) {
      return;
    }

    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = '';
    };
  }, [isSidebarOpen]);

  const handleNavigate = (href: string) => {
    router.push(href);
    setIsSidebarOpen(false);
  };

  return (
    <>
      <header className='border-gray-150 bg-gray-0 h-[88px] border-b max-lg:h-[56px] max-lg:px-4 md:px-7 xl:px-30'>
        <div className='flex h-full w-full items-center justify-between'>
          <div className='flex items-center gap-20'>
            <Link href='/'>
              <Image
                src='/images/logo.svg'
                alt='logo'
                width={136}
                height={28}
                className='max-lg:h-[24px] max-lg:w-auto'
              />
            </Link>

            <nav aria-label='주요 네비게이션' className='max-lg:hidden'>
              <ul className='flex h-[88px] items-center gap-11'>
                {NAVIGATION_ITEMS.map((item) => {
                  const isActive = item.href === pathname || (item.href === '/' && pathname === '/main');
                  return (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        className={`transition-colors hover:text-blue-400 ${isActive ? 'text-body-01-b text-gray-900' : 'text-body-01-m text-gray-700'}`}
                      >
                        {item.label}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </nav>
          </div>

          <div className='max-lg:hidden'>
            <AuthSection />
          </div>

          <button
            type='button'
            aria-label='메뉴 열기'
            onClick={() => setIsSidebarOpen(true)}
            className='hidden h-8 w-8 items-center justify-center text-blue-500 max-lg:inline-flex'
          >
            <span className='relative block h-[14px] w-[18px]'>
              <span className='absolute top-0 block h-[2px] w-full rounded-full bg-gray-700' />
              <span className='absolute top-1/2 block h-[2px] w-full -translate-y-1/2 rounded-full bg-gray-700' />
              <span className='absolute bottom-0 block h-[2px] w-full rounded-full bg-gray-700' />
            </span>
          </button>
        </div>
      </header>

      <div
        className={`fixed inset-0 z-50 bg-black/35 transition-opacity duration-200 lg:hidden ${
          isSidebarOpen ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'
        }`}
        onClick={() => setIsSidebarOpen(false)}
        aria-hidden
      />

      <aside
        className={`bg-gray-0 fixed top-0 right-0 z-60 h-dvh w-[74%] max-w-[320px] rounded-l-2xl px-6 py-5 transition-transform duration-300 ease-out lg:hidden ${
          isSidebarOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        aria-hidden={!isSidebarOpen}
      >
        <div className='flex justify-start'>
          <button
            type='button'
            aria-label='메뉴 닫기'
            onClick={() => setIsSidebarOpen(false)}
            className='inline-flex h-8 w-8 items-center justify-center text-gray-600'
          >
            <CloseIcon size={24} />
          </button>
        </div>

        <nav aria-label='모바일 네비게이션' className='mt-5'>
          <ul className='flex flex-col'>
            {NAVIGATION_ITEMS.map((item) => (
              <li key={item.href}>
                <button
                  type='button'
                  onClick={() => handleNavigate(item.href)}
                  className='text-body-02-m flex w-full items-center justify-between py-5 text-left text-gray-700'
                >
                  {item.label}
                  <ArrowIcon size={24} direction='right' className='text-gray-300' aria-hidden />
                </button>
              </li>
            ))}
          </ul>
        </nav>

        <div className='text-body-02-m absolute right-7 bottom-7 flex items-center gap-3 text-gray-400'>
          {isLoading || !isLoggedIn ? (
            <>
              <button type='button' onClick={() => handleNavigate('/login')}>
                로그인
              </button>
              <span>|</span>
              <button type='button' onClick={() => handleNavigate('/register')}>
                회원가입
              </button>
            </>
          ) : (
            <>
              <button type='button' onClick={() => handleNavigate('/my')}>
                마이페이지
              </button>
            </>
          )}
        </div>
      </aside>
    </>
  );
}
