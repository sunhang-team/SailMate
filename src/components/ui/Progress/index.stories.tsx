import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { Tag } from '../Tag';

import { ProgressBar } from '.';
import { IllustrationIcon, StateIcon } from '../Icon';

const meta = {
  title: 'components/ProgressBar',
  component: ProgressBar,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div style={{ width: 360 }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof ProgressBar>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  name: '기본 (80%)',
  args: {
    value: 80,
    label: '달성률',
  },
};

export const Empty: Story = {
  name: '0%',
  args: {
    value: 0,
    label: '달성률',
  },
};

export const Full: Story = {
  name: '100% 완료',
  args: {
    value: 100,
    label: '달성률',
  },
};

export const WithoutLabel: Story = {
  name: '라벨 없이 바만',
  args: {
    value: 65,
  },
};

export const MemberCount: Story = {
  name: '인원 (6/20명)',
  args: {
    value: (6 / 20) * 100,
    barClassName: 'h-4',
    children: (
      <div className='text-body-01-m flex items-center justify-between'>
        <span className='text-gray-800'>인원</span>
        <span>
          <span className='font-semibold text-blue-500'>6</span>
          <span className='text-gray-600'>/20 명</span>
        </span>
      </div>
    ),
  },
};

export const PersonalAchievement: Story = {
  name: '개인 달성률 (김민수 95%)',
  args: {
    value: 95,
    children: (
      <div className='text-small-02-m flex items-center justify-between'>
        <div className='flex items-center gap-2'>
          <span className='text-body-01-m text-gray-900'>김민수</span>
          <Tag variant='deadline' state='goal' className='flex gap-1'>
            <StateIcon variant='active' size={16} />
            14일
          </Tag>
        </div>
        <div className='flex items-center gap-1'>
          <span className='text-body-01-r text-gray-900'>달성률</span>
          <span className='text-body-01-sb text-blue-300'>95%</span>
        </div>
      </div>
    ),
  },
};

export const ScoreWithBadge: Story = {
  name: '점수 + 뱃지 (70점)',
  args: {
    value: 70,
    barClassName: 'h-4',
    children: (
      <div className='text-small-02-m flex items-center justify-between'>
        <div className='flex items-center gap-2'>
          <span className='text-body-01-b text-blue-300'>70점</span>
          <IllustrationIcon variant='fire' size={32} />
        </div>
        <Tag variant='mate'>불꽃 메이트</Tag>
      </div>
    ),
  },
};
