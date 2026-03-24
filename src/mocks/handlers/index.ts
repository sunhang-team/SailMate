import { gatheringsHandlers } from './gatherings';
import { todosHandlers } from './todos';

export const handlers = [...gatheringsHandlers, ...todosHandlers];
