'use client';

import { useState } from 'react';

import { Modal } from '@/components/ui/Modal';
import { Profile } from '@/components/ui/Profile';
import { Button } from '@/components/ui/Button';
import { CloseIcon } from '@/components/ui/Icon';
import { cn } from '@/lib/cn';
import { useReviewMutations } from '@/api/reviews/queries';
import { REVIEW_TAGS } from '@/api/reviews/schemas';
import type { ReviewTag } from '@/api/reviews/types';
import type { Member } from '@/api/memberships/types';
import { useToastStore } from '@/components/ui/Toast/useToastStore';

interface ReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  member: Member;
  achievedWeeks: number;
  totalWeeks: number;
  gatheringId: number;
}

export function ReviewModal({ isOpen, onClose, member, achievedWeeks, totalWeeks, gatheringId }: ReviewModalProps) {
  const [selectedTags, setSelectedTags] = useState<ReviewTag[]>([]);
  const [comment, setComment] = useState('');
  const showToast = useToastStore((state) => state.showToast);

  const { mutate, isPending } = useReviewMutations({
    onSuccess: () => {
      showToast({ variant: 'success', title: '팀원에게 리뷰를 전달했어요 !' });
      onClose();
    },
    onError: () => {
      showToast({ variant: 'error', title: '리뷰 작성에 실패했습니다.' });
    },
  });

  const handleTagToggle = (tag: ReviewTag) => {
    setSelectedTags((prev) => (prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]));
  };

  const isFormValid = selectedTags.length > 0;

  const handleSubmit = () => {
    if (!isFormValid) return;

    mutate({
      gatheringId,
      body: {
        reviews: [
          {
            targetUserId: member.userId,
            tags: selectedTags,
            comment: comment.trim() || undefined,
          },
        ],
      },
    });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} className='max-w-[688px]'>
      <div className='relative'>
        <button
          aria-label='닫기'
          className='absolute top-4 right-4 text-gray-500 hover:text-gray-700'
          onClick={onClose}
        >
          <CloseIcon className='h-7 w-7 md:h-12 md:w-12' />
        </button>
        <Modal.Header className='flex items-center gap-4 pt-8'>
          <Profile imageUrl={member.profileImage} className='h-12.25 w-12 rounded-xl md:h-19.5 md:w-19.5' />
          <div>
            <h2 className='text-body-02-b md:text-h5-b text-gray-900'>{member.nickname}</h2>
            <div className='text-body-02-r mt-1 flex items-center gap-2 text-gray-600'>
              <span className='text-small-02-m md:text-body-01-m'>
                전체 달성률{' '}
                <span className='text-small-02-sb md:text-body-01-sb text-blue-300'>
                  {member.overallAchievementRate}%
                </span>
              </span>
              <span className='h-3 w-px bg-gray-300'></span>
              <span className='text-small-02-m md:text-body-01-m'>
                달성 주차{' '}
                <span className='text-small-02-sb md:text-body-01-sb text-blue-300'>
                  {achievedWeeks}/{totalWeeks}
                </span>
              </span>
            </div>
          </div>
        </Modal.Header>

        <Modal.Body className='flex max-h-[60vh] flex-col gap-8 overflow-y-auto px-6 py-4'>
          {/* 태그 선택 */}
          <section>
            <h3 className='text-small-02-sb md:text-body-01-sb mb-4 text-gray-900'>
              {member.nickname}님은 어떤 팀원이었나요?
            </h3>
            <div className='flex flex-wrap gap-2'>
              {REVIEW_TAGS.map((tag) => {
                const isSelected = selectedTags.includes(tag);
                return (
                  <button
                    key={tag}
                    onClick={() => handleTagToggle(tag)}
                    className={cn(
                      'text-small-02-m md:text-small-01-m rounded-lg px-4 py-2 transition-colors duration-200',
                      isSelected ? 'bg-blue-100 text-blue-500' : 'bg-gray-100 text-gray-600 hover:bg-gray-200',
                    )}
                  >
                    {tag}
                  </button>
                );
              })}
            </div>
          </section>

          {/* 코멘트 작성 */}
          <section>
            <h3 className='text-small-02-sb md:text-body-01-sb mb-4 text-gray-900'>함께한 모임의 경험을 알려주세요!</h3>
            <div className='relative'>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value.slice(0, 200))}
                placeholder='(선택) 여기에 적어주세요.'
                className='text-small-02-r md:text-small-01-r h-28 w-full resize-none rounded-xl border border-gray-200 p-4 transition-shadow focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none'
              />
              <div className='text-small-02-r md:text-small-01-r absolute right-4 bottom-4 text-gray-400'>
                {comment.length}/200
              </div>
            </div>
          </section>
        </Modal.Body>

        <Modal.Footer>
          <Button
            className={cn(
              'text-h5-sb text-gray-0 h-13.5 w-full md:h-18.5',
              !isFormValid || isPending ? 'bg-gray-300' : 'bg-gradient-primary',
            )}
            disabled={!isFormValid || isPending}
            onClick={handleSubmit}
          >
            작성 완료
          </Button>
        </Modal.Footer>
      </div>
    </Modal>
  );
}
