import Link from 'next/link';

import { cn } from '@/lib/cn';

import { MY_PAGE_TAB_ITEMS } from '../../_constants';

import type { MyPageTab, PendingGatheringSort } from '../../_constants';

interface MyPageTabsProps {
  activeTab: MyPageTab;
  pendingSort: PendingGatheringSort;
}

const buildTabHref = (key: MyPageTab, pendingSort: PendingGatheringSort) => {
  if (key === 'pending-gatherings') {
    return `/my?tab=${key}&pendingSort=${pendingSort}`;
  }
  return `/my?tab=${key}`;
};

export function MyPageTabs({ activeTab, pendingSort }: MyPageTabsProps) {
  return (
    <nav className='after:bg-gray-150 relative after:absolute after:inset-x-0 after:bottom-0 after:h-[2px]'>
      <ul className='scrollbar-none relative z-1 flex flex-nowrap gap-2 overflow-x-auto'>
        {MY_PAGE_TAB_ITEMS.map(({ key, label }) => {
          const isActive = activeTab === key;

          return (
            <li key={key} className='shrink-0'>
              <Link
                href={buildTabHref(key, pendingSort)}
                replace
                scroll={false}
                className={cn(
                  'text-small-01-m md:text-body-01-m flex h-[39px] shrink-0 items-center px-2.5 transition-colors md:h-12',
                  isActive
                    ? 'text-small-01-b md:text-body-01-b border-b-2 border-gray-800 text-gray-800'
                    : 'text-gray-300',
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
