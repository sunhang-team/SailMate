'use client';

import { cn } from '@/lib/cn';
import { getPageRange } from '@/lib/getPageRange';
import { PaginationIcon } from '@/components/ui/Icon/PaginationIcon';

interface PaginationBaseProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
  disabled?: boolean;
}

type NumberedPaginationProps = PaginationBaseProps & { variant: 'numbered' };
type SimplePaginationProps = PaginationBaseProps & { variant: 'simple' };
type PaginationProps = NumberedPaginationProps | SimplePaginationProps;

export function Pagination({
  disabled = false,
  variant,
  currentPage,
  totalPages,
  onPageChange,
  className,
}: PaginationProps) {
  const isFirst = currentPage === 1;
  const isLast = currentPage === totalPages;

  return (
    <div
      className={cn(
        'flex items-center justify-center',
        variant === 'numbered' ? 'gap-6 md:gap-10' : 'gap-3',
        className,
      )}
    >
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={isFirst || disabled}
        aria-label='이전 페이지'
        className='cursor-pointer transition-colors enabled:hover:text-gray-500 disabled:cursor-not-allowed'
      >
        <PaginationIcon variant='prev' className={cn('size-8 md:size-12', (isFirst || disabled) && 'text-gray-300')} />
      </button>

      {variant === 'numbered' && (
        <div className='flex items-center justify-center gap-4 md:gap-6'>
          {getPageRange(currentPage, totalPages).map((item, index) =>
            item === '...' ? (
              <span key={`ellipsis-${index}`} className='text-small-02-m md:text-body-02-m text-gray-300'>
                ...
              </span>
            ) : (
              <button
                key={item}
                disabled={disabled}
                onClick={() => onPageChange(item)}
                aria-label={`${item}페이지`}
                aria-current={item === currentPage ? 'page' : undefined}
                className={cn(
                  'text-small-02-m md:text-body-02-m cursor-pointer transition-colors disabled:cursor-not-allowed',
                  item === currentPage ? 'text-gray-700' : 'text-gray-300 hover:text-gray-500',
                )}
              >
                {item}
              </button>
            ),
          )}
        </div>
      )}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={isLast || disabled}
        aria-label='다음 페이지'
        className='cursor-pointer transition-colors enabled:hover:text-gray-500 disabled:cursor-not-allowed'
      >
        <PaginationIcon variant='next' className={cn('size-8 md:size-12', (isLast || disabled) && 'text-gray-300')} />
      </button>
    </div>
  );
}
