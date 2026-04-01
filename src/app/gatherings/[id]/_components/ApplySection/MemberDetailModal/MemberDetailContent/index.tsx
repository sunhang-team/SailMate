import { Modal } from '@/components/ui/Modal';
import { Pagination } from '@/components/ui/Pagination';
import { ProgressBar } from '@/components/ui/Progress';
import { IllustrationIcon } from '@/components/ui/Icon';
import { Tag } from '@/components/ui/Tag';
import { useMemberDetail } from '../../hooks/useMemberDetail';
import { KeywordTags } from './KeywordTags';

interface MemberDetailModalProps<T = boolean> {
  memberId: number;
  isOpen: boolean;
  onClose: (value: T) => void;
}

export function MemberDetailContent({ memberId }: Pick<MemberDetailModalProps, 'memberId'>) {
  const { page, setPage, userProfile, reviewsData, totalPages, aggregatedTags, isPending } = useMemberDetail(memberId);
  if (!userProfile) return null;

  return (
    <>
      <Modal.Header className='mt-6 flex gap-6'>
        <div className='h-19.75 w-19.75 shrink-0 overflow-hidden rounded-2xl bg-gray-100 shadow-sm md:h-32.75 md:w-32.75'>
          {userProfile.profileImage && (
            <img
              src={userProfile.profileImage}
              alt={`${userProfile.nickname} 프로필 이미지`}
              className='h-full w-full object-cover'
              onError={(e) => {
                (e.target as HTMLImageElement).src =
                  'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9IiNFMkU4RjAiLz48L3N2Zz4=';
              }}
            />
          )}
        </div>

        <div className='flex flex-1 flex-col justify-center'>
          <div className='mb-4 flex items-center gap-4'>
            <div className='text-body-02-b md:text-h3-b text-gray-900'>{userProfile.nickname}</div>
            <Tag variant='mate'>{userProfile.reputationLabel || '참여 메이트'}</Tag>
          </div>
          <ProgressBar value={userProfile.reputationScore || 0} barClassName='h-4'>
            <div className='text-small-02-m flex items-center justify-between'>
              <div className='text-small-02-m md:text-body-01-m text-gray-800'>활동 에너지</div>
              <div className='flex items-center gap-2'>
                <span className='text-small-02-sb md:text-body-01-sb text-blue-300'>
                  {userProfile.reputationScore || 0}점
                </span>
                <IllustrationIcon variant='fire' className='size-6 md:size-8' />
              </div>
            </div>
          </ProgressBar>
        </div>
      </Modal.Header>
      <Modal.Body className='scrollbar-hide custom-scrollbar flex max-h-[60vh] flex-col gap-4 overflow-y-auto'>
        <div className='border-gray-150 border-t px-5'></div>
        <div className='flex flex-col gap-2'>
          <div className='text-small-02-sb md:text-body-01-sb text-gray-900'>키워드 평가</div>
          <KeywordTags tags={aggregatedTags} />
        </div>
        <div className='flex w-full flex-col gap-3'>
          <div className='flex items-center justify-between'>
            <h3 className='text-small-02-sb md:text-body-01-sb text-gray-800'>
              받은 리뷰 <span className='text-blue-500'>{reviewsData?.totalCount || 0}</span>
            </h3>
          </div>
          <div className='flex w-full flex-col gap-6'>
            <ul className='flex w-full flex-col gap-2'>
              {reviewsData?.reviews.map((review) => (
                <li
                  key={review.id}
                  className='flex flex-col gap-2 rounded-xl border border-gray-100 bg-white p-2 shadow-sm'
                >
                  <div className='flex items-start justify-between'>
                    <div className='flex flex-col'>
                      <span className='text-xs font-semibold text-gray-800'>{review.gatheringTitle}</span>
                      <span className='mt-0.5 text-xs text-gray-400'>
                        작성자: {review.reviewer?.nickname || '익명'}
                      </span>
                    </div>
                    {review.createdAt && (
                      <span className='text-xs text-gray-400'>{new Date(review.createdAt).toLocaleDateString()}</span>
                    )}
                  </div>

                  <p className='mt-1 text-sm text-gray-700'>{review.comment}</p>

                  {review.tags && review.tags.length > 0 && (
                    <div className='mt-2 flex flex-wrap gap-1.5'>
                      {review.tags.map((tag, idx) => (
                        <span
                          key={idx}
                          className='rounded-md bg-blue-50 px-2 py-1 text-[11px] font-medium text-blue-500'
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Modal.Body>

      <Modal.Footer>
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
