import type { Meta } from '@storybook/nextjs-vite';

import { AvatarGroup } from '../AvatarGroup';
import { Button } from '../Button';
import { GatheringCard } from '.';
import { CalendarIcon, HeartIcon, ProjectIcon, ReviewIcon } from '../Icon';
import { ProgressBar } from '../Progress';
import { Tag } from '../Tag';

const meta = {
  title: 'components/GatheringCard',
  component: GatheringCard,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof GatheringCard>;

export default meta;

export const Default = {
  name: '모임 카드',
  args: {
    className: 'w-[402px]',
    children: (
      <>
        <GatheringCard.Header>
          <Tag
            variant='category'
            icon={<ProjectIcon size={14} className='text-blue-300' />}
            label='프로젝트'
            sublabel='개발'
          />
          <div className='flex items-center gap-1'>
            <ProjectIcon size={16} className='text-blue-400' />
            <div>
              <span className='text-small-01-r text-blue-400'>3</span>
              <span className='text-small-01-r text-gray-600'>/12</span>
            </div>
          </div>
        </GatheringCard.Header>
        <GatheringCard.Body>
          <div className='flex flex-col gap-0.5'>
            <div>
              <div className='flex gap-1'>
                <div className='text-small-01-r text-gray-500'>#개발</div>
                <div className='text-small-01-r text-gray-500'>#디자인</div>
              </div>
              <div className='text-body-01-b text-gray-900'>커뮤니티 서비스 구축</div>
              <div className='text-small-01-r text-gray-800'>서비스 기획부터 개발까지</div>
            </div>
          </div>
          <div className='mb-1.5 flex gap-1'>
            <Tag variant='duration'>총 9주</Tag>
            <Tag variant='deadline' state='goal'>
              모집마감 D-14
            </Tag>
          </div>
          <div className='border-gray-150 mb-4.5 border'></div>
        </GatheringCard.Body>
        <GatheringCard.Footer className='flex gap-2'>
          <Button variant='bookmark' size='bookmark-sm'>
            <HeartIcon size={24} variant='outline' />
          </Button>
          <Button variant='participation-outline-sm' size='participation-sm'>
            참여하기
          </Button>
        </GatheringCard.Footer>
      </>
    ),
  },
};

export const MyGathering = {
  name: '내 모임 카드',
  args: {
    className: 'w-[402px]',
    children: (
      <>
        <GatheringCard.Header>
          <Tag
            variant='category'
            icon={<ProjectIcon size={14} className='text-blue-300' />}
            label='프로젝트'
            sublabel='개발'
          />
          <AvatarGroup
            max={4}
            avatars={[
              { imageUrl: 'https://i.pravatar.cc/300?img=1' },
              { imageUrl: 'https://i.pravatar.cc/300?img=2' },
              { imageUrl: 'https://i.pravatar.cc/300?img=3' },
              { imageUrl: 'https://i.pravatar.cc/300?img=4' },
              { imageUrl: 'https://i.pravatar.cc/300?img=5' },
              { imageUrl: 'https://i.pravatar.cc/300?img=6' },
            ]}
            size='sm'
          />
        </GatheringCard.Header>
        <GatheringCard.Body>
          <div className='flex flex-col gap-0.5'>
            <div>
              <div className='text-small-01-r text-gray-500'>#디자인</div>
              <div className='text-body-01-b text-gray-900'>피그마 기초 스터디</div>
            </div>
          </div>
          <div className='mb-1.5 flex gap-1'>
            <Tag variant='duration'>총 9주</Tag>
            <Tag variant='deadline' state='goal'>
              목표 D-14
            </Tag>
          </div>
          <div className='border-gray-150 mb-4.5 border'></div>
        </GatheringCard.Body>
        <GatheringCard.Footer className='flex-col gap-1'>
          <ProgressBar value={80} label='달성률' />
        </GatheringCard.Footer>
      </>
    ),
  },
};

export const MyGatheringProgressing = {
  name: '진행중 모임 카드',
  args: {
    className: 'w-[583px]',
    children: (
      <>
        <GatheringCard.Header>
          <div className='flex gap-1'>
            <Tag
              variant='category'
              icon={<ProjectIcon size={14} className='text-blue-300' />}
              label='프로젝트'
              sublabel='개발'
            />
            <Tag variant='status' state='progressing'>
              진행중
            </Tag>
          </div>
        </GatheringCard.Header>
        <GatheringCard.Body>
          <div className='flex flex-col gap-0.5'>
            <div>
              <div className='flex gap-1'>
                <div className='text-small-01-r text-gray-500'>#디자인</div>
                <div className='text-small-01-r text-gray-500'>#기획</div>
              </div>
              <div className='text-body-01-b text-gray-900'>피그마 기초 스터디</div>
              <div className='flex items-center gap-3'>
                <div className='mt-2 flex items-center gap-2'>
                  <CalendarIcon size={16} className='text-gray-600' />
                  <div className='flex items-center gap-1'>
                    <div className='text-small-01-r text-gray-600'>2026.03.15 ~ 2026.04.05</div>
                    <div className='text-small-01-r text-gray-600'>・</div>
                    <div className='text-small-01-r text-gray-600'>4주</div>
                  </div>
                  <div className='text-small-01-r text-gray-400'>|</div>
                  <ProjectIcon size={16} className='text-gray-600' />
                  <div className='flex items-center'>
                    <span className='text-small-01-r text-gray-600'>12</span>
                    <span className='text-small-01-r text-gray-400'>/12</span>
                  </div>
                </div>
              </div>
              <ProgressBar label='달성률' layout='horizontal' value={80} className='mb-4' />
            </div>
          </div>
        </GatheringCard.Body>
        <GatheringCard.Footer>
          <div className='border-gray-150 flex h-[72px] w-full items-center rounded-[8px] border bg-gray-100'>
            <div className='flex flex-1 items-center justify-center gap-1.5'>
              <span className='text-body-01-m text-gray-600'>총</span>
              <span className='text-body-01-sb text-blue-300'>9주</span>
            </div>
            <div className='bg-gray-150 h-6 w-px'></div>
            <div className='flex flex-1 items-center justify-center gap-1.5'>
              <span className='text-body-01-sb text-blue-300'>3주차</span>
              <span className='text-body-01-m text-gray-600'>진행중</span>
            </div>
          </div>
        </GatheringCard.Footer>
      </>
    ),
  },
};

export const MyGatheringCompletedNoReview = {
  name: '완료 모임 카드(리뷰x)',
  args: {
    className: 'w-[583px]',
    children: (
      <>
        <GatheringCard.Header>
          <div className='flex gap-1'>
            <Tag
              variant='category'
              icon={<ProjectIcon size={14} className='text-blue-300' />}
              label='프로젝트'
              sublabel='개발'
            />
            <Tag variant='status' state='completed'>
              진행완료
            </Tag>
          </div>
        </GatheringCard.Header>
        <GatheringCard.Body>
          <div className='flex flex-col gap-0.5'>
            <div>
              <div className='flex gap-1'>
                <div className='text-small-01-r text-gray-500'>#디자인</div>
                <div className='text-small-01-r text-gray-500'>#기획</div>
              </div>
              <div className='text-body-01-b text-gray-900'>피그마 기초 스터디</div>
              <div className='flex items-center gap-3'>
                <div className='mt-2 flex items-center gap-2'>
                  <CalendarIcon size={16} className='text-gray-600' />
                  <div className='flex items-center gap-1'>
                    <div className='text-small-01-r text-gray-600'>2026.03.15 ~ 2026.04.05</div>
                    <div className='text-small-01-r text-gray-600'>・</div>
                    <div className='text-small-01-r text-gray-600'>4주</div>
                  </div>
                  <div className='text-small-01-r text-gray-400'>|</div>
                  <ProjectIcon size={16} className='text-gray-600' />
                  <div className='flex items-center'>
                    <span className='text-small-01-r text-gray-600'>12</span>
                    <span className='text-small-01-r text-gray-400'>/12</span>
                  </div>
                </div>
              </div>
              <ProgressBar label='달성률' layout='horizontal' value={80} className='mb-4' />
            </div>
          </div>
        </GatheringCard.Body>
        <GatheringCard.Footer>
          <div className='flex h-[72px] w-full items-center justify-center rounded-[8px] bg-blue-50'>
            <div className='flex items-center gap-2'>
              <ReviewIcon size={24} className='text-blue-300' />
              <div className='text-body-01-sb text-blue-300'>리뷰 쓰기</div>
            </div>
          </div>
        </GatheringCard.Footer>
      </>
    ),
  },
};

export const MyGatheringCompletedWithReview = {
  name: '완료 모임 카드(리뷰o)',
  args: {
    className: 'w-[583px]',
    children: (
      <>
        <GatheringCard.Header>
          <div className='flex gap-1'>
            <Tag
              variant='category'
              icon={<ProjectIcon size={14} className='text-blue-300' />}
              label='프로젝트'
              sublabel='개발'
            />
            <Tag variant='status' state='completed'>
              진행완료
            </Tag>
          </div>
        </GatheringCard.Header>
        <GatheringCard.Body>
          <div className='flex flex-col gap-0.5'>
            <div>
              <div className='flex gap-1'>
                <div className='text-small-01-r text-gray-500'>#디자인</div>
                <div className='text-small-01-r text-gray-500'>#기획</div>
              </div>
              <div className='text-body-01-b text-gray-900'>피그마 기초 스터디</div>
              <div className='flex items-center gap-3'>
                <div className='mt-2 flex items-center gap-2'>
                  <CalendarIcon size={16} className='text-gray-600' />
                  <div className='flex items-center gap-1'>
                    <div className='text-small-01-r text-gray-600'>2026.03.15 ~ 2026.04.05</div>
                    <div className='text-small-01-r text-gray-600'>・</div>
                    <div className='text-small-01-r text-gray-600'>4주</div>
                  </div>
                  <div className='text-small-01-r text-gray-400'>|</div>
                  <ProjectIcon size={16} className='text-gray-600' />
                  <div className='flex items-center'>
                    <span className='text-small-01-r text-gray-600'>12</span>
                    <span className='text-small-01-r text-gray-400'>/12</span>
                  </div>
                </div>
              </div>
              <ProgressBar label='달성률' layout='horizontal' value={80} className='mb-4' />
            </div>
          </div>
        </GatheringCard.Body>
        <GatheringCard.Footer>
          <div className='flex h-[72px] w-full items-center justify-center rounded-[8px] bg-blue-50'>
            <div className='flex items-center gap-2'>
              <div className='text-body-01-sb text-gray-600'>리뷰 작성완료</div>
            </div>
          </div>
        </GatheringCard.Footer>
      </>
    ),
  },
};

export const CreatedGathering = {
  name: '만든 모임 카드',
  args: {
    className: 'w-[583px]',
    children: (
      <>
        <GatheringCard.Header>
          <div className='flex gap-1'>
            <Tag
              variant='category'
              icon={<ProjectIcon size={14} className='text-blue-300' />}
              label='프로젝트'
              sublabel='개발'
            />
            <Tag variant='status' state='recruiting'>
              모집중
            </Tag>
          </div>
        </GatheringCard.Header>
        <GatheringCard.Body>
          <div className='flex flex-col gap-0.5'>
            <div>
              <div className='flex gap-1'>
                <div className='text-small-01-r text-gray-500'>#디자인</div>
                <div className='text-small-01-r text-gray-500'>#기획</div>
              </div>
              <div className='text-body-01-b text-gray-900'>피그마 기초 스터디</div>
              <div className='flex items-center gap-3'>
                <div className='mt-2 flex items-center gap-2'>
                  <CalendarIcon size={16} className='text-gray-600' />
                  <div className='flex items-center gap-1'>
                    <div className='text-small-01-r text-gray-600'>2026.03.15 ~ 2026.04.05</div>
                    <div className='text-small-01-r text-gray-600'>・</div>
                    <div className='text-small-01-r text-gray-600'>4주</div>
                  </div>
                  <div className='text-small-01-r text-gray-400'>|</div>
                  <ProjectIcon size={16} className='text-gray-600' />
                  <div className='flex items-center'>
                    <span className='text-small-01-r text-gray-600'>12</span>
                    <span className='text-small-01-r text-gray-400'>/12</span>
                  </div>
                </div>
              </div>
              <ProgressBar label='달성률' layout='horizontal' value={80} className='mb-4' />
            </div>
          </div>
        </GatheringCard.Body>
        <GatheringCard.Footer>
          <div className='border-gray-150 flex h-[64px] w-full items-center rounded-[8px] border bg-gray-100'>
            <div className='flex flex-1 items-center justify-center gap-1.5'>
              <span className='text-body-01-m text-gray-600'>모집 인원</span>
              <span className='text-body-01-sb text-blue-300'>4</span>
              <span className='text-body-01-sb text-gray-600'>/20</span>
            </div>
            <div className='bg-gray-150 h-6 w-px'></div>
            <div className='flex flex-1 items-center justify-center gap-1.5'>
              <span className='text-body-01-m text-gray-600'>신청대기</span>
              <span className='text-body-01-sb text-blue-300'>2</span>
            </div>
          </div>
        </GatheringCard.Footer>
      </>
    ),
  },
};

export const WaitingGathering = {
  name: '대기중인 모임 카드',
  args: {
    className: 'w-[583px]',
    children: (
      <>
        <GatheringCard.Header>
          <Tag
            variant='category'
            icon={<ProjectIcon size={14} className='text-blue-300' />}
            label='프로젝트'
            sublabel='개발'
          />
        </GatheringCard.Header>
        <GatheringCard.Body>
          <div className='flex flex-col gap-0.5'>
            <div>
              <div className='flex gap-1'>
                <div className='text-small-01-r text-gray-500'>#디자인</div>
                <div className='text-small-01-r text-gray-500'>#기획</div>
              </div>
              <div className='text-body-01-b text-gray-900'>피그마 기초 스터디</div>
              <div className='flex items-center gap-3'>
                <div className='mt-2 mb-4 flex items-center gap-2'>
                  <CalendarIcon size={16} className='text-gray-600' />
                  <div className='flex items-center gap-1'>
                    <div className='text-small-01-r text-gray-600'>2026.03.15 ~ 2026.04.05</div>
                    <div className='text-small-01-r text-gray-600'>・</div>
                    <div className='text-small-01-r text-gray-600'>4주</div>
                  </div>
                  <div className='text-small-01-r text-gray-400'>|</div>
                  <ProjectIcon size={16} className='text-gray-600' />
                  <div className='flex items-center'>
                    <span className='text-small-01-r text-gray-600'>12</span>
                    <span className='text-small-01-r text-gray-400'>/12</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </GatheringCard.Body>
        <GatheringCard.Footer>
          <Button variant='cancel' size='cancel'>
            참여 취소하기
          </Button>
        </GatheringCard.Footer>
      </>
    ),
  },
};

export const LikedGathering = {
  name: '찜한 모임 카드',
  args: {
    className: 'w-[583px]',
    children: (
      <>
        <GatheringCard.Header>
          <div className='flex gap-1'>
            <Tag
              variant='category'
              icon={<ProjectIcon size={14} className='text-blue-300' />}
              label='프로젝트'
              sublabel='기타'
            />
            <Tag variant='status' state='recruiting' className='bg-blue-200'>
              모집중
            </Tag>
          </div>
          <div className='flex items-center gap-1'>
            <ProjectIcon size={16} className='text-blue-400' />
            <div>
              <span className='text-small-01-r text-blue-400'>3</span>
              <span className='text-small-01-r text-gray-600'>/12</span>
            </div>
          </div>
        </GatheringCard.Header>
        <GatheringCard.Body>
          <div className='flex flex-col gap-0.5'>
            <div>
              <div className='flex gap-1'>
                <div className='text-small-01-r text-gray-500'>#개발</div>
                <div className='text-small-01-r text-gray-500'>#디자인</div>
              </div>
              <div className='text-body-01-b text-gray-900'>커뮤니티 서비스 구축</div>
              <div className='text-small-01-r text-gray-800'>서비스 기획부터 개발까지</div>
            </div>
          </div>
          <div className='mb-1.5 flex gap-1'>
            <Tag variant='duration'>총 9주</Tag>
            <Tag variant='deadline' state='goal'>
              모집마감 D-14
            </Tag>
          </div>
          <div className='border-gray-150 mb-4.5 border'></div>
        </GatheringCard.Body>
        <GatheringCard.Footer className='flex gap-2'>
          <Button variant='bookmark' size='bookmark-lg'>
            <HeartIcon size={36} variant='filled' className='text-red-200' />
          </Button>
          <Button variant='participation-outline' size='participation'>
            참여하기
          </Button>
        </GatheringCard.Footer>
      </>
    ),
  },
};
