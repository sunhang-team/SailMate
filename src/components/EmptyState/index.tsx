import Link from 'next/link';

import { cn } from '@/lib/cn';

interface EmptyStateProps {
  emoji?: string;
  title: string;
  description?: string;
  action?: {
    label: string;
    href: string;
  };
  className?: string;
}

export function EmptyState({ emoji, title, description, action, className }: EmptyStateProps) {
  return (
    <div className={cn('flex flex-col items-center gap-3 px-4 py-16 text-center break-keep', className)}>
      {emoji && (
        <span aria-hidden='true' className='text-[40px] leading-none'>
          {emoji}
        </span>
      )}
      <p className='text-body-01-b text-gray-900'>{title}</p>
      {description && <p className='text-body-02-r text-gray-600'>{description}</p>}
      {action && (
        <Link
          href={action.href}
          className='bg-gradient-primary text-body-02-sb mt-2 inline-flex h-12 items-center justify-center rounded-lg px-6 text-white transition-colors'
        >
          {action.label}
        </Link>
      )}
    </div>
  );
}
