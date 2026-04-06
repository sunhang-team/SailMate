'use client';

import { useEffect, useMemo, useRef, useState } from 'react';

import { useQueryClient } from '@tanstack/react-query';

import { todoKeys, useDeleteTodo, useUpdateTodo } from '@/api/todos/queries';
import { Dropdown } from '@/components/ui/Dropdown';
import { CheckIcon, MoreIcon, IllustrationIcon, CloseIcon } from '@/components/ui/Icon';
import { cn } from '@/lib/cn';

import type { MyTodoListResponse, Todo } from '@/api/todos/types';

interface TodoItemProps {
  gatheringId: number;
  week: number;
  todo: Todo;
}

interface OptimisticContext {
  prev?: MyTodoListResponse;
}

const STREAK_PLACEHOLDER = 3;

export function TodoItem({ gatheringId, week, todo }: TodoItemProps) {
  const queryClient = useQueryClient();

  const queryKey = useMemo(() => todoKeys.myList(gatheringId, { week }), [gatheringId, week]);

  const { mutate: updateTodo, isPending: isUpdating } = useUpdateTodo(gatheringId, {
    onMutate: async (variables): Promise<unknown> => {
      const { todoId, body } = variables;
      if (body.isCompleted === undefined) return {} as OptimisticContext;

      // 체크 토글은 즉시 UI 반영이 중요해서 낙관적 업데이트로 처리합니다.
      // (실패 시 onError에서 이전 캐시로 롤백)
      await queryClient.cancelQueries({ queryKey });

      const prev = queryClient.getQueryData<MyTodoListResponse>(queryKey);
      if (!prev) return { prev } as OptimisticContext;

      queryClient.setQueryData<MyTodoListResponse>(queryKey, {
        ...prev,
        todos: prev.todos.map((t) => (t.id === todoId ? { ...t, isCompleted: body.isCompleted ?? t.isCompleted } : t)),
      });

      return { prev } as OptimisticContext;
    },
    onError: (_err, _variables, context) => {
      // `useUpdateTodo`의 mutation context 타입이 unknown이라, 우리가 반환한 형태로 좁혀서 안전하게 롤백합니다.
      const prev = (context as OptimisticContext | undefined)?.prev;
      if (prev) queryClient.setQueryData(queryKey, prev);
    },
    onSettled: () => {
      // 서버 상태와의 차이를 정리하기 위해 최종적으로 재동기화합니다.
      queryClient.invalidateQueries({ queryKey: todoKeys.all(gatheringId) });
    },
  });

  const { mutate: deleteTodo, isPending: isDeleting } = useDeleteTodo(gatheringId);

  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState(() => todo.content);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!isEditing) return;
    inputRef.current?.focus();
    inputRef.current?.select();
  }, [isEditing]);

  const isBusy = isUpdating || isDeleting;

  const toggleCompleted = () => {
    if (isBusy) return;
    updateTodo({ todoId: todo.id, body: { isCompleted: !todo.isCompleted } });
  };

  const submitEdit = () => {
    // blur/Enter에서 저장되는 UX를 위해, 편집 종료 → 유효성/동일값 체크 → mutation 순으로 처리합니다.
    const next = draft.trim();
    setIsEditing(false);

    if (!next) {
      setDraft(todo.content);
      return;
    }

    if (next === todo.content) return;
    if (isBusy) return;

    updateTodo({ todoId: todo.id, body: { content: next } });
  };

  const handleDelete = () => {
    if (isBusy) return;
    const ok = window.confirm('이 할 일을 삭제할까요?');
    if (!ok) return;
    deleteTodo(todo.id);
  };

  return (
    <li
      className={cn(
        'border-gray-150 flex items-center gap-2 rounded-lg border px-4 py-4 transition-colors md:gap-3 md:px-6 lg:px-7 lg:py-5',
        todo.isCompleted ? 'bg-gray-100 hover:bg-gray-100' : 'bg-gray-0 hover:bg-gray-50',
      )}
    >
      <button
        type='button'
        aria-label={todo.isCompleted ? '완료 해제' : '완료 처리'}
        onClick={toggleCompleted}
        disabled={isBusy}
        className={cn(
          'border-gray-150 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border bg-gray-100 transition-colors md:h-12 md:w-12',
          todo.isCompleted && 'border-blue-300 bg-blue-300',
        )}
      >
        {todo.isCompleted && <CheckIcon size={26} className='text-gray-0 md:size-10' />}
      </button>

      <div className='min-w-0 flex-1'>
        {isEditing ? (
          <input
            ref={inputRef}
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onBlur={submitEdit}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                submitEdit();
              }
              if (e.key === 'Escape') {
                setDraft(todo.content);
                setIsEditing(false);
              }
            }}
            disabled={isBusy}
            className='border-gray-150 text-body-02-r bg-gray-0 w-full rounded-md border px-3 py-2 text-gray-900 outline-none focus:border-blue-200'
          />
        ) : (
          <p
            className={cn(
              'text-small-01-r md:text-body-01-r truncate text-gray-900',
              todo.isCompleted && 'text-gray-500 line-through',
            )}
            title={todo.content}
          >
            {todo.content}
          </p>
        )}
      </div>

      {todo.isCompleted && (
        <div className='flex items-center gap-1 text-gray-600'>
          <span aria-hidden>
            <IllustrationIcon variant='fire' size={24} className='md:size-8' />
          </span>
          <span className='text-small-02-r md:text-body-02-r'>
            <CloseIcon size={12} className='md:size-4' /> {STREAK_PLACEHOLDER}
          </span>
        </div>
      )}

      <Dropdown className='shrink-0'>
        <Dropdown.Trigger>
          <span className='inline-flex min-h-10 min-w-10 items-center justify-center rounded-lg'>
            <MoreIcon size={32} className='text-gray-700' />
          </span>
        </Dropdown.Trigger>
        <Dropdown.Menu className='h-[80px] w-[80px] gap-3 px-3 py-2'>
          <Dropdown.Item
            onClick={() => {
              setDraft(todo.content);
              setIsEditing(true);
            }}
            className='text-body-02-r cursor-pointer text-gray-500'
          >
            수정
          </Dropdown.Item>
          <Dropdown.Item onClick={handleDelete} className='text-body-02-r cursor-pointer text-gray-900'>
            삭제
          </Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
    </li>
  );
}
