import Link from 'next/link';

import { cn } from '@/lib/cn';

import { DASHBOARD_TAB_ITEMS } from '../../_constants';

import type { DashboardTab } from '../../_constants';

interface DashboardTabNavProps {
  activeTab: DashboardTab;
  gatheringId: number;
}

export function DashboardTabNav({ activeTab, gatheringId }: DashboardTabNavProps) {
  return (
    <nav className='border-gray-150 bg-gray-0 border-b px-4 md:px-7 xl:px-30'>
      <div className='mx-auto max-w-[1680px]'>
        <ul className='scrollbar-none flex flex-nowrap gap-2 overflow-x-auto'>
          {DASHBOARD_TAB_ITEMS.map(({ key, label }) => {
            const isActive = activeTab === key;

            return (
              <li key={key} className='shrink-0'>
                <Link
                  href={`/gatherings/${gatheringId}/dashboard?tab=${key}`}
                  replace
                  scroll={false}
                  className={cn(
                    'text-small-01-m md:text-body-01-m flex h-[39px] shrink-0 items-center px-2.5 transition-colors md:h-12',
                    isActive
                      ? 'text-small-01-sb md:text-body-01-sb border-gray-800 text-gray-800 md:border-b-2'
                      : 'text-gray-300',
                  )}
                >
                  {label}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
}
