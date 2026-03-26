import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Tag } from '.';

const meta = {
  title: 'components/Tag',
  component: Tag,
  args: {
    children: 'Tag',
  },
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['category', 'status', 'tag'],
    },
  },
} satisfies Meta<typeof Tag>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Category: Story = {
  args: {
    variant: 'category',
    children: '카테고리',
  },
};

export const Status: Story = {
  args: {
    variant: 'status',
    children: '모집중',
  },
};

export const TagVariant: Story = {
  args: {
    variant: 'tag',
    children: '태그',
  },
};
