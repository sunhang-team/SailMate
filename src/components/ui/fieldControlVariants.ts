import { cva } from 'class-variance-authority';

/** default 상태: 포커스 시 그라데이션 테두리 */
export const fieldGradientFocusWrapperClass =
  'w-full rounded-md p-[2px] bg-transparent transition-[background-color] duration-150 focus-within:bg-gradient-primary';

/** Input / Textarea 내부 필드 — default · error · disabled */
export const fieldControlVariants = cva(
  [
    'w-full border px-3 py-2 text-sm leading-[1.6] text-gray-900',
    'placeholder:text-gray-400',
    'transition-[color,border-color] duration-150',
    'outline-none focus-visible:outline-none',
  ].join(' '),
  {
    variants: {
      state: {
        default: [
          'rounded-[calc(0.375rem-2px)] border-gray-200 bg-gray-50',
          'focus:border-transparent focus:text-gray-900',
        ].join(' '),
        error: [
          'rounded-md border-red-200 bg-gray-0',
          'focus:border-red-200 focus:ring-2 focus:ring-red-100 focus:ring-offset-0',
        ].join(' '),
      },
    },
    defaultVariants: {
      state: 'default',
    },
  },
);
