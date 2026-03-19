import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { Button } from '../Button';

import { Toast } from './index';
import { ToastProvider } from './ToastProvider';
import { useToastStore } from './useToastStore';

const meta = {
  title: 'components/Toast',
  component: Toast,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <ToastProvider>
        <Story />
      </ToastProvider>
    ),
  ],
} satisfies Meta;

export default meta;

type Story = StoryObj<typeof meta>;

export const Interactive: Story = {
  render: () => {
    const showToast = useToastStore((state) => state.showToast);

    return (
      <div className='flex gap-[10px]'>
        <Button
          onClick={() =>
            showToast({
              variant: 'success',
              title: '성공!',
              description: '성공하였습니다.',
            })
          }
        >
          성공 토스트
        </Button>

        <Button
          onClick={() =>
            showToast({
              variant: 'error',
              title: '에러 발생',
              description: '에러가 발생하였습니다.',
            })
          }
        >
          에러 토스트
        </Button>
      </div>
    );
  },
};
