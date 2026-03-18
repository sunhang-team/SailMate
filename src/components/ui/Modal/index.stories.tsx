import { useState } from 'react';

import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { Modal } from '.';

const meta = {
  title: 'components/Modal',
  component: Modal,
  args: {
    isOpen: false,
    onClose: () => {},
    children: null,
  },
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof Modal>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => {
    const [isOpen, setIsOpen] = useState(false);

    return (
      <>
        <button onClick={() => setIsOpen(true)} className='rounded bg-blue-500 px-4 py-2 text-white'>
          모달 열기
        </button>
        <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
          <Modal.Header>
            <h2 className='text-lg font-bold'>모달 제목</h2>
          </Modal.Header>
          <Modal.Body>
            <p>모달 본문 내용입니다.</p>
          </Modal.Body>
          <Modal.Footer>
            <button onClick={() => setIsOpen(false)} className='rounded bg-gray-200 px-4 py-2'>
              닫기
            </button>
          </Modal.Footer>
        </Modal>
      </>
    );
  },
};

export const WithLongContent: Story = {
  render: () => {
    const [isOpen, setIsOpen] = useState(false);

    return (
      <>
        <button onClick={() => setIsOpen(true)} className='rounded bg-blue-500 px-4 py-2 text-white'>
          긴 콘텐츠 모달 열기
        </button>
        <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
          <Modal.Header>
            <h2 className='text-lg font-bold'>스크롤 테스트</h2>
          </Modal.Header>
          <Modal.Body>
            {Array.from({ length: 20 }, (_, i) => (
              <p key={i} className='mb-2'>
                긴 콘텐츠 {i + 1}번째 줄입니다.
              </p>
            ))}
          </Modal.Body>
          <Modal.Footer>
            <button onClick={() => setIsOpen(false)} className='rounded bg-gray-200 px-4 py-2'>
              닫기
            </button>
          </Modal.Footer>
        </Modal>
      </>
    );
  },
};

export const HeaderOnly: Story = {
  render: () => {
    const [isOpen, setIsOpen] = useState(false);

    return (
      <>
        <button onClick={() => setIsOpen(true)} className='rounded bg-blue-500 px-4 py-2 text-white'>
          헤더만 있는 모달
        </button>
        <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
          <Modal.Header>
            <h2 className='text-lg font-bold'>알림</h2>
            <p className='mt-1 text-sm text-gray-500'>간단한 알림 메시지입니다.</p>
          </Modal.Header>
        </Modal>
      </>
    );
  },
};
