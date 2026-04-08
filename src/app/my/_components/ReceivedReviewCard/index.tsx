import { Profile } from '@/components/ui/Profile';
import type { Review } from '@/api/reviews/types';

interface ReceivedReviewCardProps {
  review: Review;
  profileImage?: string;
}

const getDaysAgo = (dateStr: string): string => {
  const diff = Math.floor((Date.now() - new Date(dateStr).getTime()) / (1000 * 60 * 60 * 24));
  return `${diff}일전`;
};

export function ReceivedReviewCard({ review, profileImage }: ReceivedReviewCardProps) {
  const { reviewer, gatheringTitle, comment, createdAt } = review;

  return (
    <div className='border-gray-150 flex flex-col gap-3 rounded-lg border bg-gray-100 p-4'>
      <div className='flex items-start justify-between'>
        <div className='flex items-center gap-2'>
          <Profile imageUrl={profileImage} className='size-8 rounded-full' />
          <div className='flex flex-col'>
            <span className='text-small-02-sb md:text-body-02-sb text-gray-800'>{reviewer.nickname}</span>
            <p className='text-small-01-r md:text-small-02-r text-gray-600'>{gatheringTitle}</p>
          </div>
        </div>
        <span className='text-small-01-r text-gray-400'>{getDaysAgo(createdAt)}</span>
      </div>

      {comment && (
        <>
          <hr className='border-gray-150 border-t' />
          <p className='text-small-02-r md:text-body-02-r text-gray-700'>{comment}</p>
        </>
      )}
    </div>
  );
}
