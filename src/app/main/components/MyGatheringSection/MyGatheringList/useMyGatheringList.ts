import { useState } from 'react';
import { useSuspenseQuery, useSuspenseQueries } from '@tanstack/react-query';

import { membershipQueries } from '@/api/memberships/queries';
import { usePerPage } from '@/app/main/hooks/usePerPage';
import { FIRST_PAGE, MAX_GATHERING_LIMIT } from '@/app/main/constant/constant';

export const useMyGatheringList = () => {
  const [page, setPage] = useState(FIRST_PAGE);
  const {
    data: { gatherings },
  } = useSuspenseQuery(membershipQueries.my({ limit: MAX_GATHERING_LIMIT }));

  const perPage = usePerPage();
  const totalPages = Math.max(1, Math.ceil(gatherings.length / perPage));

  const safePage = Math.min(page, totalPages);

  const startIndex = (safePage - 1) * perPage;
  const visibleGatherings = gatherings.slice(startIndex, startIndex + perPage);

  const memberQueries = useSuspenseQueries({
    queries: visibleGatherings.map((gathering) => membershipQueries.members(gathering.id)),
  });

  return {
    page: safePage,
    setPage,
    totalPages,
    visibleGatherings,
    memberQueries,
  };
};
