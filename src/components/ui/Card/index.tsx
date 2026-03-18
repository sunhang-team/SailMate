import React, { HTMLAttributes } from 'react';
import { cva, VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/cn';

const cardVariants = cva('', {
  variants: {
    variant: {},
    size: {},
    interactive: {},
  },
  defaultVariants: {},
});

interface CardProps extends HTMLAttributes<HTMLDivElement>, VariantProps<typeof cardVariants> {
  children: React.ReactNode;
}

export function Card({ children, variant, size, interactive, className, ...props }: CardProps) {
  const cardClasses = cn(cardVariants({ variant, size, interactive }), className);
  return (
    <div className={cardClasses} {...props}>
      {children}
    </div>
  );
}
