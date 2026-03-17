import React, { forwardRef, useId } from 'react';
import { cn } from '../../../lib/utils'; // cn 유틸리티 사용 가정

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string; // 라벨 텍스트
  error?: string; // 에러 메시지
  wrapperClassName?: string; // 라벨 + 인풋 + 에러 메시지 컨테이너
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, wrapperClassName, className, ...props }, ref) => {
    const id = useId();

    return (
      <div className={cn('flex flex-col gap-1.5', wrapperClassName)}>
        {label && (
          <label htmlFor={id} className='text-sm font-medium'>
            {label}
          </label>
        )}

        <input
          id={id}
          ref={ref}
          className={cn('w-full outline-none', error && 'border-red-500', className)}
          {...props}
        />

        {/* Error Message: 에러가 있을 때만 텍스트 노출 */}
        {error && <p className='text-xs text-red-500'>{error}</p>}
      </div>
    );
  },
);

Input.displayName = 'Input';

export { Input };
