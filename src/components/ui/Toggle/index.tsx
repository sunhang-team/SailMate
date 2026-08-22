'use client';

import { cn } from '@/lib/cn';

interface ToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  className?: string;
  'aria-label'?: string;
}

export function Toggle({ checked, onChange, disabled, className, 'aria-label': ariaLabel }: ToggleProps) {
  return (
    <button
      type='button'
      role='switch'
      aria-checked={checked}
      aria-label={ariaLabel}
      disabled={disabled}
      onClick={() => onChange(!checked)}
      className={cn(
        'relative h-7 w-12 shrink-0 rounded-full transition-colors disabled:cursor-not-allowed disabled:opacity-50',
        checked ? 'bg-blue-300' : 'bg-gray-300',
        className,
      )}
    >
      <span
        className={cn(
          'absolute top-0.5 left-0.5 size-6 rounded-full bg-white transition-transform',
          checked && 'translate-x-5',
        )}
      />
    </button>
  );
}
