'use client';

import { useState } from 'react';

import { useSuspenseQueries } from '@tanstack/react-query';

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
  const [{ data }, { data: achievementData }] = useSuspenseQueries({
    queries: [achievementQueries.ranking(gatheringId), achievementQueries.detail(gatheringId)],
  });
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

  const leftItems = currentItems.filter((_, i) => i % 2 === 0);
  const rightItems = currentItems.filter((_, i) => i % 2 === 1);

  return (
    <div className='border-gray-150 bg-gray-0 shadow-02 rounded-2xl border p-6'>
      <h2 className='text-small-01-sb md:text-body-01-sb lg:text-h5-sb mb-4 text-gray-900'>멤버 달성률 랭킹 🏆</h2>

      {isDesktop ? (
        <div className='grid grid-cols-2 gap-4'>
          <div className='flex flex-col gap-4'>
            {leftItems.map((item) => (
              <RankingItem
                key={item.userId}
                item={item}
                isMe={user?.id === item.userId}
                streakDays={achievementData.members.find((m) => m.userId === item.userId)?.streakDays ?? 0}
              />
            ))}
          </div>
          <div className='flex flex-col gap-4'>
            {rightItems.map((item) => (
              <RankingItem
                key={item.userId}
                item={item}
                isMe={user?.id === item.userId}
                streakDays={achievementData.members.find((m) => m.userId === item.userId)?.streakDays ?? 0}
              />
            ))}
          </div>
        </div>
      ) : (
        <div className='flex flex-col gap-4'>
          {currentItems.map((item) => (
            <RankingItem
              key={item.userId}
              item={item}
              isMe={user?.id === item.userId}
              streakDays={achievementData.members.find((m) => m.userId === item.userId)?.streakDays ?? 0}
            />
          ))}
        </div>
      )}

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
