import { useState } from 'react';

import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { useOverlay } from '@/hooks/useOverlay';
import { useFunnel } from '@/hooks/useFunnel';
import { OverlayProvider } from '@/providers/OverlayProvider';

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
        <button onClick={() => setIsOpen(true)} className='rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600'>
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
            <button
              onClick={() => setIsOpen(false)}
              className='w-full rounded bg-gray-200 px-4 py-3 font-bold text-gray-800 hover:bg-gray-300'
            >
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

export const OverlayAlert: Story = {
  decorators: [
    (Story) => (
      <>
        <OverlayProvider />
        <Story />
      </>
    ),
  ],
  render: () => {
    const overlay = useOverlay();
    const [result, setResult] = useState<string | null>(null);

    const handleOpen = async () => {
      const isConfirmed = await overlay.open<boolean>(({ isOpen, close }) => (
        <Modal isOpen={isOpen} onClose={() => close(false)}>
          <Modal.Header>
            <h2 className='text-lg font-bold'>정말 삭제하시겠습니까?</h2>
          </Modal.Header>
          <Modal.Body>
            <p className='text-gray-600'>이 작업은 되돌릴 수 없습니다.</p>
          </Modal.Body>
          <Modal.Footer className='flex gap-2'>
            <button
              onClick={() => close(false)}
              className='w-full rounded bg-gray-200 py-3 font-bold text-gray-800 hover:bg-gray-300'
            >
              취소
            </button>
            <button
              onClick={() => close(true)}
              className='w-full rounded bg-red-500 py-3 font-bold text-white hover:bg-red-600'
            >
              삭제
            </button>
          </Modal.Footer>
        </Modal>
      ));

      if (isConfirmed) {
        setResult('항목이 삭제되었습니다.');
      } else {
        setResult('삭제가 취소되었습니다.');
      }
    };

    return (
      <div className='flex flex-col items-center gap-4'>
        <button onClick={handleOpen} className='rounded bg-red-500 px-4 py-2 text-white hover:bg-red-600'>
          삭제 팝업 띄우기
        </button>
        {result && <p className='text-sm font-bold text-gray-700'>{result}</p>}
      </div>
    );
  },
};

type ApplicationStep = 'INFO' | 'FORM' | 'COMPLETE';

interface ApplicationModalProps {
  isOpen: boolean;
  onClose: (result: string) => void;
}

function ApplicationFunnelModal({ isOpen, onClose }: ApplicationModalProps) {
  const { Funnel, Step, setStep, currentStep } = useFunnel<ApplicationStep>('INFO');

  const handleClose = () => {
    if (currentStep === 'INFO') {
      onClose('신청 과정을 취소했습니다.');
    } else if (currentStep === 'FORM') {
      onClose('신청 폼 작성을 취소했습니다.');
    } else {
      onClose('스터디 신청이 최종 완료되었습니다.');
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose}>
      <Funnel>
        <Step name='INFO'>
          <Modal.Header>
            <div className='mb-2 inline-flex items-center gap-1 rounded border border-gray-200 bg-white px-2 py-1 text-xs text-gray-600'>
              <span className='font-bold text-gray-800'>스터디</span> &gt; 디자인
            </div>
            <h2 className='text-3xl font-bold text-gray-900'>피그마 기초 스터디</h2>
            <p className='mt-2 text-sm text-gray-500'>피그마를 통해 디자인 이론부터 실습까지 목표로</p>
          </Modal.Header>
          <Modal.Body>
            <div className='rounded-xl bg-gray-50 p-5'>
              <div className='mb-4 flex items-center justify-between'>
                <h3 className='font-bold text-gray-700'>모임 정보</h3>
                <span className='text-gray-400'>^</span>
              </div>
              <ul className='space-y-4 text-sm text-gray-600'>
                <li className='flex items-center gap-3'>
                  <span className='h-4 w-4 rounded-sm bg-gray-400' /> 디자인
                </li>
                <li className='flex items-center gap-3'>
                  <span className='h-4 w-4 rounded-sm bg-gray-400' /> 피그마로 웹 서비스 1개 완성하기
                </li>
                <li className='flex items-center gap-3'>
                  <span className='h-4 w-4 rounded-sm bg-gray-400' /> 2026.03.15 ~ 2026.04.05 · 4주
                </li>
                <li className='flex items-center gap-3'>
                  <span className='h-4 w-4 rounded-sm bg-gray-400' /> 마감까지 D-day
                </li>
                <li className='flex items-center gap-3'>
                  <span className='h-4 w-4 rounded-sm bg-gray-400' /> 6/20명
                </li>
              </ul>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <div className='mb-4 flex justify-end gap-2 text-sm text-gray-600'>+2 · 14자리 남음</div>
            <button
              onClick={() => setStep('FORM')}
              className='w-full rounded-lg bg-gray-200 py-4 font-bold text-gray-800 hover:bg-gray-300'
            >
              참여 신청하기
            </button>
          </Modal.Footer>
        </Step>

        <Step name='FORM'>
          <Modal.Header>
            <h2 className='text-3xl font-bold'>모임 신청</h2>
            <div className='mt-6 flex items-center gap-3 text-sm'>
              <span className='text-gray-500'>신청 모임</span>
              <span className='text-gray-300'>|</span>
              <span className='font-bold text-gray-800'>피그마 기초 스터디</span>
            </div>
          </Modal.Header>
          <Modal.Body className='space-y-8 py-4'>
            <div>
              <label className='mb-3 block font-bold text-gray-800'>나의 목표 *</label>
              <div className='relative'>
                <textarea
                  className='h-40 w-full resize-none rounded-xl border border-gray-200 bg-gray-100/50 p-4 text-sm outline-none focus:border-blue-500'
                  placeholder='이 모임에서 달성할 목표를 적어주세요. (최소 5자, 최대 200자)'
                />
                <div className='absolute right-4 bottom-4 text-xs text-gray-400'>0/200</div>
              </div>
            </div>
            <div>
              <label className='mb-3 block font-bold text-gray-800'>한 줄 소개</label>
              <div className='relative'>
                <input
                  type='text'
                  className='w-full rounded-xl border border-gray-200 bg-gray-100/50 p-4 text-sm outline-none focus:border-blue-500'
                  placeholder='(선택) 모임장에게 한마디를 적어주세요.'
                />
                <div className='absolute top-1/2 right-4 -translate-y-1/2 text-xs text-gray-400'>0/100</div>
              </div>
            </div>
          </Modal.Body>
          <Modal.Footer className='flex flex-col gap-6 pt-2'>
            <div>
              <p className='mb-4 text-sm text-gray-800'>팀 구성을 위해 닉네임과 평판 점수가 모임장에게 전달됩니다.</p>
              <label className='flex items-center gap-2 text-sm text-gray-500'>
                <span className='text-gray-400'>✓</span>
                내용을 확인했으며 제공에 동의합니다.
              </label>
            </div>
            <button
              onClick={() => setStep('COMPLETE')}
              className='w-full rounded-lg bg-gray-200 py-4 text-lg font-bold text-gray-800 hover:bg-gray-300'
            >
              작성 완료
            </button>
          </Modal.Footer>
        </Step>

        <Step name='COMPLETE'>
          <Modal.Header className='sr-only'>신청 완료</Modal.Header>
          <Modal.Body className='flex flex-col items-center py-20'>
            <div className='mb-10 h-64 w-64 rounded-full bg-gray-200' />
            <h2 className='text-2xl font-bold text-gray-900'>신청이 완료되었어요!</h2>
            <p className='mt-3 text-xl font-bold text-gray-900'>모임장의 승인을 기다려주세요.</p>
          </Modal.Body>
          <Modal.Footer>
            <button
              onClick={() => onClose('스터디 신청이 최종 완료되었습니다.')}
              className='w-full rounded-lg bg-gray-200 py-4 text-lg font-bold text-gray-800 hover:bg-gray-300'
            >
              확인
            </button>
          </Modal.Footer>
        </Step>
      </Funnel>
    </Modal>
  );
}

export const StudyApplicationFlow: Story = {
  decorators: [
    (Story) => (
      <>
        <OverlayProvider />
        <Story />
      </>
    ),
  ],
  render: () => {
    const overlay = useOverlay();
    const [result, setResult] = useState<string | null>(null);

    const startApplicationFlow = async () => {
      const finalResult = await overlay.open<string>(({ isOpen, close }) => (
        <ApplicationFunnelModal isOpen={isOpen} onClose={close} />
      ));

      if (finalResult) {
        setResult(finalResult);
      }
    };

    return (
      <div className='flex flex-col items-center gap-4 py-10'>
        <button onClick={startApplicationFlow} className='rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600'>
          스터디 신청 플로우 보기
        </button>
        {result && <p className='font-bold text-gray-700'>{result}</p>}
      </div>
    );
  },
};
