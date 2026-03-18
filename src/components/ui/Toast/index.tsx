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
  const role = variant === 'error' || variant === 'warning' ? 'alert' : 'status';

  return (
    <div
      role={role}
      aria-live={role === 'alert' ? 'assertive' : 'polite'}
      className={cn(toastVariants({ variant }), className)}
      {...props}
    >
      {(title || onClose) && (
        <div>
          {title && <div>{title}</div>}
          {onClose && (
            <button type='button' onClick={onClose} aria-label='닫기'>
              닫기
            </button>
          )}
        </div>
      )}
      {description && <div>{description}</div>}
      {action && <div>{action}</div>}
    </div>
  );
}
