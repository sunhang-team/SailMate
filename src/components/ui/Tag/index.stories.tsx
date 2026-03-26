import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { PersonIcon, StateIcon, StudyIcon } from '@/components/ui/Icon';

import { Tag } from '.';

const meta = {
  title: 'components/Tag',
  component: Tag,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Tag>;

export default meta;

type Story = StoryObj<typeof Tag>;

export const Category: Story = {
  name: '[카테고리] category',
  render: () => (
    <div className='flex flex-col gap-2'>
      <Tag
        variant='category'
        icon={<PersonIcon size={14} className='text-blue-300' />}
        label='프로젝트'
        sublabel='개발'
      />
      <Tag
        variant='category'
        icon={<PersonIcon size={14} className='text-blue-300' />}
        label='프로젝트'
        sublabel='디자인'
      />
      <Tag
        variant='category'
        icon={<PersonIcon size={14} className='text-blue-300' />}
        label='프로젝트'
        sublabel='기획'
      />
      <Tag
        variant='category'
        icon={<PersonIcon size={14} className='text-blue-300' />}
        label='프로젝트'
        sublabel='기타'
      />
      <Tag variant='category' icon={<StudyIcon size={14} className='text-blue-300' />} label='스터디' sublabel='개발' />
      <Tag variant='category' icon={<StudyIcon size={14} className='text-blue-300' />} label='스터디' sublabel='이학' />
      <Tag variant='category' icon={<StudyIcon size={14} className='text-blue-300' />} label='스터디' sublabel='독서' />
    </div>
  ),
};

export const Deadline: Story = {
  name: '[마감] deadline',
  render: () => (
    <div className='flex flex-col gap-2'>
      <Tag variant='deadline' state='goal'>
        목표 D-14
      </Tag>
      <Tag variant='deadline' state='goal'>
        모집 마감 D-14
      </Tag>
      <Tag variant='deadline' state='warning'>
        모집 마감 D-day
      </Tag>
    </div>
  ),
};

export const Day: Story = {
  name: '[D-day] day',
  render: () => (
    <div className='flex flex-col gap-2 rounded-lg bg-gray-200 p-4'>
      <Tag variant='day' state='short'>
        D-day
      </Tag>
      <Tag variant='day' state='relax'>
        D-14
      </Tag>
    </div>
  ),
};

export const Info: Story = {
  name: '[정보] info',
  render: () => (
    <div className='flex gap-2'>
      <Tag variant='info' state='good'>
        <StateIcon variant='warning' size={14} />
        14일
      </Tag>
      <Tag variant='info' state='bad'>
        <StateIcon variant='active' size={14} />
        주의
      </Tag>
    </div>
  ),
};

export const Duration: Story = {
  name: '[기간] duration',
  render: () => <Tag variant='duration'>총 9주</Tag>,
};

export const Hashtag: Story = {
  name: '[해시태그] hashtag',
  render: () => (
    <Tag variant='hashtag' onRemove={() => {}}>
      #디자인
    </Tag>
  ),
};

export const Good: Story = {
  name: '[긍정 리뷰] good',
  render: () => (
    <div className='flex flex-wrap gap-2'>
      <Tag variant='good' count={4}>
        약속을 잘 지켜요
      </Tag>
      <Tag variant='good' count={6}>
        적극적이에요
      </Tag>
      <Tag variant='good' count={3}>
        책임감 있게 해내요
      </Tag>
      <Tag variant='good' count={3}>
        팀 분위기를 밝게 만들어요
      </Tag>
      <Tag variant='good' count={1}>
        할 일을 미루지 않아요
      </Tag>
      <Tag variant='good' count={2}>
        소통이 활발해요
      </Tag>
    </div>
  ),
};

export const Bad: Story = {
  name: '[부정 리뷰] bad',
  render: () => (
    <div className='flex flex-wrap gap-2'>
      <Tag variant='bad' count={1}>
        약속을 잘 지키지 않아요
      </Tag>
      <Tag variant='bad' count={1}>
        소통이 어려워요
      </Tag>
      <Tag variant='bad' count={1}>
        할 일을 미뤄요
      </Tag>
      <Tag variant='bad' count={2}>
        소극적이에요
      </Tag>
      <Tag variant='bad' count={1}>
        목표 달성에 소홀해요
      </Tag>
      <Tag variant='bad' count={1}>
        참여도가 아쉬워요
      </Tag>
    </div>
  ),
};

export const Mate: Story = {
  name: '[메이트] mate',
  render: () => (
    <div className='flex flex-col gap-2'>
      <Tag variant='mate'>연기 메이트</Tag>
      <Tag variant='mate'>불씨 메이트</Tag>
      <Tag variant='mate'>불꽃 메이트</Tag>
      <Tag variant='mate'>태양 메이트</Tag>
    </div>
  ),
};

export const Email: Story = {
  name: '[이메일] email',
  render: () => <Tag variant='email'>example@email.com</Tag>,
};

export const Status: Story = {
  name: '[상태] status',
  render: () => (
    <div className='flex flex-col gap-2'>
      <Tag variant='status' state='progressing'>
        진행중
      </Tag>
      <Tag variant='status' state='completed'>
        진행 완료
      </Tag>
      <Tag variant='status' state='recruiting'>
        모집중
      </Tag>
    </div>
  ),
};
