import { useState } from 'react';

import { Dropdown } from '@/components/ui/Dropdown';
import { NotificationsIcon, PaginationIcon } from '@/components/ui/Icon';
import { useGetNotifications, useReadAllNotifications } from '@/api/notifications/queries';
import { NotificationItem } from './NotificationItem';
import { NotificationListSkeleton } from './NotificationListSkeleton';

const NOTIFICATIONS_LIMIT = 5;

// 드롭다운 메뉴 내부에 렌더링될 실제 목록 (불필요한 첫 페치 방지를 위해 분리)
const NotificationList = () => {
  const [page, setPage] = useState(1);
  const { data, isLoading, isError } = useGetNotifications({ page, limit: NOTIFICATIONS_LIMIT });
  const { mutate: readAll, isPending: isReadAllPending } = useReadAllNotifications();

  const handlePrevPage = () => {
    setPage((prev) => Math.max(1, prev - 1));
  };

  const handleNextPage = () => {
    setPage((prev) => prev + 1);
  };

  if (isLoading) {
    return <NotificationListSkeleton />;
  }

  if (isError) {
    return (
      <div className='flex h-[200px] items-center justify-center p-4 text-red-500'>알림을 불러오는데 실패했습니다.</div>
    );
  }

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
};

export function NotificationDropdown() {
  // 아이콘 뱃지를 그리기 위해 바깥에서 첫 페이지의 unreadCount만 가볍게 조회
  const { data } = useGetNotifications({ page: 1, limit: 1 });
  const unreadCount = data?.unreadCount ?? 0;

  return (
    <Dropdown>
      <Dropdown.Trigger>
        <button
          type='button'
          aria-label='알림'
          className='relative inline-flex h-9 w-9 cursor-pointer items-center justify-center rounded-full text-gray-500 transition-colors hover:bg-gray-100'
        >
          <NotificationsIcon size={36} />
          {unreadCount > 0 && (
            <span className='absolute top-[2px] right-[2px] flex h-4 min-w-[16px] items-center justify-center rounded-full bg-orange-500 px-[4px] text-[10px] font-bold text-white shadow-[0_0_0_2px_white]'>
              {unreadCount > 99 ? '99+' : unreadCount}
            </span>
          )}
        </button>
      </Dropdown.Trigger>
      <Dropdown.Menu className='border-gray-150 shadow-01 absolute top-[calc(100%+8px)] right-0 z-10 w-auto overflow-hidden rounded-xl border bg-white p-0'>
        <NotificationList />
      </Dropdown.Menu>
    </Dropdown>
  );
}
