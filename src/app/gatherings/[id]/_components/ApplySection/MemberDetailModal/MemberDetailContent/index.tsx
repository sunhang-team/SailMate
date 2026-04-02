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

  if (!userProfile) return null;

  return (
    <>
      <Modal.Header className='mt-6 flex gap-6'>
        <ProfileHeader profile={userProfile} />
      </Modal.Header>

      <Modal.Body className='scrollbar-hide custom-scrollbar flex max-h-[60vh] flex-col gap-4 overflow-y-auto px-6'>
        <div className='border-gray-150 border-t' />
        <section className='flex flex-col gap-2'>
          <h3 className='text-small-02-sb md:text-body-01-sb text-gray-900'>키워드 평가</h3>
          <KeywordTags tags={aggregatedTags} />
        </section>
        <section className='flex w-full flex-col gap-3'>
          <h3 className='text-small-02-sb md:text-body-01-sb text-gray-800'>
            받은 리뷰 <span className='text-blue-500'>{reviewsData?.totalCount || 0}</span>
          </h3>

          <ul className='flex w-full flex-col gap-2'>
            {reviewsData?.reviews.map((review) => (
              <ReviewItem key={review.id} review={review} profileImg={reviewerProfilesMap[review.reviewer.id]} />
            ))}
          </ul>
        </section>
      </Modal.Body>

      <Modal.Footer className='px-6'>
        {totalPages > 1 && (
          <div className='mt-2 mb-12 flex w-full justify-center'>
            <Pagination
              disabled={isPending}
              variant='numbered'
              currentPage={page}
              totalPages={totalPages}
              onPageChange={setPage}
            />
          </div>
        )}
      </Modal.Footer>
    </>
  );
}
