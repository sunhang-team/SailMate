'use client';

import { useState } from 'react';

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
  const [value, setValue] = useState('');
  const showToast = useToastStore((state) => state.showToast);

  const { mutate, isPending } = useCreateTodo(gatheringId, {
    onSuccess: () => {
      setValue('');
    },
    onError: (error: Error) => {
      showToast({
        variant: 'error',
        title: '할 일 추가 실패',
        description: error.message,
      });
    },
  });

  const submit = () => {
    const content = value.trim();
    if (!content) return;
    if (isPending) return;
    mutate({ week, content });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submit();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Escape') setValue('');
  };

  return (
    <form onSubmit={handleSubmit} className={cn('flex w-full gap-2', className)}>
      <input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={handleKeyDown}
        disabled={isPending}
        placeholder='할 일을 적어주세요'
        aria-label='할 일을 적어주세요'
        className='border-gray-150 bg-gray-0 text-body-01-r flex-1 rounded-lg border px-7 py-5 text-gray-900 outline-none placeholder:text-gray-300 focus:border-blue-200'
      />
      <Button
        type='submit'
        variant='check'
        disabled={isPending || !value.trim()}
        className='text-h5-sb h-18 w-50 shrink-0'
      >
        추가
      </Button>
    </form>
  );
}
