import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { ActivityEnergySection } from '.';

const meta = {
  title: 'my/ProfileSidebar/ActivityEnergySection',
  component: ActivityEnergySection,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div style={{ width: 320 }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof ActivityEnergySection>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Wide: Story = {
  args: {
    variant: 'wide',
    reputationScore: 42,
    reputationLabel: '불꽃 메이트',
  },
};

export const Smoke: Story = {
  name: '연기 메이트 (36.5점)',
  args: {
    variant: 'wide',
    reputationScore: 36.5,
    reputationLabel: '연기 메이트',
  },
};

export const Firestart: Story = {
  name: '불씨 메이트 (38.2점)',
  args: {
    variant: 'wide',
    reputationScore: 38.2,
    reputationLabel: '불씨 메이트',
  },
};

export const Sun: Story = {
  name: '태양 메이트 (47점)',
  args: {
    variant: 'wide',
    reputationScore: 47,
    reputationLabel: '태양 메이트',
  },
};

export const Tablet: Story = {
  name: '태블릿 레이아웃 (38.2점)',
  args: {
    variant: 'tablet',
    reputationScore: 38.2,
    reputationLabel: '불씨 메이트',
  },
  decorators: [
    (Story) => (
      <div style={{ width: 400 }}>
        <Story />
      </div>
    ),
  ],
};
