'use client';

import { useState } from 'react';

import { Input } from '@/components/ui/Input';
import { Tag } from '@/components/ui/Tag';

const MAX_TAGS = 5;

interface TagInputProps {
  value: string[];
  onChange: (tags: string[]) => void;
  error?: string;
}

export function TagInput({ value, onChange, error }: TagInputProps) {
  const [inputValue, setInputValue] = useState('');

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key !== 'Enter') return;
    e.preventDefault();

    const trimmed = inputValue.trim();
    const isDuplicate = value.includes(trimmed);
    const isAtLimit = value.length >= MAX_TAGS;

    if (!trimmed || isDuplicate || isAtLimit) return;

    onChange([...value, trimmed]);
    setInputValue('');
  };

  const handleRemove = (tag: string) => {
    onChange(value.filter((t) => t !== tag));
  };

  return (
    <div className='flex flex-col gap-2'>
      <Input
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder='태그를 입력하고 Enter를 누르세요'
        disabled={value.length >= MAX_TAGS}
        error={error}
        className='text-small-02-r md:text-body-02-r lg:text-body-01-r'
      />
      {value.length > 0 && (
        <div className='flex flex-wrap gap-2'>
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
        </div>
      )}
    </div>
  );
}
