import { cn } from '@/lib/cn';
import { PaginationIcon } from '@/components/ui/Icon/PaginationIcon';

const ELLIPSIS_THRESHOLD = 7; // 이 값 이하면 전체 페이지 표시, 초과하면 ... 사용
const DELTA = 1; // 현재 페이지 앞뒤로 보여줄 페이지 수

// 페이지가 많을 때 ... 포함한 번호 배열 반환
const getPageRange = (currentPage: number, totalPages: number): (number | '...')[] => {
  if (totalPages <= ELLIPSIS_THRESHOLD) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  const left = Math.max(2, currentPage - DELTA);
  const right = Math.min(totalPages - 1, currentPage + DELTA);
  const pages: (number | '...')[] = [1];

  if (left > 2) pages.push('...');
  for (let i = left; i <= right; i++) pages.push(i);
  if (right < totalPages - 1) pages.push('...');
  pages.push(totalPages);

  return pages;
};

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
          {getPageRange(currentPage, totalPages).map((item, index) =>
            item === '...' ? (
              <span key={`ellipsis-${index}`} className='text-body-02-m text-gray-300'>
                ...
              </span>
            ) : (
              <button
                key={item}
                onClick={() => onPageChange(item)}
                aria-label={`${item}페이지`}
                aria-current={item === currentPage ? 'page' : undefined}
                className={cn(
                  'text-body-02-m cursor-pointer transition-colors',
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
        disabled={isLast}
        aria-label='다음 페이지'
        className='cursor-pointer transition-colors enabled:hover:text-gray-500 disabled:cursor-not-allowed'
      >
        <PaginationIcon variant='next' className={cn('size-12', isLast && 'text-gray-300')} />
      </button>
    </div>
  );
}
