import { type HTMLAttributes, type ReactNode } from 'react';

import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/cn';

const toastVariants = cva('', {
  variants: {
    variant: {
      success: '',
      error: '',
      warning: '',
      info: '',
    },
  },
  defaultVariants: {
    variant: 'info',
  },
});

interface ToastProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'>, VariantProps<typeof toastVariants> {
  title?: ReactNode;
  description?: ReactNode;
  action?: ReactNode;
  onClose?: () => void;
}

export function Toast({ variant = 'info', title, description, action, onClose, className, ...props }: ToastProps) {
  return (
    <div role='status' className={cn(toastVariants({ variant }), className)} {...props}>
      {(title || onClose) && (
        <div className='toast-header'>
          {title && <strong className='toast-title'>{title}</strong>}
          {onClose && (
            <button type='button' onClick={onClose}>
              X
            </button>
          )}
        </div>
      )}
      {description && <div className='toast-description'>{description}</div>}
      {action && <div className='toast-action'>{action}</div>}
    </div>
  );
}
