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

export const Default: Story = {
  args: {
    children: null,
  },
  render: () => (
    <Dropdown>
      <Dropdown.Trigger>
        <div className='w-60 cursor-pointer bg-gray-100 px-4 py-2 text-sm'>항목을 선택해주세요</div>
      </Dropdown.Trigger>
      <Dropdown.Menu className={dropdownStyle}>
        <Dropdown.Item className={itemStyle}>항목 1</Dropdown.Item>
        <Dropdown.Item className={itemStyle}>항목 2</Dropdown.Item>
        <Dropdown.Item className={itemStyle}>항목 3</Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
  ),
};

// 모임 유형
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
