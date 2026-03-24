import { gatheringsHandlers } from './gatherings';
import { todosHandlers } from './todos';
import { authHandlers } from './auth';
import { usersHandlers } from './users';
import { membershipsHandlers } from './memberships';

export const handlers = [...todosHandlers, ...authHandlers, ...usersHandlers, ...membershipsHandlers];
