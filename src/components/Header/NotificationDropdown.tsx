'use client';

import { Dropdown } from '@/components/ui/Dropdown';
import { NotificationsIcon } from '@/components/ui/Icon';
import { useGetNotifications } from '@/api/notifications/queries';
import { SuspenseBoundary } from '@/components/SuspenseBoundary';
import { NotificationListSkeleton } from './NotificationListSkeleton';
import { NotificationList } from './NotificationList';

export function NotificationDropdown() {
  // 아이콘 뱃지를 그리기 위해 바깥에서 첫 페이지의 unreadCount만 가볍게 조회
  const { data } = useGetNotifications({ page: 1, limit: 1 });
  const unreadCount = data?.unreadCount ?? 0;

  return (
    <Dropdown>
      <Dropdown.Trigger>
        <div
          aria-label='알림'
          className='relative inline-flex h-9 w-9 cursor-pointer items-center justify-center rounded-full text-gray-500 transition-colors hover:bg-gray-100'
        >
          <NotificationsIcon size={36} />
          {unreadCount > 0 && (
            <span className='absolute top-[2px] right-[2px] flex h-4 min-w-[16px] items-center justify-center rounded-full bg-orange-500 px-[4px] text-[10px] font-bold text-white shadow-[0_0_0_2px_white]'>
              {unreadCount > 99 ? '99+' : unreadCount}
            </span>
          )}
        </div>
      </Dropdown.Trigger>
      <Dropdown.Menu className='border-gray-150 shadow-01 absolute top-[calc(100%+8px)] right-0 z-10 w-auto overflow-hidden rounded-xl border bg-white p-0'>
        <SuspenseBoundary
          pendingFallback={<NotificationListSkeleton />}
          errorFallback={() => (
            <div className='flex h-[200px] w-[320px] items-center justify-center p-4 text-red-500'>
              알림을 불러오는데 실패했습니다.
            </div>
          )}
        >
          <NotificationList />
        </SuspenseBoundary>
      </Dropdown.Menu>
    </Dropdown>
  );
}
