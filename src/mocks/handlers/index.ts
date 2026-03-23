import { todosHandlers } from './todos';
import { authHandlers } from './auth';

export const handlers = [...todosHandlers, ...authHandlers];
