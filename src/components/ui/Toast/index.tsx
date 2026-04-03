import { type HTMLAttributes, type ReactNode } from 'react';

import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/cn';
import { CloseIcon } from '@/components/ui/Icon';

const toastVariants = cva(
  'animate-toast-in pointer-events-auto flex w-full max-w-sm items-center justify-between overflow-hidden rounded-2xl border p-4 shadow-xl backdrop-blur-md transition-all duration-300 ease-in-out',
  {
    variants: {
      variant: {
        success: 'border-blue-100 bg-blue-50/95 text-blue-900 shadow-blue-900/5',
        error: 'border-red-100 bg-red-50/95 text-red-900 shadow-red-900/5',
        warning: 'border-yellow-100 bg-yellow-50/95 text-yellow-900 shadow-yellow-900/5',
        info: 'border-gray-200 bg-white/95 text-gray-900 shadow-black/5',
      },
    },
    defaultVariants: {
      variant: 'info',
    },
  },
);

interface ToastProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'>, VariantProps<typeof toastVariants> {
  title?: ReactNode;
  description?: ReactNode;
  action?: ReactNode;
  onClose?: () => void;
}

export function Toast({ variant = 'info', title, description, action, onClose, className, ...props }: ToastProps) {
  return (
    <div role='status' className={cn(toastVariants({ variant }), className)} {...props}>
      <div className='flex w-full flex-col'>
        {(title || onClose) && (
          <div className='flex items-start justify-between gap-3'>
            {title && <strong className='text-body-02-sb pt-0.5'>{title}</strong>}
            {onClose && (
              <button
                type='button'
                onClick={onClose}
                className='inline-flex shrink-0 rounded-lg p-1 text-inherit opacity-50 hover:bg-black/5 hover:opacity-100 focus:ring-2 focus:ring-black/10 focus:outline-none'
                aria-label='닫기'
              >
                <CloseIcon className='h-4 w-4' />
              </button>
            )}
          </div>
        )}
        {description && <div className='text-small-01-r mt-1 opacity-80'>{description}</div>}
        {action && <div className='mt-2.5'>{action}</div>}
      </div>
    </div>
  );
}
