'use client';

import { cn } from '@/lib/cn';

interface ErrorFallbackProps {
  /** 표시할 에러 메시지. */
  message: string;
  /** 재시도 버튼 클릭 시 호출되는 콜백 — `ErrorBoundary`의 `resetErrorBoundary` 함수를 연결한다. */
  onRetry: () => void;
  /** 재시도 버튼 라벨. 기본값 `'다시 시도'`. */
  retryLabel?: string;
  /** 외부 컨테이너 추가 클래스. 카테고리 필터 셀처럼 인라인 가로 배치가 필요할 때 사용. */
  className?: string;
}

/**
 * API 실패 시 표시하는 공통 에러 fallback UI.
 * 에러 메시지 + 재시도 버튼으로 구성되며 `ErrorBoundary`의 reset 함수를 `onRetry`로 연결해 사용한다.
 *
 * @example
 * <ErrorBoundary
 *   fallback={(_, reset) => (
 *     <ErrorFallback message='카테고리를 불러올 수 없습니다.' onRetry={reset} />
 *   )}
 * >
 *   <CategoryMultiSelectContainer />
 * </ErrorBoundary>
 */
export function ErrorFallback({ message, onRetry, retryLabel = '다시 시도', className }: ErrorFallbackProps) {
  return (
    <div role='alert' className={cn('flex flex-1 items-center justify-between px-5 py-4 md:px-7 md:py-5', className)}>
      <p className='text-small-01-r md:text-body-01-r text-gray-500'>{message}</p>
      <button type='button' onClick={onRetry} className='text-small-02-r text-blue-500 underline'>
        {retryLabel}
      </button>
    </div>
  );
}
