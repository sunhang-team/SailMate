import { Tag } from '@/components/ui/Tag';
import { REVIEW_TAGS } from '@/api/reviews/schemas';
import type { ReviewTag } from '@/api/reviews/types';

interface KeywordSummaryCardProps {
  reviews: { tags: ReviewTag[] }[];
}

export function KeywordSummaryCard({ reviews }: KeywordSummaryCardProps) {
  const counts = REVIEW_TAGS.reduce<Record<ReviewTag, number>>(
    (acc, tag) => ({ ...acc, [tag]: 0 }),
    {} as Record<ReviewTag, number>,
  );
  reviews.forEach(({ tags }) =>
    tags.forEach((tag) => {
      counts[tag] += 1;
    }),
  );

  return (
    <div className='border-gray-150 bg-gray-0 shadow-02 flex flex-col gap-4 rounded-lg border p-6'>
      <span className='text-h5-sb text-gray-900'>키워드 평가</span>
      <div className='rounded-lg bg-gray-100 p-4'>
        <div className='flex flex-wrap gap-2'>
          {REVIEW_TAGS.map((tag) => (
            <Tag key={tag} variant='bad' count={counts[tag]}>
              {tag}
            </Tag>
          ))}
        </div>
      </div>
    </div>
  );
}
