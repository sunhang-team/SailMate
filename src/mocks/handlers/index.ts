import { todosHandlers } from './todos';
import { authHandlers } from './auth';
import { usersHandlers } from './users';

export const handlers = [...todosHandlers, ...authHandlers, ...usersHandlers];
