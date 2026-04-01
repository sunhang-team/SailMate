import { useState } from 'react';

import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { useOverlay } from '@/hooks/useOverlay';
import { OverlayProvider } from '@/providers/OverlayProvider';

import { BottomSheet } from '.';

const meta = {
  title: 'components/BottomSheet',
  component: BottomSheet,
  args: {
    isOpen: false,
    onClose: () => {},
    children: null,
  },
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta<typeof BottomSheet>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => {
    const [isOpen, setIsOpen] = useState(false);

    return (
      <div className='flex min-h-[60vh] items-center justify-center'>
        <button onClick={() => setIsOpen(true)} className='rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600'>
          바텀시트 열기
        </button>
        <BottomSheet isOpen={isOpen} onClose={() => setIsOpen(false)}>
          <BottomSheet.Header>
            <h2 className='text-lg font-bold'>필터 설정</h2>
          </BottomSheet.Header>
          <BottomSheet.Body>
            <p className='text-gray-700'>원하는 조건을 선택해 주세요.</p>
          </BottomSheet.Body>
          <BottomSheet.Footer>
            <button
              onClick={() => setIsOpen(false)}
              className='w-full rounded bg-gray-200 px-4 py-3 font-bold text-gray-800'
            >
              닫기
            </button>
          </BottomSheet.Footer>
        </BottomSheet>
      </div>
    );
  },
};

export const WithLongContent: Story = {
  render: () => {
    const [isOpen, setIsOpen] = useState(false);

    return (
      <div className='flex min-h-[60vh] items-center justify-center'>
        <button onClick={() => setIsOpen(true)} className='rounded bg-blue-500 px-4 py-2 text-white'>
          긴 콘텐츠 바텀시트
        </button>
        <BottomSheet isOpen={isOpen} onClose={() => setIsOpen(false)}>
          <BottomSheet.Header>
            <h2 className='text-lg font-bold'>항목 선택</h2>
          </BottomSheet.Header>
          <BottomSheet.Body>
            <div className='space-y-3 py-2'>
              {Array.from({ length: 20 }, (_, index) => (
                <div key={index} className='rounded border border-gray-200 p-3 text-sm text-gray-700'>
                  선택 항목 {index + 1}
                </div>
              ))}
            </div>
          </BottomSheet.Body>
          <BottomSheet.Footer>
            <button
              onClick={() => setIsOpen(false)}
              className='w-full rounded bg-gray-200 px-4 py-3 font-bold text-gray-800'
            >
              완료
            </button>
          </BottomSheet.Footer>
        </BottomSheet>
      </div>
    );
  },
};

export const OverlayConfirm: Story = {
  decorators: [
    (StoryComponent) => (
      <>
        <OverlayProvider />
        <StoryComponent />
      </>
    ),
  ],
  render: () => {
    const overlay = useOverlay();
    const [result, setResult] = useState<string | null>(null);

    const openConfirmSheet = async () => {
      const confirmed = await overlay.open<boolean>(({ isOpen, close }) => (
        <BottomSheet isOpen={isOpen} onClose={() => close(false)}>
          <BottomSheet.Header>
            <h2 className='text-lg font-bold'>삭제하시겠어요?</h2>
          </BottomSheet.Header>
          <BottomSheet.Body>
            <p className='text-sm text-gray-700'>삭제 후에는 되돌릴 수 없습니다.</p>
          </BottomSheet.Body>
          <BottomSheet.Footer className='flex gap-2'>
            <button onClick={() => close(false)} className='w-full rounded bg-gray-200 py-3 font-bold text-gray-800'>
              취소
            </button>
            <button
              onClick={() => close(true)}
              className='w-full rounded bg-red-500 py-3 font-bold text-white hover:bg-red-600'
            >
              삭제
            </button>
          </BottomSheet.Footer>
        </BottomSheet>
      ));

      setResult(confirmed ? '삭제됨' : '취소됨');
    };

    return (
      <div className='flex min-h-[60vh] flex-col items-center justify-center gap-3'>
        <button onClick={openConfirmSheet} className='rounded bg-red-500 px-4 py-2 text-white hover:bg-red-600'>
          확인 바텀시트 열기
        </button>
        {result && <p className='text-sm font-semibold text-gray-700'>{result}</p>}
      </div>
    );
  },
};
