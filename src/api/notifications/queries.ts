import { useMutation, useQuery, useQueryClient, useSuspenseInfiniteQuery } from '@tanstack/react-query';
import { getNotifications, readAllNotifications, readNotification } from './index';
import type { GetNotificationsParams } from './types';

export const notificationKeys = {
  all: ['notifications'] as const,
  lists: () => [...notificationKeys.all, 'list'] as const,
  list: (params: GetNotificationsParams) => [...notificationKeys.lists(), 'paginated', params] as const,
  infinite: () => [...notificationKeys.lists(), 'infinite'] as const,
};

export const useGetNotifications = (params: GetNotificationsParams) => {
  return useQuery({
    queryKey: notificationKeys.list(params),
    queryFn: () => getNotifications(params),
    staleTime: 60 * 1000,
  });
};

export const useInfiniteNotifications = (limit: number) => {
  return useSuspenseInfiniteQuery({
    queryKey: notificationKeys.infinite(),
    queryFn: ({ pageParam }) => getNotifications({ page: pageParam, limit }),
    initialPageParam: 1,
    getNextPageParam: (lastPage, _, lastPageParam) => {
      if (lastPage.notifications.length < limit) return undefined;
      return lastPageParam + 1;
    },
    staleTime: 60 * 1000,
  });
};

export const useReadNotification = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (notificationId: number) => readNotification(notificationId),
    onMutate: async () => {
      // 진행 중인 모든 알림 조회 쿼리를 취소하여 낙관적 업데이트가 덮어씌워지지 않도록 함
      await queryClient.cancelQueries({ queryKey: notificationKeys.lists() });

      // 캐시된 알림 목록들을 가져와서 해당 알림의 isRead 상태를 낙관적으로 변경 (옵셔널)
      // 정확한 이전 상태 롤백을 위해 전체 쿼리의 상태를 저장할 수도 있음
      // 여기서는 빠른 UI 반영을 위해 리렌더링만 트리거 하거나 invalidateQueries를 onSettled에서 호출
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: notificationKeys.all });
    },
  });
};

export const useReadAllNotifications = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => readAllNotifications(),
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: notificationKeys.all });
    },
  });
};
