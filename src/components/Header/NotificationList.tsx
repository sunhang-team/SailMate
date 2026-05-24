'use client';

import { useEffect, useRef } from 'react';

import { useInfiniteNotifications, useReadAllNotifications } from '@/api/notifications/queries';
import { NotificationItem } from './NotificationItem';

const NOTIFICATIONS_LIMIT = 10;

export function NotificationList() {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } = useInfiniteNotifications(NOTIFICATIONS_LIMIT);
  const { mutate: readAll, isPending: isReadAllPending } = useReadAllNotifications();
  const sentinelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { threshold: 0.1 },
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  const notifications = data.pages.flatMap((page) => page.notifications);
  const hasAny = notifications.length > 0;

  return (
    <div className='bg-gray-0 flex w-[320px] flex-col text-left'>
      <div className='border-gray-150 flex items-center justify-between border-b p-4'>
        <h3 className='text-body-02-sb text-gray-800'>알림 내역</h3>
        <button
          type='button'
          onClick={() => readAll()}
          disabled={isReadAllPending || !hasAny}
          className='text-small-02-sb cursor-pointer text-gray-400 transition-colors hover:text-blue-500 disabled:opacity-50 disabled:hover:text-gray-500'
        >
          모두 읽기
        </button>
      </div>

      <div className='mt-2 mr-2 flex h-[314px] flex-col overflow-y-auto [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-blue-100 [&::-webkit-scrollbar-track]:bg-transparent'>
        {!hasAny ? (
          <div className='text-body-02-r flex h-[120px] items-center justify-center text-gray-500'>
            도착한 알림이 없습니다.
          </div>
        ) : (
          <>
            {notifications.map((notification) => (
              <NotificationItem key={notification.id} notification={notification} />
            ))}
            <div ref={sentinelRef} className='h-1' />
            {isFetchingNextPage && (
              <div className='flex justify-center py-3'>
                <span className='text-small-02-r text-gray-400'>불러오는 중...</span>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
