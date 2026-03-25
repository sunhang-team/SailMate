import { todosHandlers } from './todos';
import { authHandlers } from './auth';
import { usersHandlers } from './users';
import { membershipsHandlers } from './memberships';
import { applicationsHandlers } from './applications';

export const handlers = [...todosHandlers, ...authHandlers, ...usersHandlers, ...membershipsHandlers, ...applicationsHandlers];
