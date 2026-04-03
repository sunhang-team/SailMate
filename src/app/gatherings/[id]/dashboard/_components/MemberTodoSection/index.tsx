'use client';

import { useState } from 'react';

import { useSuspenseQueries, useSuspenseQuery } from '@tanstack/react-query';

import { gatheringQueries } from '@/api/gatherings/queries';
import { membershipQueries } from '@/api/memberships/queries';
import { todoQueries } from '@/api/todos/queries';
import { Pagination } from '@/components/ui/Pagination';
import { getCurrentWeek } from '@/lib/formatGatheringDate';

import { MemberTodoAccordion } from './MemberTodoAccordion';

interface MemberTodoSectionProps {
  gatheringId: number;
}

const ITEMS_PER_PAGE = 5;

export function MemberTodoSection({ gatheringId }: MemberTodoSectionProps) {
  const [currentPage, setCurrentPage] = useState(1);

  const [{ data: gatheringData }, { data: membersData }] = useSuspenseQueries({
    queries: [gatheringQueries.detail(gatheringId), membershipQueries.members(gatheringId)],
  });

  const currentWeek = getCurrentWeek(gatheringData.startDate);

  const { data: todoData } = useSuspenseQuery({
    ...todoQueries.list(gatheringId, { week: currentWeek }),
  });

  const totalMembers = membersData.members.length;
  const totalPages = Math.ceil(totalMembers / ITEMS_PER_PAGE);

  const paginatedMembers = membersData.members.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  return (
    <section className='flex flex-col gap-2 md:gap-4'>
      <div className='flex items-center justify-between'>
        <h2 className='text-small-01-sb md:text-body-01-sb lg:text-h5-sb text-gray-900'>멤버 할 일 👀</h2>
      </div>

      <div className='flex flex-col gap-4'>
        {paginatedMembers.map((member) => (
          <MemberTodoAccordion
            key={member.userId}
            member={member}
            todos={todoData.todos.filter((t) => t.userId === member.userId)}
          />
        ))}
      </div>

      {totalPages > 1 && (
        <div className='mt-6 flex justify-center border-t border-gray-50 pt-8'>
          <Pagination
            variant='numbered'
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
      )}
    </section>
  );
}
