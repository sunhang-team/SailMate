'use client';

import { Modal } from '@/components/ui/Modal';
import { Pagination } from '@/components/ui/Pagination';

import { useMemberDetail } from '../../hooks/useMemberDetail';
import { KeywordTags } from './KeywordTags';
import { ProfileHeader } from './ProfileHeader';
import { ReviewItem } from './ReviewItem';

interface MemberDetailModalProps<T = boolean> {
  memberId: number;
  isOpen: boolean;
  onClose: (value: T) => void;
}

export function MemberDetailContent({ memberId }: Pick<MemberDetailModalProps, 'memberId'>) {
  const { page, setPage, userProfile, reviewsData, totalPages, aggregatedTags, isPending, reviewerProfilesMap } =
    useMemberDetail(memberId);

  return (
    <>
      <Modal.Header className='px-5 pt-7 pb-4 min-[744px]:px-7 min-[744px]:pt-12 min-[744px]:pb-8'>
        <ProfileHeader profile={userProfile} />
      </Modal.Header>

      <Modal.Body className='scrollbar-hide custom-scrollbar flex flex-1 flex-col gap-6 overflow-y-auto px-5 py-0 min-[744px]:gap-8 min-[744px]:px-7'>
        <div className='border-gray-150 border-t' />
        <section className='flex flex-col gap-2 min-[744px]:gap-4'>
          <h3 className='text-small-02-sb min-[744px]:text-body-01-sb text-gray-900'>키워드 평가</h3>
          <KeywordTags tags={aggregatedTags} />
        </section>
        <section className='flex w-full flex-col gap-2 min-[744px]:gap-4'>
          <h3 className='text-small-02-sb min-[744px]:text-body-01-sb text-gray-800'>
            받은 리뷰 <span className='text-gray-600'>{reviewsData?.totalCount || 0}</span>
          </h3>

          <ul className='flex w-full flex-col gap-2 min-[744px]:gap-4 lg:gap-6'>
            {reviewsData?.reviews.map((review) => (
              <ReviewItem key={review.id} review={review} profileImg={reviewerProfilesMap[review.reviewer.id]} />
            ))}
          </ul>
        </section>
      </Modal.Body>

      <Modal.Footer className='px-5 pt-6 pb-7 min-[744px]:px-7 min-[744px]:pt-8 min-[744px]:pb-12'>
        {totalPages > 1 && (
          <div className='flex w-full justify-center'>
            <Pagination
              disabled={isPending}
              variant='numbered'
              currentPage={page}
              totalPages={totalPages}
              onPageChange={setPage}
              className='min-[744px]:[&_button]:text-body-02-m min-[744px]:gap-10 min-[744px]:[&_svg]:size-12'
            />
          </div>
        )}
      </Modal.Footer>
    </>
  );
}
