import Link from 'next/link';

import { cn } from '@/lib/cn';

import { MY_PAGE_TAB_ITEMS } from '../../_constants';

import type { MyPageTab } from '../../_constants';

interface MyPageTabsProps {
  activeTab: MyPageTab;
}

export function MyPageTabs({ activeTab }: MyPageTabsProps) {
  return (
    <nav className='border-gray-150 bg-gray-0 border-b px-4 md:px-7 xl:px-30'>
      <ul className='scrollbar-none flex flex-nowrap gap-2 overflow-x-auto'>
        {MY_PAGE_TAB_ITEMS.map(({ key, label }) => {
          const isActive = activeTab === key;

          return (
            <li key={key} className='shrink-0'>
              <Link
                href={`/my?tab=${key}`}
                replace
                scroll={false}
                className={cn(
                  'text-small-02-m md:text-body-02-m flex h-[39px] shrink-0 items-center px-2.5 transition-colors md:h-12',
                  isActive ? 'border-b-2 border-gray-800 text-gray-800' : 'text-gray-300',
                )}
              >
                {label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
