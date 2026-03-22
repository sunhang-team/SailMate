import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Dropdown } from '.';
import { useState } from 'react';

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

const dropdownStyle = 'w-60 overflow-hidden bg-gray-100 text-sm';
const itemStyle = 'cursor-pointer px-4 py-2 transition-colors hover:bg-gray-200';

// closeOnSelect={false}: 항목 선택 후 메뉴가 닫히지 않는 예시
// 메뉴를 유지해야 할 때 사용
export const Default: Story = {
  args: {
    children: null,
  },
  render: () => {
    const [selected, setSelected] = useState('항목을 선택해주세요');
    return (
      <Dropdown>
        <Dropdown.Trigger>
          <div className='w-60 cursor-pointer bg-gray-100 px-4 py-2 text-sm'>{selected}</div>
        </Dropdown.Trigger>
        <Dropdown.Menu className={dropdownStyle}>
          {['항목 1', '항목 2', '항목 3'].map((item) => (
            // closeOnSelect={false}: 클릭해도 메뉴 유지
            <Dropdown.Item key={item} className={itemStyle} closeOnSelect={false} onClick={() => setSelected(item)}>
              {item}
            </Dropdown.Item>
          ))}
        </Dropdown.Menu>
      </Dropdown>
    );
  },
};

// 단일 선택 드롭다운: 항목 선택 시 메뉴가 닫히고 Trigger 텍스트가 선택값으로 업데이트됨
// closeOnSelect 기본값(true)이므로 별도 prop 불필요
export const GatheringType: Story = {
  args: {
    children: null,
  },
  render: () => {
    const [selected, setSelected] = useState('모임 유형을 선택해주세요');
    return (
      <Dropdown>
        <Dropdown.Trigger>
          <div className='w-60 cursor-pointer bg-gray-100 px-4 py-2 text-sm'>{selected}</div>
        </Dropdown.Trigger>
        <Dropdown.Menu className={dropdownStyle}>
          {['전체', '스터디', '사이드 프로젝트'].map((item) => (
            <Dropdown.Item key={item} className={itemStyle} onClick={() => setSelected(item)}>
              {item}
            </Dropdown.Item>
          ))}
        </Dropdown.Menu>
      </Dropdown>
    );
  },
};
