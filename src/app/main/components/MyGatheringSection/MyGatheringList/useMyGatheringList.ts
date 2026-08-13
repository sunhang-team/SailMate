import { useState } from 'react';
import { useSuspenseQuery, useSuspenseQueries } from '@tanstack/react-query';
import axios from 'axios';

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
    queries: visibleGatherings.map((gathering) => ({
      ...membershipQueries.members(gathering.id),
      // 목록 갱신이 아직 반영되기 전, 이미 삭제된 모임의 멤버 조회는 재시도해도 계속 404이므로 즉시 포기
      retry: (failureCount: number, error: unknown) => {
        if (axios.isAxiosError(error) && error.response?.status === 404) return false;
        return failureCount < 3;
      },
    })),
  });

  return {
    page: safePage,
    setPage,
    totalPages,
    visibleGatherings,
    memberQueries,
  };
};
