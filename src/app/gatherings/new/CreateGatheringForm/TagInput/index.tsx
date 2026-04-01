'use client';

import { useState } from 'react';

import { fieldGradientFocusWrapperClass } from '@/components/ui/fieldControlVariants';
import { Tag } from '@/components/ui/Tag';
import { cn } from '@/lib/cn';

const MAX_TAGS = 5;

interface TagInputProps {
  value: string[];
  onChange: (tags: string[]) => void;
  onBlur?: () => void;
  error?: string;
}

export function TagInput({ value, onChange, onBlur, error }: TagInputProps) {
  const [inputValue, setInputValue] = useState('');
  const hasError = !!error;

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key !== 'Enter') return;
    e.preventDefault();

    const trimmed = inputValue.trim();
    const isDuplicate = value.includes(trimmed);
    const isAtLimit = value.length >= MAX_TAGS;

    // 빈 값, 중복, 최대 개수 초과 시 silently 무시
    if (!trimmed || isDuplicate || isAtLimit) return;

    onChange([...value, trimmed]);
    setInputValue('');
  };

  const handleRemove = (tag: string) => {
    onChange(value.filter((t) => t !== tag));
  };

  return (
    <div className='flex flex-col gap-1.5'>
      <div className={hasError ? 'bg-gray-0 rounded-md border border-red-200' : fieldGradientFocusWrapperClass}>
        <div
          className={cn(
            'flex flex-wrap items-center gap-2 px-3 py-2',
            !hasError && 'rounded-[calc(0.375rem-1px)] bg-gray-50',
          )}
        >
          {value.map((tag) => (
            <Tag
              key={tag}
              variant='hashtag'
              onRemove={() => handleRemove(tag)}
              className='text-small-02-r md:text-body-02-r lg:text-body-01-r px-2 py-0.5 md:px-2.5 md:py-1 lg:px-3 lg:py-1'
            >
              #{tag}
            </Tag>
          ))}
          <input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={value.length === 0 ? '태그를 입력해주세요 (최대 5개)' : ''}
            disabled={value.length >= MAX_TAGS}
            onBlur={onBlur}
            className='text-small-02-r md:text-body-02-r lg:text-body-01-r min-w-0 flex-1 bg-transparent outline-none placeholder:text-gray-400'
          />
        </div>
      </div>
      {error && (
        <p className='text-xs text-red-200' role='alert'>
          {error}
        </p>
      )}
    </div>
  );
}
