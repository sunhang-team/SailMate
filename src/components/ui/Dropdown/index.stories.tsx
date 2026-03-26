import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Dropdown } from '.';
import { useState } from 'react';
import { ArrowIcon, TypeIcon, CloseIcon, CategoryIcon } from '../Icon';
import { cn } from '@/lib/cn';
import { useDropdown } from './context';

const meta = {
  title: 'components/Dropdown',
  component: Dropdown,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Dropdown>;

export default meta;

type Story = StoryObj<typeof meta>;

// ─────────────────────────────────────────
// 공통 스타일
// ─────────────────────────────────────────
const menuBox = 'bg-white rounded-lg border border-blue-100';
const baseItem = 'cursor-pointer px-4 py-3';
const selectedItem = 'bg-blue-100 text-blue-400';

// ─────────────────────────────────────────
// 1. 모임유형 드롭다운
//    - 단일 선택, 선택 시 파란 배경 + 숫자 표시
// ─────────────────────────────────────────

const RotatingArrow = () => {
  const { isOpen } = useDropdown();
  return <ArrowIcon className={cn('rotate-90 transition-transform duration-200', isOpen ? 'rotate-270' : '')} />;
};

export const GatheringType: Story = {
  args: { children: null },
  render: () => {
    const [selected, setSelected] = useState('모임 유형을 선택해주세요');
    const items = [
      { label: '전체', count: 200 },
      { label: '스터디', count: 120 },
      { label: '사이드 프로젝트', count: 80 },
    ];
    return (
      <Dropdown>
        <Dropdown.Trigger>
          <div className='flex w-full min-w-[438px] cursor-pointer items-center justify-between bg-gray-100 px-4 py-3 text-sm'>
            <div className='flex items-center gap-2'>
              <TypeIcon />
              <span className={cn('', selected === '모임 유형을 선택해주세요' ? 'text-gray-400' : 'text-gray-900')}>
                {selected}
              </span>
            </div>
            <RotatingArrow />
          </div>
        </Dropdown.Trigger>
        <Dropdown.Menu className={`w-full min-w-[438px] overflow-hidden p-2 text-sm ${menuBox}`}>
          {items.map((item) => (
            <Dropdown.Item
              key={item.label}
              className={`${baseItem} flex items-center justify-between rounded-lg hover:bg-blue-100 hover:text-blue-400`}
              onClick={() => setSelected(item.label)}
            >
              <span>{item.label}</span>
              <span>{item.count}</span>
            </Dropdown.Item>
          ))}
        </Dropdown.Menu>
      </Dropdown>
    );
  },
};

// ─────────────────────────────────────────
// 2. 카테고리 드롭다운 (사이드바)
//    - 단일 선택, 스크롤, 선택 시 파란 배경
// ─────────────────────────────────────────
export const CategorySidebar: Story = {
  args: { children: null },
  render: () => {
    const [selectedSet, setSelectedSet] = useState<Set<string>>(new Set());

    // 실제로는 props로 받아올 예정
    const items = [
      { label: '개발' },
      { label: '어학' },
      { label: '독서' },
      { label: '자격증' },
      { label: '디자인' },
      { label: '기획' },
      { label: '마케팅' },
      { label: '데이터 분석' },
    ];

    const toggle = (label: string) => {
      setSelectedSet((prev) => {
        const next = new Set(prev);
        if (next.has(label)) next.delete(label);
        else next.add(label);
        return next;
      });
    };

    const selectedList = Array.from(selectedSet);
    const hasSelected = selectedSet.size > 0;

    return (
      <Dropdown className='w-full'>
        <Dropdown.Trigger>
          <div className='flex w-[493px] cursor-pointer items-center justify-between border-blue-300 bg-white px-4 py-3 text-sm'>
            <div className='flex items-center gap-2'>
              <CategoryIcon />
              <span className={cn('font-bold', hasSelected ? 'text-gray-900' : 'text-gray-400')}>
                {hasSelected ? `카테고리(${selectedSet.size})` : '카테고리를 선택해주세요'}
              </span>
              {hasSelected && <span className='ml-1'>{selectedList.join(', ')}</span>}
            </div>
            <RotatingArrow />
          </div>
        </Dropdown.Trigger>
        <Dropdown.Menu
          className={`custom-scrollbar text-body-02-r max-h-[240px] w-[493px] overflow-y-auto p-2 ${menuBox}`}
        >
          {items.map((item) => {
            const isSelected = selectedSet.has(item.label);
            return (
              <Dropdown.Item
                key={item.label}
                closeOnSelect={false}
                className={`${baseItem} flex items-center justify-between rounded-lg hover:bg-blue-100 hover:text-blue-400 ${isSelected ? selectedItem : ''}`}
                onClick={() => toggle(item.label)}
              >
                <span>{item.label}</span>
                <div className='flex items-center gap-2'>{isSelected && <CloseIcon className='size-4' />}</div>
              </Dropdown.Item>
            );
          })}
        </Dropdown.Menu>
      </Dropdown>
    );
  },
};

// ─────────────────────────────────────────
// 3. 수정/삭제 드롭다운
//    - 가장 심플한 액션 메뉴
// ─────────────────────────────────────────
export const ActionMenu: Story = {
  args: { children: null },
  render: () => {
    return (
      <Dropdown>
        <Dropdown.Trigger>
          <div className='cursor-pointer rounded-lg border border-gray-200 px-3 py-2 text-sm'>⋮</div>
        </Dropdown.Trigger>
        <Dropdown.Menu className={`min-w-[120px] overflow-hidden text-sm ${menuBox}`}>
          <Dropdown.Item
            className={`${baseItem} hover:font-bold hover:text-gray-900`}
            onClick={() => console.log('수정')}
          >
            수정
          </Dropdown.Item>
          <Dropdown.Item
            className={`${baseItem} hover:font-bold hover:text-gray-900`}
            onClick={() => console.log('삭제')}
          >
            삭제
          </Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
    );
  },
};

// ─────────────────────────────────────────
// 4. 영역 드롭다운 (모집 상태)
//    - 선택된 항목 볼드, 비활성 항목 회색 텍스트
// ─────────────────────────────────────────
export const StatusFilter: Story = {
  args: { children: null },
  render: () => {
    const [selected, setSelected] = useState('전체');
    const items = ['전체', '모집중', '모집마감'];

    return (
      <Dropdown>
        <Dropdown.Trigger>
          <div className='flex min-w-[104px] cursor-pointer items-center justify-between px-4 py-3 text-sm'>
            <span>{selected}</span>
            <RotatingArrow />
          </div>
        </Dropdown.Trigger>
        <Dropdown.Menu className={`min-w-[104px] overflow-hidden text-sm ${menuBox}`}>
          {items.map((item) => (
            <Dropdown.Item
              key={item}
              className={`hover:font-bold hover:text-gray-900 ${baseItem} ${
                selected === item ? 'font-bold text-gray-900' : 'text-body-01-r text-gray-400'
              }`}
              onClick={() => setSelected(item)}
            >
              {item}
            </Dropdown.Item>
          ))}
        </Dropdown.Menu>
      </Dropdown>
    );
  },
};

// ─────────────────────────────────────────
// 5. Category Drop Down (전체 너비)
//    - 다중 선택, 풀 와이드, 선택 시 파란 배경 + ✕ 아이콘
// ─────────────────────────────────────────
export const CategoryFullWidth: Story = {
  args: { children: null },
  render: () => {
    const [selectedSet, setSelectedSet] = useState<Set<string>>(new Set());

    // 실제로는 props로 받아올 예정
    const items = [
      { label: '개발', count: 16 },
      { label: '어학', count: 12 },
      { label: '독서', count: 4 },
      { label: '자격증', count: 10 },
      { label: '디자인', count: 7 },
      { label: '기획', count: 5 },
      { label: '마케팅', count: 2 },
      { label: '데이터 분석', count: 3 },
    ];

    const toggle = (label: string) => {
      setSelectedSet((prev) => {
        const next = new Set(prev);
        if (next.has(label)) next.delete(label);
        else next.add(label);
        return next;
      });
    };

    const selectedList = Array.from(selectedSet);
    const hasSelected = selectedSet.size > 0;

    return (
      <Dropdown className='w-full'>
        <Dropdown.Trigger>
          <div className='flex w-[600px] cursor-pointer items-center justify-between border-blue-300 bg-white px-4 py-3 text-sm'>
            <div className='flex items-center gap-2'>
              <CategoryIcon />
              <span className={cn('font-bold', hasSelected ? 'text-gray-900' : 'text-gray-400')}>
                {hasSelected ? `카테고리(${selectedSet.size})` : '카테고리를 선택해주세요'}
              </span>
              {hasSelected && <span className='ml-1'>{selectedList.join(', ')}</span>}
            </div>
            <RotatingArrow />
          </div>
        </Dropdown.Trigger>
        <Dropdown.Menu
          className={`custom-scrollbar text-body-02-r max-h-[240px] w-[600px] overflow-y-auto p-2 ${menuBox}`}
        >
          {items.map((item) => {
            const isSelected = selectedSet.has(item.label);
            return (
              <Dropdown.Item
                key={item.label}
                closeOnSelect={false}
                className={`${baseItem} flex items-center justify-between rounded-lg hover:bg-blue-100 hover:text-blue-400 ${isSelected ? selectedItem : ''}`}
                onClick={() => toggle(item.label)}
              >
                <span>{item.label}</span>
                <div className='flex items-center gap-2'>
                  <span className={isSelected ? 'text-blue-400' : 'text-gray-400'}>{item.count}</span>
                  {isSelected && <CloseIcon className='size-4' />}
                </div>
              </Dropdown.Item>
            );
          })}
        </Dropdown.Menu>
      </Dropdown>
    );
  },
};
