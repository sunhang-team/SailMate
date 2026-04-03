'use client';

import { useEffect, useRef, useState } from 'react';

import { useCreateTodo } from '@/api/todos/queries';
import { Button } from '@/components/ui/Button';
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

  const { mutate, isPending } = useCreateTodo(gatheringId, {
    onSuccess: () => {
      setValue('');
      setIsAdding(false);
    },
  });

  useEffect(() => {
    if (!isAdding) return;
    inputRef.current?.focus();
  }, [isAdding]);

  const submit = () => {
    const content = value.trim();
    if (!content) {
      // 빈 값이면 조용히 종료(입력 UI 닫기) — 피그마/요구사항의 인라인 UX 유지
      setValue('');
      setIsAdding(false);
      return;
    }
    if (isPending) return;
    mutate({ week, content });
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
    <div className={cn('w-full', className)}>
      <input
        ref={inputRef}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onBlur={submit}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            e.preventDefault();
            submit();
          }
          if (e.key === 'Escape') {
            setValue('');
            setIsAdding(false);
          }
        }}
        placeholder='할 일을 입력해 주세요'
        disabled={isPending}
        className='border-gray-150 bg-gray-0 text-body-02-r w-full rounded-lg border px-4 py-3 text-gray-900 outline-none placeholder:text-gray-300 focus:border-blue-200'
      />
    </div>
  );
}
