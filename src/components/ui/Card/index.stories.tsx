import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Card } from '.';

const meta = {
  title: 'components/Card',
  component: Card,
  args: {
    children: 'Card',
  },
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Card>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
