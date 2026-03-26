import { cva } from 'class-variance-authority';

/**
 * default 상태: 포커스 시에만 border-gradient-primary(1px) 노출
 * - border-gradient-primary는 ::before로 1px 그라데이션 보더를 그림(globals.css)
 * - input/textarea는 ::before가 불안정하므로 래퍼에 적용
 */
export const fieldGradientFocusWrapperClass = [
  // 항상 동일한 외곽 크기/여백 유지 (포커스 시 내부 영역이 줄어든 것처럼 보이지 않게)
  'w-full rounded-md p-px',
  // default는 회색 보더, focus일 때만 그라데이션 보더로 전환
  'border border-gray-200 focus-within:border-transparent',
  // 그라데이션 보더(1px)는 ::before로 표현, focus일 때만 노출
  'border-gradient-primary before:opacity-0 focus-within:before:opacity-100',
  'before:transition-opacity before:duration-150',
].join(' ');

/** Input / Textarea 내부 필드 — default · error · disabled */
export const fieldControlVariants = cva(
  [
    'w-full px-3 py-2 text-sm leading-[1.6] text-gray-900',
    'placeholder:text-gray-400',
    'transition-[color,border-color] duration-150',
    'outline-none focus-visible:outline-none',
  ].join(' '),
  {
    variants: {
      state: {
        default: [
          // wrapper가 rounded-md를 가지고 있어 내부는 한 단계 작게
          'rounded-[calc(0.375rem-1px)] bg-gray-50',
          'focus:text-gray-900',
        ].join(' '),
        error: [
          'rounded-md border border-red-200 bg-gray-0',
          'focus:border-red-200 focus:ring-2 focus:ring-red-100 focus:ring-offset-0',
        ].join(' '),
      },
    },
    defaultVariants: {
      state: 'default',
    },
  },
);
