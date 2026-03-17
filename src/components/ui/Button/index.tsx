import { cva, VariantProps } from 'class-variance-authority';
import React, { ButtonHTMLAttributes } from 'react';
import { cn } from '@/lib/cn';

const buttonVariants = cva('', {
  variants: {
    variant: {},
    size: {},
  },
  defaultVariants: {},
});

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
