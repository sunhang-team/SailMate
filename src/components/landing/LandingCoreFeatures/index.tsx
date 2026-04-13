import Image from 'next/image';

import { LANDING_FEATURES } from '@/components/landing/landingConstants';
import { LandingSectionHeading } from '@/components/landing/LandingSectionHeading';
import { Card } from '@/components/ui/Card';
import { Tag } from '@/components/ui/Tag';

export function LandingCoreFeatures() {
  return (
    <section className='bg-gray-100 px-4 py-20 md:px-7 lg:px-30 lg:py-40'>
      <div className='w-full text-center'>
        <LandingSectionHeading eyebrow='Core Features' title='팀 구성부터 목표 관리, 최종 달성까지' align='center' />
        <p className='text-small-02-r md:text-body-02-r lg:text-body-01-r mt-2 text-gray-800'>
          사이드 프로젝트와 스터디의 전 과정을 &apos;완성도&apos;가 함께합니다.
        </p>
        <ul className='mt-12 grid grid-cols-1 gap-6 md:mt-14 md:grid-cols-2 lg:mt-20 lg:gap-8 2xl:grid-cols-4'>
          {LANDING_FEATURES.map((item) => (
            <li key={item.featureLabel}>
              <Card className='relative flex h-full min-h-[274px] w-full flex-col overflow-hidden p-8 text-left md:min-h-[283px] lg:min-h-[297px]'>
                <div className='flex flex-col gap-4'>
                  <Tag variant='coreFeature'>{item.featureLabel}</Tag>
                  <div>
                    <h3 className='text-body-01-b md:text-h5-b lg:text-h4-b break-keep text-gray-800'>{item.title}</h3>
                    <div className='text-small-02-r md:text-body-01-r lg:text-body-02-r flex flex-1 flex-col gap-1 text-gray-700'>
                      {item.description.map((line) => (
                        <p key={line}>{line}</p>
                      ))}
                    </div>
                  </div>
                </div>

                <div className='pointer-events-none self-end' aria-hidden>
                  <Image src={item.iconSrc} alt='' width={116} height={100} />
                </div>
              </Card>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
