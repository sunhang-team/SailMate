import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getNotifications, readAllNotifications, readNotification } from './index';
import type { GetNotificationsParams } from './types';

export const notificationKeys = {
  all: ['notifications'] as const,
  lists: () => [...notificationKeys.all, 'list'] as const,
  list: (params: GetNotificationsParams) => [...notificationKeys.lists(), params] as const,
};

export const useGetNotifications = (params: GetNotificationsParams) => {
  return useQuery({
    queryKey: notificationKeys.list(params),
    queryFn: () => getNotifications(params),
    staleTime: 60 * 1000, // 1분
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
      // 어떠한 쿼리(페이지)에 속한 알림이든 전체 업데이트를 위해 lists 키 무효화
      queryClient.invalidateQueries({ queryKey: notificationKeys.lists() });
    },
  });
};

export const useReadAllNotifications = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => readAllNotifications(),
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: notificationKeys.lists() });
    },
  });
};
