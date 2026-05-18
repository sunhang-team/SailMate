'use client';

import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';
import { ko } from 'date-fns/locale';

import { useReadNotification } from '@/api/notifications/queries';
import { cn } from '@/lib/cn';
import {
  AlarmIcon,
  AlarmOnIcon,
  CheckIcon,
  CloseIcon,
  StateIcon,
  FlagIcon,
  ReviewIcon,
  HandIcon,
  EmailIcon,
} from '@/components/ui/Icon';

import type { NotificationItem as INotificationItem } from '@/api/notifications/types';

interface NotificationItemProps {
  notification: INotificationItem;
}

const NOTIFICATION_TITLE: Record<INotificationItem['type'], string> = {
  APPLICATION_RECEIVED: '참여 신청',
  APPLICATION_ACCEPTED: '참여 승인',
  APPLICATION_REJECTED: '참여 거절',
  PENALTY_WARNING: '패널티 경고',
  GATHERING_STARTED: '모임 시작',
  GATHERING_ENDED: '모집 마감 임박',
  REVIEW_REQUEST: '리뷰 요청',
  POKE: '콕 찌르기',
};

const getIconForType = (type: INotificationItem['type']) => {
  switch (type) {
    case 'APPLICATION_RECEIVED':
      return (
        <div className='bg-blue-150 flex h-7 w-7 items-center justify-center rounded'>
          <EmailIcon size={14} className='text-blue-300' />
        </div>
      );
    case 'APPLICATION_ACCEPTED':
      return (
        <div className='bg-blue-150 flex h-7 w-7 items-center justify-center rounded'>
          <CheckIcon size={16} className='text-blue-300' />
        </div>
      );
    case 'APPLICATION_REJECTED':
      return (
        <div className='flex h-7 w-7 items-center justify-center rounded bg-red-100'>
          <CloseIcon size={14} className='text-red-500' />
        </div>
      );
    case 'PENALTY_WARNING':
      return (
        <div className='flex h-7 w-7 items-center justify-center rounded bg-orange-100'>
          <StateIcon variant='warning' size={16} className='text-orange-500' />
        </div>
      );
    case 'GATHERING_STARTED':
      return (
        <div className='flex h-7 w-7 items-center justify-center rounded bg-green-100'>
          <FlagIcon size={14} className='text-green-300' />
        </div>
      );
    case 'GATHERING_ENDED':
      return (
        <div className='flex h-7 w-7 items-center justify-center rounded bg-orange-100'>
          <AlarmOnIcon size={14} className='text-orange-400' />
        </div>
      );
    case 'REVIEW_REQUEST':
      return (
        <div className='flex h-7 w-7 items-center justify-center rounded bg-blue-100'>
          <ReviewIcon size={14} className='text-blue-200' />
        </div>
      );
    case 'POKE':
      return (
        <div className='bg-gray-150 flex h-7 w-7 items-center justify-center rounded'>
          <HandIcon size={14} className='text-gray-600' />
        </div>
      );
    default:
      return <AlarmIcon size={24} className='text-gray-500' />;
  }
};

export function NotificationItem({ notification }: NotificationItemProps) {
  const { id, type, content, isRead, targetUrl, createdAt } = notification;
  const { mutate: readNotification } = useReadNotification();

  const handleRead = () => {
    if (!isRead) {
      readNotification(id);
    }
  };

  const timeAgo = formatDistanceToNow(new Date(createdAt), {
    addSuffix: true,
    locale: ko,
  });

  return (
    <Link
      href={targetUrl}
      onClick={handleRead}
      className={cn(
        'group flex items-start gap-4 p-4 transition-colors hover:bg-gray-50',
        !isRead ? 'bg-gray-100' : 'bg-gray-0',
      )}
    >
      <div className='mt-1 shrink-0'>{getIconForType(type)}</div>
      <div className='min-w-0 flex-1'>
        <div className='flex items-center justify-between gap-0.5'>
          <span className='text-small-02-sb text-gray-800'>{NOTIFICATION_TITLE[type]}</span>
          <span className='text-small-02-r flex shrink-0 items-center gap-1 text-gray-400'>
            {!isRead && <span className='inline-block h-1 w-1 rounded-full bg-blue-300' />}
            {timeAgo}
          </span>
        </div>
        <p className='text-small-01-r line-clamp-2 text-gray-600'>{content}</p>
      </div>
    </Link>
  );
}
