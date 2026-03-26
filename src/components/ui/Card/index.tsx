import React, { HTMLAttributes } from 'react';
import { cva } from 'class-variance-authority';
import { cn } from '@/lib/cn';

const cardVariants = cva(
  'rounded-2xl border border-gray-150 bg-gray-0 shadow-01 transition-all hover:border-focus-100 hover:shadow-02',
);

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export function Card({ children, className, ...props }: CardProps) {
  const cardClasses = cn(cardVariants(), className);
  return (
    <div className={cardClasses} {...props}>
      {children}
    </div>
  );
}
