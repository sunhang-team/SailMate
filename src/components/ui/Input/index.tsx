'use client';

import { useId, forwardRef, type ComponentPropsWithoutRef } from 'react';
import { fieldControlVariants, fieldGradientFocusWrapperClass } from '@/components/ui/fieldControlVariants';
import { cn } from '@/lib/cn';

type InputProps = ComponentPropsWithoutRef<'input'> & {
  label?: React.ReactNode;
  error?: string;
};

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { label, error, className, type, id: idProp, ...props },
  ref,
) {
  const uid = useId();
  const id = idProp ?? uid;
  const hasError = !!error;

  const control = (
    <input
      id={id}
      type={type}
      ref={ref}
      aria-invalid={hasError || undefined}
      className={cn(fieldControlVariants({ state: hasError ? 'error' : 'default' }), className)}
      {...props}
    />
  );

  return (
    <div className='flex flex-col gap-1.5'>
      {label && (
        <label htmlFor={id} className='text-sm font-bold text-gray-900'>
          {label}
        </label>
      )}
      <div className={cn(hasError ? 'w-full' : fieldGradientFocusWrapperClass)}>{control}</div>
      {error && (
        <p className='text-xs text-red-200' role='alert'>
          {error}
        </p>
      )}
    </div>
  );
});

Input.displayName = 'Input';
