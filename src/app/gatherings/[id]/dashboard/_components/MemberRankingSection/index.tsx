'use client';

import { useState } from 'react';

import { useSuspenseQuery } from '@tanstack/react-query';

import { achievementQueries } from '@/api/achievements/queries';
import { Pagination } from '@/components/ui/Pagination';
import { useAuth } from '@/hooks/useAuth';
import { useMediaQuery } from '@/hooks/useMediaQuery';

import { RankingItem } from './RankingItem';

interface MemberRankingSectionProps {
  gatheringId: number;
}

const ITEMS_PER_PAGE_DESKTOP = 10;
const ITEMS_PER_PAGE_MOBILE = 5;

export function MemberRankingSection({ gatheringId }: MemberRankingSectionProps) {
  const { data } = useSuspenseQuery(achievementQueries.ranking(gatheringId));
  const { user } = useAuth();
  const isDesktop = useMediaQuery('(min-width: 1024px)');

  const itemsPerPage = isDesktop ? ITEMS_PER_PAGE_DESKTOP : ITEMS_PER_PAGE_MOBILE;
  const [currentPage, setCurrentPage] = useState(1);
  const [prevIsDesktop, setPrevIsDesktop] = useState(isDesktop);

  if (prevIsDesktop !== isDesktop) {
    setPrevIsDesktop(isDesktop);
    setCurrentPage(1);
  }

  const { ranking } = data;
  const totalPages = Math.ceil(ranking.length / itemsPerPage);
  const currentItems = ranking.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const leftItems = currentItems.slice(0, 5);
  const rightItems = currentItems.slice(5, 10);

  return (
    <div className='border-gray-150 bg-gray-0 shadow-02 rounded-2xl border p-6'>
      <h2 className='text-small-01-sb md:text-body-01-sb lg:text-h5-sb mb-4 text-gray-900'>멤버 달성률 랭킹 🏆</h2>

      <div className='grid grid-cols-1 gap-3 lg:grid-cols-2'>
        <div className='flex flex-col gap-3'>
          {leftItems.map((item) => (
            <RankingItem key={item.userId} item={item} isMe={user?.id === item.userId} />
          ))}
        </div>
        {rightItems.length > 0 && (
          <div className='flex flex-col gap-3'>
            {rightItems.map((item) => (
              <RankingItem key={item.userId} item={item} isMe={user?.id === item.userId} />
            ))}
          </div>
        )}
      </div>

      {totalPages > 1 && (
        <div className='mt-6'>
          <Pagination
            variant='numbered'
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
      )}
    </div>
  );
}
