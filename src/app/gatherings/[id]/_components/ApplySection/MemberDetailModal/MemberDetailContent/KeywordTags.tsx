import { useEffect, useState } from 'react';

import { cn } from '@/lib/cn';
import { Tag } from '@/components/ui/Tag';

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
  const currentTags = tags.slice(safeIndex * tagsPerPage, (safeIndex + 1) * tagsPerPage);

  if (!tags || tags.length === 0)
    return (
      <div className='rounded-xl bg-gray-50 p-2 text-center text-sm text-gray-400'>
        아직 등록된 키워드 평가가 없습니다.
      </div>
    );

  return (
    <div className='flex flex-col gap-2 rounded-xl bg-gray-50 p-2'>
      <div className='flex min-h-[32px] items-center justify-center gap-2 md:min-h-[72px]'>
        {currentTags.map((tag) => (
          <Tag key={tag.text} variant='bad' count={tag.count} className='text-small-02-m md:text-small-01-m'>
            {tag.text}
          </Tag>
        ))}
      </div>

      {totalPages > 1 && (
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
