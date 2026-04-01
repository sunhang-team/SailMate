import { SearchIcon } from '@/components/ui/Icon/SearchIcon';

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
}

export function SearchInput({ value, onChange, onKeyDown }: SearchInputProps) {
  return (
    <div className='flex items-center gap-2 px-5 py-4 md:px-7 md:py-5 xl:flex-1'>
      <SearchIcon size={20} className='shrink-0 text-gray-800 md:size-7' />
      <input
        type='text'
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={onKeyDown}
        placeholder='검색어를 입력하세요'
        className='text-small-01-r md:text-body-01-r w-full outline-none placeholder:text-gray-400'
      />
    </div>
  );
}
