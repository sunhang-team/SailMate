import { updateTag } from 'next/cache';

export function invalidateServerCache(tag: string) {
  updateTag(tag);
}
