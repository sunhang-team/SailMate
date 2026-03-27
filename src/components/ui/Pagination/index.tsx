import { cn } from '@/lib/cn';
import { PaginationIcon } from '@/components/ui/Icon/PaginationIcon';

interface PaginationBaseProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
}

type NumberedPaginationProps = PaginationBaseProps & { variant: 'numbered' };
type SimplePaginationProps = PaginationBaseProps & { variant: 'simple' };
type PaginationProps = NumberedPaginationProps | SimplePaginationProps;

export function Pagination({ variant, currentPage, totalPages, onPageChange, className }: PaginationProps) {
  const isFirst = currentPage === 1;
  const isLast = currentPage === totalPages;

  return (
    <div className={cn('flex items-center justify-center', variant === 'numbered' ? 'gap-10' : 'gap-3', className)}>
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={isFirst}
        aria-label='이전 페이지'
        className='cursor-pointer transition-colors enabled:hover:text-gray-500 disabled:cursor-not-allowed'
      >
        <PaginationIcon variant='prev' className={cn('size-12', isFirst && 'text-gray-300')} />
      </button>

      {variant === 'numbered' && (
        <div className='flex items-center justify-center gap-6'>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => onPageChange(page)}
              aria-label={`${page}페이지`}
              aria-current={page === currentPage ? 'page' : undefined}
              className={cn(
                'text-body-02-m cursor-pointer transition-colors',
                page === currentPage ? 'text-gray-700' : 'text-gray-300 hover:text-gray-500',
              )}
            >
              {page}
            </button>
          ))}
        </div>
      )}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={isLast}
        aria-label='다음 페이지'
        className='cursor-pointer transition-colors enabled:hover:text-gray-500 disabled:cursor-not-allowed'
      >
        <PaginationIcon variant='next' className={cn('size-12', isLast && 'text-gray-300')} />
      </button>
    </div>
  );
}
