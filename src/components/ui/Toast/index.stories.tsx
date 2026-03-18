import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { ToastProvider, useToast } from './ToastProvider';
import { Button } from '../Button';

const meta = {
  title: 'components/Toast',
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
    const { showToast } = useToast();

    return (
      <div style={{ display: 'flex', gap: '10px' }}>
        <Button
          onClick={() =>
            showToast({
              variant: 'success',
              title: '성공!',
              description: '데이터가 저장되었습니다.',
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
              description: '다시 시도해 주세요.',
            })
          }
        >
          에러 토스트
        </Button>
      </div>
    );
  },
};
