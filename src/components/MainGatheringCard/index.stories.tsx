import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { MainGatheringCard } from '.';

const meta = {
  title: 'components/MainGatheringCard',
  component: MainGatheringCard,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof MainGatheringCard>;

export default meta;

type Story = StoryObj<typeof meta>;

const baseArgs = {
  category: '프로젝트',
  subcategory: '개발',
  currentMembers: 3,
  maxMembers: 12,
  tags: ['디자인', '기획'],
  title: '피그마 기초 스터디',
  subtitle: '디자인 시스템을 함께 구축해요',
  totalWeeksLabel: '총 9주',
  deadlineLabel: '모집 마감 D-14',
  joinButtonLabel: '참여하기',
};

export const Default: Story = {
  name: '1. Default',
  args: baseArgs,
};

export const Favorite: Story = {
  name: '2. 찜',
  args: {
    ...baseArgs,
    initialFavorite: true,
  },
};

export const JoinDisabled: Story = {
  name: '3. 참여불가',
  args: {
    ...baseArgs,
    isJoinDisabled: true,
    joinButtonLabel: '참여하기',
  },
};
