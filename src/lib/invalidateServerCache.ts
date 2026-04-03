'use server';

import { updateTag } from 'next/cache';

export const invalidateServerCache = async (tag: string) => {
  updateTag(tag);
};
