import { clsx, type ClassValue } from 'clsx';
import { extendTailwindMerge } from 'tailwind-merge';

// tailwind-merge는 커스텀 텍스트 유틸리티(text-h5-b 등)를 텍스트 색상 클래스(text-blue-400 등)와
// 동일 그룹으로 잘못 인식해 충돌 시 제거한다. font-size 그룹으로 명시 등록해 이를 방지한다.
const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      'font-size': [
        'text-h1-b',
        'text-h2-b',
        'text-h3-b',
        'text-h4-b',
        'text-h5-b',
        'text-body-01-r',
        'text-body-01-m',
        'text-body-01-sb',
        'text-body-01-b',
        'text-body-02-r',
        'text-body-02-m',
        'text-body-02-sb',
        'text-small-01-r',
        'text-small-01-sb',
        'text-small-02-r',
        'text-small-02-m',
      ],
    },
  },
});

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
