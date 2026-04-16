'use client';

import { useEffect, useRef, useState } from 'react';

import { useCreateTodo } from '@/api/todos/queries';
import { Button } from '@/components/ui/Button';
import { useToastStore } from '@/components/ui/Toast/useToastStore';
import { cn } from '@/lib/cn';

interface TodoAddFormProps {
  gatheringId: number;
  week: number;
  className?: string;
}

export function TodoAddForm({ gatheringId, week, className }: TodoAddFormProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [value, setValue] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const showToast = useToastStore((state) => state.showToast);

  const closeForm = () => {
    setValue('');
    setIsAdding(false);
  };

  const { mutate, isPending } = useCreateTodo(gatheringId, {
    onSuccess: () => {
      closeForm();
    },
    onError: (error: Error) => {
      showToast({
        variant: 'error',
        title: '할 일 추가 실패',
        description: error.message,
      });
    },
  });

  useEffect(() => {
    if (isAdding) inputRef.current?.focus();
  }, [isAdding]);

  const submit = () => {
    const content = value.trim();
    if (!content) return closeForm();
    if (isPending) return;
    mutate({ week, content });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submit();
  };

  const handleBlur = () => {
    if (!value.trim()) closeForm();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Escape') closeForm();
  };

  if (!isAdding) {
    return (
      <Button
        variant='add-task'
        onClick={() => setIsAdding(true)}
        className={cn('text-small-01-sb md:text-body-01-sb h-13 w-full md:h-18', className)}
      >
        + 할 일 추가
      </Button>
    );
  }

  return (
    <form onSubmit={handleSubmit} className={cn('flex w-full gap-2', className)}>
      <input
        ref={inputRef}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={handleKeyDown}
        onBlur={handleBlur}
        disabled={isPending}
        placeholder='할 일을 입력해 주세요'
        aria-label='할 일을 입력해 주세요'
        className='border-gray-150 bg-gray-0 text-body-02-r flex-1 rounded-lg border px-4 py-3 text-gray-900 outline-none placeholder:text-gray-300 focus:border-blue-200'
      />
      <Button
        type='submit'
        variant='check'
        size='check'
        disabled={isPending || !value.trim()}
        className='h-auto shrink-0 px-4 py-3'
      >
        추가
      </Button>
    </form>
  );
}
