import { gatheringsHandlers } from './gatherings';
import { gatheringDraftsHandlers } from './gatheringDrafts';
import { todosHandlers } from './todos';
import { authHandlers } from './auth';
import { usersHandlers } from './users';
import { membershipsHandlers } from './memberships';
import { applicationsHandlers } from './applications';
import { achievementsHandlers } from './achievements';
import { reviewsHandlers } from './reviews';
import { likesHandlers } from './likes';
import { notificationsHandlers } from './notifications';
import { pushHandlers } from './push';

export const handlers = [
  ...todosHandlers,
  ...authHandlers,
  ...usersHandlers,
  ...membershipsHandlers,
  ...gatheringsHandlers,
  ...gatheringDraftsHandlers,
  ...achievementsHandlers,
  ...applicationsHandlers,
  ...reviewsHandlers,
  ...likesHandlers,
  ...notificationsHandlers,
  ...pushHandlers,
];
