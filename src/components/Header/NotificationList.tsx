'use client';

import { useState } from 'react';
import { useSuspenseQuery } from '@tanstack/react-query';

import { PaginationIcon } from '@/components/ui/Icon';
import { notificationKeys, useReadAllNotifications } from '@/api/notifications/queries';
import { getNotifications } from '@/api/notifications/index';
import { NotificationItem } from './NotificationItem';

const NOTIFICATIONS_LIMIT = 5;

// 드롭다운 메뉴 내부에 렌더링될 실제 목록 (불필요한 첫 페치 방지를 위해 분리)
export function NotificationList() {
  const [page, setPage] = useState(1);
  const { data } = useSuspenseQuery({
    queryKey: notificationKeys.list({ page, limit: NOTIFICATIONS_LIMIT }),
    queryFn: () => getNotifications({ page, limit: NOTIFICATIONS_LIMIT }),
    staleTime: 60 * 1000,
  });
  const { mutate: readAll, isPending: isReadAllPending } = useReadAllNotifications();

  const handlePrevPage = () => {
    setPage((prev) => Math.max(1, prev - 1));
  };

  const handleNextPage = () => {
    setPage((prev) => prev + 1);
  };

  const notifications = data?.notifications ?? [];
  const hasNextPage = notifications.length === NOTIFICATIONS_LIMIT;

  return (
    <div className='flex max-h-[80vh] w-[320px] flex-col bg-white text-left'>
      <div className='border-gray-150 flex items-center justify-between border-b p-4'>
        <h3 className='text-body-01-b text-gray-800'>알림</h3>
        <button
          type='button'
          onClick={() => readAll()}
          disabled={isReadAllPending || notifications.length === 0}
          className='text-body-02-r cursor-pointer text-gray-500 transition-colors hover:text-blue-500 disabled:opacity-50 disabled:hover:text-gray-500'
        >
          모두 읽음
        </button>
      </div>

      <div className='flex flex-col overflow-y-auto'>
        {notifications.length === 0 ? (
          <div className='text-body-02-r flex h-[120px] items-center justify-center text-gray-500'>
            도착한 알림이 없습니다.
          </div>
        ) : (
          notifications.map((notification) => <NotificationItem key={notification.id} notification={notification} />)
        )}
      </div>

      <div className='border-gray-150 flex items-center justify-between border-t p-3'>
        <button
          type='button'
          onClick={handlePrevPage}
          disabled={page === 1}
          className='flex h-8 w-8 items-center justify-center rounded-md text-gray-500 transition-colors hover:bg-gray-100 disabled:opacity-30 disabled:hover:bg-transparent'
        >
          <PaginationIcon variant='prev' className='size-6' />
        </button>
        <span className='text-caption-01-m text-gray-500'>{page}</span>
        <button
          type='button'
          onClick={handleNextPage}
          disabled={!hasNextPage}
          className='flex h-8 w-8 items-center justify-center rounded-md text-gray-500 transition-colors hover:bg-gray-100 disabled:opacity-30 disabled:hover:bg-transparent'
        >
          <PaginationIcon variant='next' className='size-6' />
        </button>
      </div>
    </div>
  );
}
