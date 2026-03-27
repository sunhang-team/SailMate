import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Pagination } from '.';

const meta = {
  title: 'components/Pagination',
  component: Pagination,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
} satisfies Meta<typeof Pagination>;

export default meta;

type Story = StoryObj<typeof meta>;

// ─── Numbered ───────────────────────────────────────────────
export const NumberedFirst: Story = {
  name: '[Numbered] 첫 페이지',
  args: {
    variant: 'numbered',
    currentPage: 1,
    totalPages: 5,
    onPageChange: () => {},
  },
};

export const NumberedMiddle: Story = {
  name: '[Numbered] 중간 페이지',
  args: {
    variant: 'numbered',
    currentPage: 3,
    totalPages: 5,
    onPageChange: () => {},
  },
};

export const NumberedLast: Story = {
  name: '[Numbered] 마지막 페이지',
  args: {
    variant: 'numbered',
    currentPage: 5,
    totalPages: 5,
    onPageChange: () => {},
  },
};

// ─── Simple ─────────────────────────────────────────────────
export const SimpleDefault: Story = {
  name: '[Simple] 기본',
  args: {
    variant: 'simple',
    currentPage: 2,
    totalPages: 5,
    onPageChange: () => {},
  },
};

export const SimpleFirst: Story = {
  name: '[Simple] 첫 페이지',
  args: {
    variant: 'simple',
    currentPage: 1,
    totalPages: 5,
    onPageChange: () => {},
  },
};

export const SimpleLast: Story = {
  name: '[Simple] 마지막 페이지',
  args: {
    variant: 'simple',
    currentPage: 5,
    totalPages: 5,
    onPageChange: () => {},
  },
};
