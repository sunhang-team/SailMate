import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { AchievementGauge } from '.';

const meta = {
  title: 'app/Dashboard/AchievementGauge',
  component: AchievementGauge,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  args: {
    arcColor: '#1e58f8',
  },
} satisfies Meta<typeof AchievementGauge>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Zero: Story = {
  name: '0% (0자리)',
  args: {
    label: '내 달성률',
    rate: 0,
  },
};

export const SingleDigit: Story = {
  name: '5% (한 자리)',
  args: {
    label: '내 달성률',
    rate: 5,
  },
};

export const DoubleDigit: Story = {
  name: '75% (두 자리)',
  args: {
    label: '내 달성률',
    rate: 75,
  },
};

export const Hundred: Story = {
  name: '100% (세 자리)',
  args: {
    label: '내 달성률',
    rate: 100,
  },
};
