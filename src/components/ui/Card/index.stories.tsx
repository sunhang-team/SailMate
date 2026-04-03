import { useState } from 'react';

import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { Button } from '@/components/ui/Button';
import { CheckIcon } from '@/components/ui/Icon/CheckIcon';
import { HeartIcon, PeopleIcon, ProjectIcon, StudyIcon } from '@/components/ui/Icon';
import { Tag } from '@/components/ui/Tag';
import { cn } from '@/lib/cn';

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

export const GatheringTypeSelect: Story = {
  name: '모임 유형 선택 카드',
  args: { children: null },
  render: () => {
    const [selected, setSelected] = useState<'study' | 'project' | null>(null);

    const toggle = (type: 'study' | 'project') => {
      setSelected((prev) => (prev === type ? null : type));
    };

    const isStudySelected = selected === 'study';
    const isProjectSelected = selected === 'project';

    return (
      <div className='flex flex-col gap-4'>
        <Card
          className={cn(
            'flex h-[160px] w-[828px] cursor-pointer items-center gap-6 rounded-lg px-8 shadow-none',
            isStudySelected ? 'border-focus-100 bg-blue-50' : 'border-gray-300 bg-gray-100',
          )}
          onClick={() => toggle('study')}
        >
          <CheckIcon size={56} className={isStudySelected ? 'text-blue-300' : 'text-gray-300'} />
          <div className='flex flex-1 flex-col gap-1'>
            <span className={cn('text-h4-b', isStudySelected ? 'text-blue-300' : 'text-gray-600')}>스터디</span>
            <span className={cn('text-body-01-r', isStudySelected ? 'text-blue-300' : 'text-gray-300')}>
              함께 학습하고 성장해요
            </span>
          </div>
          {isStudySelected && <StudyIcon size={56} className='text-blue-300' />}
        </Card>

        <Card
          className={cn(
            'flex h-[160px] w-[828px] cursor-pointer items-center gap-6 rounded-lg px-8 shadow-none',
            isProjectSelected ? 'border-focus-100 bg-blue-50' : 'border-gray-300 bg-gray-100',
          )}
          onClick={() => toggle('project')}
        >
          <CheckIcon size={56} className={isProjectSelected ? 'text-blue-300' : 'text-gray-300'} />
          <div className='flex flex-1 flex-col gap-1'>
            <span className={cn('text-h4-b', isProjectSelected ? 'text-blue-300' : 'text-gray-600')}>프로젝트</span>
            <span className={cn('text-body-01-r', isProjectSelected ? 'text-blue-300' : 'text-gray-300')}>
              함께 만들고 완성해요
            </span>
          </div>
          {isProjectSelected && <ProjectIcon size={56} className='text-blue-300' />}
        </Card>
      </div>
    );
  },
};
