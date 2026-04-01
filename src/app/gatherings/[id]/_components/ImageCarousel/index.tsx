'use client';

import { useState } from 'react';

import { Pagination } from '@/components/ui/Pagination';

import type { GatheringImage } from '@/api/gatherings/types';

const VISIBLE_COUNT = 3;

interface ImageCarouselProps {
  images: GatheringImage[];
}

export function ImageCarousel({ images }: ImageCarouselProps) {
  const [currentPage, setCurrentPage] = useState(1);

  const sortedImages = [...images].sort((a, b) => a.displayOrder - b.displayOrder);
  const totalPages = Math.ceil(sortedImages.length / VISIBLE_COUNT);

  return (
    <div className='flex flex-col gap-4 xl:gap-6'>
      <div className='flex items-center justify-end gap-3 xl:gap-6'>
        <span className='text-small-02-m md:text-small-01-m xl:text-body-02-m text-gray-600'>
          {currentPage}/{totalPages}
        </span>
        <Pagination variant='simple' currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
      </div>

      <div className='overflow-hidden [--gap:8px] xl:[--gap:16px]'>
        <div
          className='flex transition-transform duration-300 ease-in-out'
          style={{
            gap: 'var(--gap)',
            transform: `translateX(calc(-${currentPage - 1} * (100% + var(--gap))))`,
          }}
        >
          {Array.from({ length: totalPages }).map((_, pageIdx) => (
            <div key={pageIdx} className='grid w-full shrink-0 grid-cols-3' style={{ gap: 'var(--gap)' }}>
              {sortedImages.slice(pageIdx * VISIBLE_COUNT, (pageIdx + 1) * VISIBLE_COUNT).map((image) => (
                <img
                  key={image.displayOrder}
                  src={image.url}
                  alt={`모임 이미지 ${image.displayOrder + 1}`}
                  className='aspect-4/5 w-full rounded-lg object-cover xl:rounded-2xl'
                />
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
