'use client';

import {
  useQueryParams,
  parseAsString,
  parseAsStringEnum,
  parseAsInteger,
  parseAsArray,
} from '@frontend-toolkit-js/hooks';

import { GATHERING_TYPES } from '@/constants/gathering';

const SORT_OPTIONS = ['latest', 'popular', 'deadline'] as const;
const STATUS_OPTIONS = ['RECRUITING', 'ALL'] as const;

export const useGatheringSearchParams = () => {
  return useQueryParams({
    query: parseAsString.withDefault(''),
    type: parseAsStringEnum(GATHERING_TYPES),
    categoryIds: parseAsArray(parseAsInteger).withDefault([]),
    sort: parseAsStringEnum(SORT_OPTIONS).withDefault('latest'),
    status: parseAsStringEnum(STATUS_OPTIONS).withDefault('RECRUITING'),
    page: parseAsInteger.withDefault(1),
  });
};
