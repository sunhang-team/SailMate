import { gatheringsHandlers } from './gatherings';
import { todosHandlers } from './todos';
import { authHandlers } from './auth';
import { usersHandlers } from './users';
import { membershipsHandlers } from './memberships';
import { applicationsHandlers } from './applications';
import { achievementsHandlers } from './achievements';

export const handlers = [
  ...todosHandlers,
  ...authHandlers,
  ...usersHandlers,
  ...membershipsHandlers,
  ...gatheringsHandlers,
  ...achievementsHandlers,
];
