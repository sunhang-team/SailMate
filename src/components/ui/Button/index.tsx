import { cva, VariantProps } from 'class-variance-authority';
import { ButtonHTMLAttributes } from 'react';
import { cn } from '@/lib/cn';

const buttonVariants = cva('cursor-pointer transition-colors disabled:cursor-not-allowed', {
  variants: {
    variant: {
      primary:
        'rounded-lg text-body-02-sb leading-[var(--text-body-02-sb--line-height)] [font-weight:var(--text-body-02-sb--font-weight)] text-white',
      search:
        'rounded-r-lg text-body-01-sb leading-[var(--text-body-01-sb--line-height)] [font-weight:var(--text-body-01-sb--font-weight)] text-white bg-blue-300 disabled:bg-gray-300',
      'search-gradient':
        'rounded-r-lg text-body-01-sb leading-[var(--text-body-01-sb--line-height)] [font-weight:var(--text-body-01-sb--font-weight)] text-white bg-gradient-primary',
      check:
        'rounded-lg text-small-01-sb leading-[var(--text-small-01-sb--line-height)] [font-weight:var(--text-small-01-sb--font-weight)] text-white bg-blue-300 disabled:bg-gray-300',
      'login-outline':
        'rounded-lg text-body-02-m leading-[var(--text-body-02-m--line-height)] [font-weight:var(--text-body-02-m--font-weight)] text-gradient-primary border-gradient-primary',
      action:
        'rounded-lg text-h5-b leading-[var(--text-h5-b--line-height)] [font-weight:var(--text-h5-b--font-weight)] text-white',
      participation:
        'rounded-lg text-small-01-sb leading-[var(--text-small-01-sb--line-height)] [font-weight:var(--text-small-01-sb--font-weight)] text-white',
      'participation-outline-sm':
        'rounded-lg text-small-01-sb leading-[var(--text-small-01-sb--line-height)] [font-weight:var(--text-small-01-sb--font-weight)] text-blue-400 border-gradient-primary',
      'file-upload':
        'rounded-lg text-body-01-sb leading-[var(--text-body-01-sb--line-height)] [font-weight:var(--text-body-01-sb--font-weight)] text-gray-800 border border-gray-300',
      'participation-outline':
        'rounded-lg text-body-01-sb leading-[var(--text-body-01-sb--line-height)] [font-weight:var(--text-body-01-sb--font-weight)] text-blue-400 border-gradient-primary disabled:bg-gray-100 disabled:text-gray-600 disabled:border disabled:border-gray-150 disabled:before:hidden',
      cancel:
        'rounded-lg text-body-01-sb leading-[var(--text-body-01-sb--line-height)] [font-weight:var(--text-body-01-sb--font-weight)] text-blue-300 bg-blue-50 aria-pressed:bg-blue-100',
      'mypage-edit':
        'rounded-lg text-body-01-m leading-[var(--text-body-01-m--line-height)] [font-weight:var(--text-body-01-m--font-weight)] text-gray-600 bg-gray-100 border border-gray-150',
    },
    size: {
      'join-login': 'h-14 w-124',
      'join-sm':
        'h-[42px] w-20 text-body-02-m leading-[var(--text-body-02-m--line-height)] [font-weight:var(--text-body-02-m--font-weight)] text-white',
      'login-sm': 'h-[42px] w-[66px]',
      search: 'h-18 w-50',
      check: 'h-12 w-25',
      action: 'h-20 w-124',
      'participation-sm': 'h-11 w-[294px]',
      participation: 'h-18 w-[447px]',
      'file-upload': 'h-12 w-[122px]',
      'action-sm': 'h-20 w-75',
      cancel: 'h-18 w-[527px]',
      'mypage-edit': 'h-[60px] w-[394px]',
    },
  },
  defaultVariants: {
    variant: 'primary',
    size: 'join-login',
  },
});

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {}

export function Button({ children, variant, size, className, disabled, ...props }: ButtonProps) {
  return (
    <button
      className={cn(
        buttonVariants({ variant, size }),
        (variant === 'primary' || variant === 'action' || variant === 'participation') &&
          (disabled ? 'bg-gray-300' : 'bg-gradient-primary'),
        className,
      )}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
}
