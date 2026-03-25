'use client';

import { useId, type ComponentPropsWithRef } from 'react';
import { fieldControlVariants, fieldGradientFocusWrapperClass } from '@/components/ui/fieldControlVariants';
import { cn } from '@/lib/cn';

type InputProps = ComponentPropsWithRef<'input'> & {
  label?: string;
  error?: string;
};

export function Input({ label, error, className, type, id: idProp, ref, ...props }: InputProps) {
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
      {hasError ? control : <div className={fieldGradientFocusWrapperClass}>{control}</div>}
      {error && (
        <p className='text-xs text-red-200' role='alert'>
          {error}
        </p>
      )}
    </div>
  );
}
