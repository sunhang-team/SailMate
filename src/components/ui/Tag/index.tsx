import { type HTMLAttributes, type ReactNode } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/cn';

const tagVariants = cva('', {
  variants: {
    variant: {
      category: '',
      status: '',
      tag: '',
    },
  },
  defaultVariants: {
    variant: 'tag',
  },
});

interface TagProps extends HTMLAttributes<HTMLSpanElement>, VariantProps<typeof tagVariants> {
  children: ReactNode;
}

export function Tag({ children, variant, className, ...props }: TagProps) {
  return (
    <span className={cn(tagVariants({ variant }), className)} {...props}>
      {children}
    </span>
  );
}
