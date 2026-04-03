import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { AvatarGroup } from '.';

const meta = {
  title: 'components/AvatarGroup',
  component: AvatarGroup,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof AvatarGroup>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  name: '기본 아바타 그룹',
  args: {
    avatars: [
      { imageUrl: 'https://i.pravatar.cc/300?img=1' },
      { imageUrl: 'https://i.pravatar.cc/300?img=2' },
      { imageUrl: 'https://i.pravatar.cc/300?img=3' },
      { imageUrl: 'https://i.pravatar.cc/300?img=4' },
    ],
    size: 'sm',
  },
};

export const MediumSize: Story = {
  name: '중간 크기 아바타 그룹',
  args: {
    avatars: [
      { imageUrl: 'https://i.pravatar.cc/300?img=1' },
      { imageUrl: 'https://i.pravatar.cc/300?img=2' },
      { imageUrl: 'https://i.pravatar.cc/300?img=3' },
      { imageUrl: 'https://i.pravatar.cc/300?img=4' },
    ],
    size: 'md',
  },
};

export const WithMax: Story = {
  name: '기본 아바타 그룹 최대 표시 개수 초과',
  args: {
    avatars: [
      { imageUrl: 'https://i.pravatar.cc/300?img=1' },
      { imageUrl: 'https://i.pravatar.cc/300?img=2' },
      { imageUrl: 'https://i.pravatar.cc/300?img=3' },
      { imageUrl: 'https://i.pravatar.cc/300?img=4' },
      { imageUrl: 'https://i.pravatar.cc/300?img=5' },
      { imageUrl: 'https://i.pravatar.cc/300?img=6' },
      { imageUrl: 'https://i.pravatar.cc/300?img=7' },
    ],
    max: 4,
    size: 'sm',
  },
};

export const WithMaxMedium: Story = {
  name: '중간 크기 아바타 그룹 최대 표시 개수 초과',
  args: {
    avatars: [
      { imageUrl: 'https://i.pravatar.cc/300?img=1' },
      { imageUrl: 'https://i.pravatar.cc/300?img=2' },
      { imageUrl: 'https://i.pravatar.cc/300?img=3' },
      { imageUrl: 'https://i.pravatar.cc/300?img=4' },
      { imageUrl: 'https://i.pravatar.cc/300?img=5' },
      { imageUrl: 'https://i.pravatar.cc/300?img=6' },
      { imageUrl: 'https://i.pravatar.cc/300?img=7' },
    ],
    max: 4,
    size: 'md',
  },
};
