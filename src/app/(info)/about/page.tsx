import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '서비스 소개 | 완성도',
  description: '완성도는 스터디와 프로젝트 모임을 더 쉽게 만들고 관리할 수 있는 플랫폼입니다.',
};

const FEATURES = [
  {
    title: '함께하는 모임 관리',
    description:
      '스터디, 프로젝트 등 다양한 모임을 직접 만들거나 참여할 수 있습니다. 모임 정보와 멤버를 한곳에서 관리하세요.',
  },
  {
    title: '주차별 계획 관리',
    description:
      '모임의 목표와 진행 상황을 주차별로 기록하고 공유할 수 있습니다. 체계적인 일정 관리로 모임을 완성도 있게 이끌어가세요.',
  },
  {
    title: '리뷰 & 평가',
    description:
      '모임이 완료된 후 리뷰를 남기고 서로 평가할 수 있습니다. 솔직한 피드백으로 더 나은 모임 문화를 만들어가요.',
  },
];

export default function AboutPage() {
  return (
    <div>
      <h1 className='text-h5-b md:text-h4-b mb-4 text-gray-900'>서비스 소개</h1>
      <p className='text-body-02-r md:text-body-01-r mb-8 text-gray-600 md:mb-12'>
        완성도는 스터디와 프로젝트 모임을 더 쉽게 만들고 관리할 수 있는 플랫폼입니다. 함께하는 사람들과 목표를 세우고,
        꾸준히 실천하며, 의미 있는 결과를 만들어보세요.
      </p>
      <ul className='flex flex-col gap-4 md:gap-6'>
        {FEATURES.map(({ title, description }) => (
          <li key={title} className='rounded-2xl bg-gray-50 p-5 md:p-8'>
            <h2 className='text-body-01-b md:text-h5-b mb-2 text-gray-900 md:mb-3'>{title}</h2>
            <p className='text-body-02-r md:text-body-01-r text-gray-600'>{description}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
