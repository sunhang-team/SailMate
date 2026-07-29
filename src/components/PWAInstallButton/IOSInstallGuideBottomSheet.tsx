'use client';

import { BottomSheet } from '@/components/ui/BottomSheet';

const STEPS = [
  {
    step: 1,
    description: 'Safari 하단 툴바에서 공유 버튼(⬆)을 탭하세요.',
  },
  {
    step: 2,
    description: '스크롤을 내려 "홈 화면에 추가"를 선택하세요.',
  },
  {
    step: 3,
    description: '우측 상단 "추가"를 탭하면 설치 완료!',
  },
] as const;

interface IOSInstallGuideBottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
}

export function IOSInstallGuideBottomSheet({ isOpen, onClose }: IOSInstallGuideBottomSheetProps) {
  return (
    <BottomSheet isOpen={isOpen} onClose={onClose} ariaLabel='홈 화면에 추가 안내'>
      <BottomSheet.Header>
        <h2 className='text-h5-b text-gray-800'>홈 화면에 추가하기</h2>
      </BottomSheet.Header>
      <BottomSheet.Body>
        <p className='text-body-02-m text-gray-700'>Safari에서 아래 단계를 따라 앱을 홈 화면에 추가하세요.</p>
        <ol className='mt-6 flex flex-col gap-5'>
          {STEPS.map(({ step, description }) => (
            <li key={step} className='flex items-start gap-4'>
              <span className='text-small-01-sm text-gray-0 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-blue-300'>
                {step}
              </span>
              <p className='text-body-02-m text-gray-600'>{description}</p>
            </li>
          ))}
        </ol>
      </BottomSheet.Body>
    </BottomSheet>
  );
}
