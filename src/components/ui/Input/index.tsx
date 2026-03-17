'use client';
import { cva, type VariantProps } from 'class-variance-authority';
import { forwardRef, useId, type InputHTMLAttributes } from 'react';
import { cn } from '@/lib/cn';

const inputVariants = cva('w-full border rounded px-3 py-2 outline-none', {
  variants: {
    hasError: {
      true: 'border-red-500', // 에러 시 빨간 테두리만 미리 지정
      false: 'border-gray-300', // 기본 상태
    },
  },
  defaultVariants: {
    hasError: false,
  },
});

interface InputProps extends InputHTMLAttributes<HTMLInputElement>, VariantProps<typeof inputVariants> {
  label?: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { label, error, className, type, ...props },
  ref,
) {
  const id = useId();
  const hasError = !!error;

  return (
    <div className='flex flex-col gap-1.5'>
      {label && (
        <label htmlFor={id} className='text-sm font-bold'>
          {label}
        </label>
      )}
      <input id={id} type={type} ref={ref} className={cn(inputVariants({ hasError }), className)} {...props} />
      {error && <p className='text-xs text-red-500'>{error}</p>}
    </div>
  );
});
