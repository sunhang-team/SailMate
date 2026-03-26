import { cva, VariantProps } from 'class-variance-authority';
import { ButtonHTMLAttributes } from 'react';
import { cn } from '@/lib/cn';

const buttonVariants = cva('cursor-pointer transition-colors disabled:cursor-not-allowed', {
  variants: {
    variant: {
      primary: 'rounded-lg text-body-02-sb text-white',
      search: 'rounded-r-lg text-body-01-sb text-white bg-blue-300 disabled:bg-gray-300',
      'search-gradient': 'rounded-r-lg text-body-01-sb text-white bg-gradient-primary',
      check: 'rounded-lg text-small-01-sb text-white bg-blue-300 disabled:bg-gray-300',
      'login-outline': 'rounded-lg text-body-02-m text-gradient-primary border-gradient-primary',
      action: 'rounded-lg text-h5-b text-white',
      participation: 'rounded-lg text-small-01-sb text-white',
      'participation-outline-sm': 'rounded-lg text-small-01-sb text-blue-400 border-gradient-primary',
      'file-upload': 'rounded-lg text-body-01-sb text-gray-800 border border-gray-300',
      'participation-outline':
        'rounded-lg text-body-01-sb text-blue-400 border-gradient-primary disabled:bg-gray-100 disabled:text-gray-600 disabled:border disabled:border-gray-150 disabled:before:hidden',
      cancel: 'rounded-lg text-body-01-sb text-blue-300 bg-blue-50 aria-pressed:bg-blue-100',
      'mypage-edit': 'rounded-lg text-body-01-m text-gray-600 bg-gray-100 border border-gray-150',
      'icon-hand': 'rounded-lg flex items-center justify-center text-gray-400 bg-gray-150',
      tag: 'rounded-lg flex items-center justify-center text-body-02-sb text-blue-300 bg-blue-100',
      social: 'rounded-lg flex items-center justify-center gap-2 text-body-02-sb text-gray-800 border border-gray-300',
      'social-kakao': 'rounded-lg flex items-center justify-center gap-2 text-body-02-sb text-gray-800 bg-[#ffee01]',
      'keyword-search':
        'rounded-[50px] flex items-center gap-2 text-body-01-r text-blue-300 text-gradient-primary border-gradient-primary',
      dropdown: 'rounded-lg flex items-center justify-between px-3 text-body-01-m text-blue-300 bg-blue-100',
      'add-task': 'rounded-lg flex items-center justify-center gap-1 text-body-01-sb text-blue-300 bg-blue-50',
      fire: 'rounded-lg flex items-center justify-center bg-gray-150 data-[selected=true]:bg-gray-300',
      'write-review': 'rounded-lg flex items-center justify-center gap-2 text-body-01-sb text-blue-300 bg-blue-50',
      bookmark:
        'rounded-lg flex items-center justify-center bg-gray-0 border border-gray-200 text-gray-200 data-[selected=true]:text-red-200',
      'social-icon-kakao': 'rounded-lg flex items-center justify-center bg-[#ffee01]',
      'social-icon-google': 'rounded-lg flex items-center justify-center border border-gray-300',
      'social-icon-email': 'rounded-lg flex items-center justify-center border border-blue-100 text-blue-300',
    },
    size: {
      'join-login': 'h-14 w-124',
      'join-sm': 'h-[42px] w-20 text-body-02-m text-white',
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
      'icon-hand': 'h-12 w-12',
      tag: 'h-12 w-12',
      social: 'h-12 w-[242px]',
      'social-kakao': 'h-12 w-[242px]',
      'keyword-search': 'h-18 w-[258px] px-6',
      dropdown: 'h-10 w-[131px]',
      'add-task': 'h-18 w-[1624px]',
      fire: 'h-12 w-12',
      'write-review': 'h-18 w-[527px]',
      'bookmark-sm': 'h-11 w-11',
      'bookmark-lg': 'h-18 w-18 [border-width:1.64px]',
      'social-icon': 'h-10 w-12',
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
