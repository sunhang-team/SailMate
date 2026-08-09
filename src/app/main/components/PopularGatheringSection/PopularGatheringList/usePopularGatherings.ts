import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';

import { gatheringQueries } from '@/api/gatherings/queries';
import { usePerPage } from '@/app/main/hooks/usePerPage';
import { FIRST_PAGE, MAX_GATHERING_LIMIT } from '@/app/main/constant/constant';

export const usePopularGatherings = () => {
  const [page, setPage] = useState(FIRST_PAGE);
  const { data, ...rest } = useQuery(gatheringQueries.main({ limit: MAX_GATHERING_LIMIT }));

  const perPage = usePerPage();
  const populars = data?.popular ?? [];
  const totalPages = Math.max(1, Math.ceil(populars.length / perPage));

  const safePage = Math.min(page, totalPages);
  const startIndex = (safePage - 1) * perPage;
  const visibleGatherings = populars.slice(startIndex, startIndex + perPage);

  return {
    page: safePage,
    setPage,
    totalPages,
    visibleGatherings,
    ...rest,
  };
};
