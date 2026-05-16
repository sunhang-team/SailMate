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

  const trimmedInput = inputValue.trim();
  const isButtonDisabled = !trimmedInput || value.length >= MAX_TAGS || value.includes(trimmedInput);

  const handleAdd = () => {
    if (isButtonDisabled) return;
    onChange([...value, trimmedInput]);
    setInputValue('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key !== 'Enter' || e.nativeEvent.isComposing) return;
    e.preventDefault();
    handleAdd();
  };

  const handleRemove = (tag: string) => {
    onChange(value.filter((t) => t !== tag));
  };

  return (
    <div className='flex flex-col gap-1.5'>
      <div className='flex items-stretch gap-3'>
        <div
          className={cn(
            hasError ? 'bg-gray-0 rounded-md border border-red-200' : fieldGradientFocusWrapperClass,
            'flex-1',
          )}
        >
          <div
            className={cn(
              'flex min-h-[43px] flex-wrap items-center gap-2 px-3 py-2 md:min-h-[58px] lg:min-h-[72px] lg:px-7',
              !hasError && 'bg-gray-0 rounded-[calc(0.375rem-1px)]',
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
        <button
          type='button'
          onClick={handleAdd}
          disabled={isButtonDisabled}
          className={cn(
            'text-small-01-sb md:text-body-01-sb lg:text-h5-sb text-gray-0 w-[80px] shrink-0 rounded-lg transition-colors md:w-[140px] lg:w-[200px]',
            isButtonDisabled ? 'bg-gray-300' : 'bg-gradient-primary',
          )}
        >
          추가
        </button>
      </div>
      {error && (
        <p className='text-xs text-red-200' role='alert'>
          {error}
        </p>
      )}
    </div>
  );
}
