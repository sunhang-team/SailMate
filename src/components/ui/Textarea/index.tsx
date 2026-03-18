import { TextareaHTMLAttributes } from 'react';
import { cva, VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/cn';

const textareaVariants = cva('w-full px-3 py-2 outline-none focus:ring-2 resize-none', {
  variants: {
    variant: {
      default: 'border border-gray-300 rounded-md',
    },
    size: {
      sm: 'text-sm',
      md: 'text-base',
      lg: 'text-base',
    },
    state: {
      default: '',
      error: 'border-red-500 focus:ring-red-500',
    },
  },
  defaultVariants: {
    variant: 'default',
    size: 'md',
    state: 'default',
  },
});

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement>, VariantProps<typeof textareaVariants> {}

export function Textarea({ variant, size, state, className, ...props }: TextareaProps) {
  const textareaClasses = cn(textareaVariants({ variant, size, state }), className);
  return <textarea className={textareaClasses} {...props} />;
}
