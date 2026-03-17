import { cva, VariantProps } from 'class-variance-authority';
import React, { ButtonHTMLAttributes } from 'react';
import { cn } from '@/lib/cn';

const buttonVariants = cva(
  // 기본 스타일 (항상 적용)
  '',
  {
    variants: {
      // variant 옵션들
      variant: {},
      // size 옵션들
      size: {},
    },
    // 기본값 설정
    defaultVariants: {},
  },
);

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
  children: React.ReactNode;
}

export function Button({ children, variant, size, className, ...props }: ButtonProps) {
  const buttonClasses = cn(buttonVariants({ variant, size }), className);
  return (
    <button className={buttonClasses} {...props}>
      {children}
    </button>
  );
}
