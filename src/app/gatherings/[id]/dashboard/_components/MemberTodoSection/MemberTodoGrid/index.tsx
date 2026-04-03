'use client';

import { MemberTodoItem } from '../MemberTodoItem';

import type { Todo } from '@/api/todos/types';

interface MemberTodoGridProps {
  todos: Todo[];
}

export function MemberTodoGrid({ todos }: MemberTodoGridProps) {
  if (todos.length === 0) {
    return (
      <div className='bg-gray-25/50 text-body-02-r flex h-24 items-center justify-center rounded-xl border border-dashed border-gray-200 text-gray-400'>
        이번 주 할 일이 없습니다.
      </div>
    );
  }

  return (
    <div className='grid grid-cols-1 gap-3 lg:grid-cols-2 xl:gap-4'>
      {todos.map((todo) => (
        <MemberTodoItem key={todo.id} content={todo.content} isCompleted={todo.isCompleted} />
      ))}
    </div>
  );
}
