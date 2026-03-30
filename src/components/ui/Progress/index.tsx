import React from 'react';

import { cn } from '@/lib/cn';

interface ProgressBarProps {
  /** 진행률 (0~100) */
  value: number;
  /** 라벨 텍스트 (예: "달성률") — children이 없을 때 기본 헤더로 사용 */
  label?: string;
  /** 커스텀 헤더 콘텐츠 — label 대신 자유로운 레이아웃 가능 */
  children?: React.ReactNode;
  /** 바 트랙 커스텀 클래스 (높이 오버라이드 등, 기본: h-1.5) */
  barClassName?: string;
  className?: string;
  /** 레이아웃 방향 (기본: 'vertical') */
  layout?: 'vertical' | 'horizontal';
}

export function ProgressBar({
  value,
  label,
  children,
  barClassName,
  className,
  layout = 'vertical',
}: ProgressBarProps) {
  const clampedValue = Math.min(100, Math.max(0, value));

  if (layout === 'horizontal') {
    return (
      <div className={cn('flex items-center gap-4', className)}>
        <div className={cn('bg-gray-150 h-2 w-full flex-1 rounded-full', barClassName)}>
          <div
            className='bg-gradient-primary h-full rounded-full transition-all'
            style={{ width: `${clampedValue}%` }}
          />
        </div>
        {children
          ? children
          : label && (
              <div className='flex items-center gap-2 whitespace-nowrap'>
                <span className='text-body-02-m text-gray-800'>{label}</span>
                <span className='text-h5-b text-blue-300'>{clampedValue}%</span>
              </div>
            )}
      </div>
    );
  }

  return (
    <div className={cn('flex flex-col gap-2', className)}>
      {children
        ? children
        : label && (
            <div className='text-small-01-r flex items-center justify-between'>
              <span className='text-gray-800'>{label}</span>
              <span className='text-small-01-sb text-blue-300'>{clampedValue}%</span>
            </div>
          )}
      <div className={cn('bg-gray-150 h-2 w-full rounded-full', barClassName)}>
        <div className='bg-gradient-primary h-full rounded-full transition-all' style={{ width: `${clampedValue}%` }} />
      </div>
    </div>
  );
}
