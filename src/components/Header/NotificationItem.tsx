'use client';

import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';
import { ko } from 'date-fns/locale';

import { useReadNotification } from '@/api/notifications/queries';
import { cn } from '@/lib/cn';
import {
  AlarmIcon,
  CheckIcon,
  CloseIcon,
  ExclamationIcon,
  FlagIcon,
  CompletedIcon,
  ReviewIcon,
  HandIcon,
  EmailIcon,
} from '@/components/ui/Icon';

import type { NotificationItem as INotificationItem } from '@/api/notifications/types';

interface NotificationItemProps {
  notification: INotificationItem;
}

const getIconForType = (type: INotificationItem['type']) => {
  switch (type) {
    case 'APPLICATION_RECEIVED':
      return <EmailIcon size={24} className='text-blue-500' />;
    case 'APPLICATION_ACCEPTED':
      return <CheckIcon size={24} className='text-green-500' />;
    case 'APPLICATION_REJECTED':
      return <CloseIcon size={24} className='text-red-500' />;
    case 'PENALTY_WARNING':
      return <ExclamationIcon size={24} className='text-orange-500' />;
    case 'GATHERING_STARTED':
      return <FlagIcon size={24} className='text-blue-500' />;
    case 'GATHERING_ENDED':
      return <CompletedIcon size={24} className='text-gray-500' />;
    case 'REVIEW_REQUEST':
      return <ReviewIcon size={24} className='text-blue-500' />;
    case 'POKE':
      return <HandIcon size={24} className='text-orange-500' />;
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
        !isRead ? 'bg-blue-50/50' : 'bg-white',
      )}
    >
      <div className='mt-1 shrink-0'>{getIconForType(type)}</div>
      <div className='min-w-0 flex-1'>
        <p className={cn('text-body-02-r line-clamp-2 text-gray-800', !isRead && 'font-semibold')}>{content}</p>
        <span className='text-caption-01-r mt-1 block text-gray-400'>{timeAgo}</span>
      </div>
      {!isRead && <div className='mt-2 h-2 w-2 shrink-0 rounded-full bg-blue-500' />}
    </Link>
  );
}
