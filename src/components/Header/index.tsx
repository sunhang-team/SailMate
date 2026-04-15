'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';

import { AuthSection } from './AuthSection';
import { useAuth } from '@/hooks/useAuth';
import { CloseIcon, ArrowIcon } from '@/components/ui/Icon';

const NAVIGATION_ITEMS = [
  { href: '/', label: '홈', protected: false },
  { href: '/gatherings', label: '모임 탐색', protected: false },
  { href: '/gatherings/new', label: '모임 만들기', protected: true },
  { href: '/my', label: '내 모임', protected: true },
] as const;

export function Header() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const isNavActive = (href: string) => pathname === href || (href === '/' && pathname === '/main');
  const { isLoggedIn, isLoading } = useAuth();
  const hasSession = typeof document !== 'undefined' && document.cookie.includes('has-session=');

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
      <header className='border-gray-150 bg-gray-0 h-[88px] border-b max-md:h-[48px] max-md:px-4 md:px-7 xl:px-30'>
        <div className='flex h-full w-full items-center justify-between'>
          <div className='flex items-center gap-11 lg:gap-20'>
            <Link href='/'>
              <Image
                src='/images/logo.svg'
                alt='logo'
                width={136}
                height={28}
                className='h-[16px] w-[82px] md:h-[22px] md:w-[110px] lg:h-[28px] lg:w-[136px]'
              />
            </Link>

            <nav aria-label='주요 네비게이션' className='max-md:hidden'>
              <ul className='flex h-[88px] items-center gap-7 lg:gap-11'>
                {NAVIGATION_ITEMS.map((item) => {
                  const isActive = isNavActive(item.href);
                  return (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        className={`transition-colors hover:text-blue-400 ${isActive ? 'text-body-02-b lg:text-body-01-b text-gray-900' : 'text-body-02-m lg:text-body-01-m text-gray-700'}`}
                        prefetch={item.protected && !hasSession ? false : undefined}
                      >
                        {item.label}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </nav>
          </div>

          <div className='max-md:hidden'>
            <AuthSection />
          </div>

          <button
            type='button'
            aria-label='메뉴 열기'
            onClick={() => setIsSidebarOpen(true)}
            className='hidden h-8 w-8 items-center justify-center text-blue-500 max-md:inline-flex'
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
        className={`fixed inset-0 z-50 bg-black/35 transition-opacity duration-200 md:hidden ${
          isSidebarOpen ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'
        }`}
        onClick={() => setIsSidebarOpen(false)}
        aria-hidden
      />

      <aside
        className={`bg-gray-0 fixed top-0 right-0 z-60 h-dvh w-[74%] max-w-[320px] rounded-l-2xl px-6 py-5 transition-transform duration-300 ease-out md:hidden ${
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
            <CloseIcon size={32} />
          </button>
        </div>

        <nav aria-label='모바일 네비게이션' className='mt-5'>
          <ul className='flex flex-col'>
            {NAVIGATION_ITEMS.map((item) => {
              const isActive = isNavActive(item.href);
              const label = isLoggedIn && item.href === '/my' ? '마이페이지' : item.label;
              return (
                <li key={item.href}>
                  <button
                    type='button'
                    onClick={() => handleNavigate(item.href)}
                    className={`text-body-02-m flex w-full items-center justify-between py-5 text-left ${
                      isActive ? 'text-blue-300' : 'text-gray-700'
                    }`}
                  >
                    {label}
                    <ArrowIcon
                      size={24}
                      direction='right'
                      className={isActive ? 'text-blue-300' : 'text-gray-300'}
                      aria-hidden
                    />
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        {(isLoading || !isLoggedIn) && (
          <div className='text-body-02-m absolute right-7 bottom-7 flex items-center gap-3 text-gray-400'>
            <button type='button' onClick={() => handleNavigate('/login')}>
              로그인
            </button>
            <span>|</span>
            <button type='button' onClick={() => handleNavigate('/register')}>
              회원가입
            </button>
          </div>
        )}
      </aside>
    </>
  );
}
