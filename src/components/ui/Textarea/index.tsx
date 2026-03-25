'use client';

import { useId, type ComponentPropsWithRef } from 'react';
import { fieldControlVariants, fieldGradientFocusWrapperClass } from '@/components/ui/fieldControlVariants';
import { cn } from '@/lib/cn';

const sizeClassName = {
  lg: 'text-base min-h-[140px]',
} as const;

type TextareaProps = ComponentPropsWithRef<'textarea'> & {
  label?: string;
  error?: string;
  size?: keyof typeof sizeClassName;
};

export function Textarea({ label, error, className, id: idProp, ref, size = 'lg', rows, ...props }: TextareaProps) {
  const uid = useId();
  const id = idProp ?? uid;
  const hasError = !!error;

  const control = (
    <textarea
      id={id}
      ref={ref}
      rows={rows ?? 4}
      aria-invalid={hasError || undefined}
      className={cn(
        fieldControlVariants({ state: hasError ? 'error' : 'default' }),
        sizeClassName[size],
        'resize-y',
        className,
      )}
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
