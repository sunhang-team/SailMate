import { cn } from '@/lib/cn';
import { ReviewIcon } from '@/components/ui/Icon';

interface ReviewButtonProps {
  hasReviewed: boolean;
  onClick: () => void;
}

export function ReviewButton({ hasReviewed, onClick }: ReviewButtonProps) {
  if (hasReviewed) {
    return (
      <span
        className={cn(
          'inline-flex items-center justify-center rounded-lg bg-blue-50',
          'text-small-02-sb md:text-small-01-sb h-[32px] w-[85px] text-blue-300 md:h-[48px] md:w-[124px]',
        )}
      >
        리뷰 작성 완료
      </span>
    );
  }

  return (
    <button
      type='button'
      onClick={onClick}
      className={cn(
        'inline-flex cursor-pointer items-center justify-center gap-1 rounded-lg',
        'text-small-02-sb md:text-small-01-sb h-[32px] w-[85px] text-white md:h-[48px] md:w-[124px]',
        'bg-blue-300 transition-opacity hover:opacity-90',
      )}
    >
      <ReviewIcon className='size-[12px] md:size-[16px]' />
      리뷰 쓰기
    </button>
  );
}
