import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { EmptyState } from '.';

const meta = {
  title: 'components/EmptyState',
  component: EmptyState,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof EmptyState>;

export default meta;

type Story = StoryObj<typeof meta>;

const CTA = { label: '모임 만들기', href: '/gatherings/new' };

export const Popular: Story = {
  name: '인기 모임 빈 상태',
  args: {
    emoji: '🔥',
    title: '아직 모이고 있는 모임이 없어요',
    description: '혼자 마무리하기 어려운 일, 완성도와 끝까지 가봐요',
    action: CTA,
  },
};

export const Deadline: Story = {
  name: '마감 임박 모임 빈 상태',
  args: {
    emoji: '⏰',
    title: '마감 임박 모임이 없어요',
    description: '마감까지 같이 갈 동료, 직접 모아 보세요',
    action: CTA,
  },
};

export const Latest: Story = {
  name: '최신 모임 빈 상태',
  args: {
    emoji: '👀',
    title: '새로 올라온 모임이 없어요',
    description: '오늘 시작하는 모임이 다음 완성의 출발점이 됩니다',
    action: CTA,
  },
};

export const Search: Story = {
  name: '탐색 검색 결과 없음',
  args: {
    title: '조건에 맞는 모임이 없어요',
    description: '검색 조건을 바꾸거나, 직접 모임을 열어 동료를 모아 보세요',
    action: CTA,
  },
};

export const My: Story = {
  name: '내 모임 빈 상태',
  args: {
    emoji: '💡',
    title: '아직 참여 중인 모임이 없어요',
    description: '관심 있는 분야의 모임을 찾아, 동료와 함께 완성해 봐요',
    action: { label: '모임 탐색하기', href: '/gatherings' },
  },
};

export const TitleOnly: Story = {
  name: '제목만 (description/action 없음)',
  args: {
    title: '데이터가 없어요',
  },
};
