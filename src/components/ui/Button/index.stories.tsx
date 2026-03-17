import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Button } from '.';

const meta = {
  title: 'components/Button',
  component: Button,
  args: {
    children: 'Button',
  },
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Button>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Disabled: Story = {
  args: {
    disabled: true,
  },
};
