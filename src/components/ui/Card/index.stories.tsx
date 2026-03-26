import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { Button } from '@/components/ui/Button';
import { HeartIcon, PeopleIcon, ProjectIcon, StudyIcon } from '@/components/ui/Icon';
import { Tag } from '@/components/ui/Tag';

import { Card } from '.';

const meta = {
  title: 'components/Card',
  component: Card,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Card>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  name: '내 모임 카드 (Card 컴포넌트 사용 예시)',
  args: {
    className: 'w-[300px]',
    children: (
      <div className='flex flex-col gap-3 p-5'>
        <div className='flex items-center justify-between'>
          <Tag
            variant='category'
            icon={<ProjectIcon size={14} className='text-blue-300' />}
            label='프로젝트'
            sublabel='개발'
          />
          <div className='flex -space-x-2'>
            <div className='border-gray-0 h-7 w-7 rounded-full border-2 bg-gray-300' />
            <div className='border-gray-0 h-7 w-7 rounded-full border-2 bg-gray-400' />
            <div className='border-gray-0 h-7 w-7 rounded-full border-2 bg-gray-500' />
          </div>
        </div>

        <div className='flex flex-col gap-1'>
          <div className='flex gap-1'>
            <span className='text-small-02-m text-gray-500'>#디자인</span>
            <span className='text-small-02-m text-gray-500'>#기획</span>
          </div>
          <p className='text-body-01-sb text-gray-900'>피그마 기초 스터디</p>
        </div>

        <div className='flex gap-2'>
          <Tag variant='duration'>총 9주</Tag>
          <Tag variant='deadline' state='goal'>
            목표 D-14
          </Tag>
        </div>

        <div className='flex flex-col gap-1'>
          <div className='text-small-02-m flex items-center justify-between'>
            <span className='text-gray-500'>달성률</span>
            <span className='text-blue-300'>80%</span>
          </div>
          <div className='bg-gray-150 h-1.5 w-full rounded-full'>
            <div className='bg-gradient-primary h-full w-4/5 rounded-full' />
          </div>
        </div>
      </div>
    ),
  },
};

export const GatheringCardExample: Story = {
  name: '모임 리스트 카드 (Card 컴포넌트 사용 예시)',
  args: {
    className: 'w-[300px]',
    children: (
      <div className='flex flex-col gap-3 p-5'>
        <div className='flex items-center justify-between'>
          <Tag
            variant='category'
            icon={<StudyIcon size={14} className='text-blue-300' />}
            label='스터디'
            sublabel='기타'
          />
          <div className='text-small-02-m flex items-center gap-1 text-gray-600'>
            <PeopleIcon size={16} />
            <span>3/12</span>
          </div>
        </div>

        <div className='flex flex-col gap-1'>
          <div className='flex gap-1'>
            <span className='text-small-02-m text-gray-500'>#디자인</span>
            <span className='text-small-02-m text-gray-500'>#기획</span>
          </div>
          <p className='text-body-01-sb text-gray-900'>커뮤니티 서비스 구축</p>
          <p className='text-small-01-r text-gray-500'>서비스 기획부터 개발까지</p>
        </div>

        <div className='flex gap-2'>
          <Tag variant='duration'>총 9주</Tag>
          <Tag variant='deadline' state='goal'>
            모집 마감 D-14
          </Tag>
        </div>

        <div className='flex items-center gap-2'>
          <Button variant='bookmark' size='bookmark-sm'>
            <HeartIcon size={20} />
          </Button>
          <Button variant='participation-outline-sm' size='participation-sm'>
            참여하기
          </Button>
        </div>
      </div>
    ),
  },
};
