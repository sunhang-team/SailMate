import { useEffect, useState } from 'react';

import { cn } from '@/lib/cn';
import { CloseIcon } from '@/components/ui/Icon';

const TAGS_PER_PAGE_MOBILE = 2;
const TAGS_PER_PAGE_TABLET = 6;

interface KeywordTagData {
  text: string;
  count: number;
}

interface KeywordTagsProps {
  tags: KeywordTagData[];
}

export function KeywordTags({ tags }: KeywordTagsProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(true);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const tagsPerPage = isMobile ? TAGS_PER_PAGE_MOBILE : TAGS_PER_PAGE_TABLET;
  const totalPages = Math.ceil((tags?.length || 0) / tagsPerPage);
  const safeIndex = currentIndex >= totalPages ? 0 : currentIndex;
  const visibleTags = isMobile ? tags.slice(safeIndex * tagsPerPage, (safeIndex + 1) * tagsPerPage) : tags;

  if (!tags || tags.length === 0)
    return (
      <div className='rounded-lg bg-gray-100 p-4 text-center text-sm text-gray-400'>
        아직 등록된 키워드 평가가 없습니다.
      </div>
    );

  return (
    <div className='flex min-h-[85px] flex-col gap-3 rounded-lg bg-gray-100 p-4 min-[744px]:min-h-[132px] min-[744px]:justify-center min-[744px]:gap-2 min-[744px]:p-6'>
      <div className='flex min-w-0 flex-wrap items-center gap-2 overflow-hidden min-[744px]:overflow-visible'>
        {visibleTags.map((tag) => (
          <span
            key={tag.text}
            className='text-small-02-m min-[744px]:text-small-01-m bg-gray-150 inline-flex w-fit items-center justify-center gap-0.5 rounded-lg px-3 py-2 whitespace-nowrap text-gray-600'
          >
            {tag.text}
            <CloseIcon size={16} className='text-gray-400' />
            <span className='text-small-02-m min-[744px]:text-small-01-m text-gray-700'>{tag.count}</span>
          </span>
        ))}
      </div>

      {isMobile && totalPages > 1 && (
        <div className='flex items-center justify-center gap-1.5'>
          {Array.from({ length: totalPages }).map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={cn(
                'h-1.5 cursor-pointer rounded-full transition-all duration-300',
                safeIndex === idx ? 'w-4 bg-blue-300' : 'w-3 bg-gray-300 hover:bg-gray-400',
              )}
            />
          ))}
        </div>
      )}
    </div>
  );
}
