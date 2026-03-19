import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Textarea } from '.';

const meta = {
  title: 'components/Textarea',
  component: Textarea,
  args: {
    placeholder: 'Textarea',
  },
  argTypes: {
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
    variant: {
      control: 'select',
      options: ['default'],
    },
    state: {
      control: 'select',
      options: ['default', 'error'],
    },
  },
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Textarea>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Goal: Story = {
  args: {
    placeholder: '이 모임에서 달성할 목표를 적어주세요.',
  },
};

export const ShortIntro: Story = {
  args: {
    placeholder: '모임장에게 한마디를 적어주세요.',
  },
};
