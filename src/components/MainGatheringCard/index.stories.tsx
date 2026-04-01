import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { MainGatheringCard } from '.';

import type { GatheringListItem } from '@/api/gatherings/types';

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

const gathering: GatheringListItem = {
  id: 1,
  type: '프로젝트',
  category: '개발',
  title: '피그마 기초 스터디',
  shortDescription: '디자인 시스템을 함께 구축해요',
  tags: ['디자인', '기획'],
  maxMembers: 12,
  currentMembers: 3,
  recruitDeadline: '2026-03-27',
  startDate: '2026-04-01',
  endDate: '2026-06-01',
  status: 'RECRUITING',
  isLiked: false,
  leader: {
    id: 1,
    nickname: '테스터',
    profileImage: null,
  },
};

const baseArgs = {
  gathering,
  joinButtonLabel: '참여하기',
} satisfies Parameters<typeof MainGatheringCard>[0];

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
