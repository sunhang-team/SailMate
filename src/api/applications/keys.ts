export const applicationKeys = {
  all: ['applications'] as const,
  list: (gatheringId: number) => [...applicationKeys.all, 'list', gatheringId] as const,
  myList: () => [...applicationKeys.all, 'myList'] as const,
};
