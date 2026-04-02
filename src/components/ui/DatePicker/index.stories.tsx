import { useState } from 'react';

import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { DatePicker } from '.';

const meta = {
  title: 'components/DatePicker',
  component: DatePicker,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
} satisfies Meta<typeof DatePicker>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    value: '',
    onChange: () => {},
  },
  render: () => {
    const [value, setValue] = useState<string>('');

    return (
      <div className='w-[320px]'>
        <DatePicker value={value} onChange={setValue} placeholder='모임 시작일을 선택해주세요' />
      </div>
    );
  },
};

export const WithError: Story = {
  args: {
    value: '',
    onChange: () => {},
  },
  render: () => {
    const [value, setValue] = useState<string>('');

    return (
      <div className='w-[320px]'>
        <DatePicker
          value={value}
          onChange={setValue}
          placeholder='모집 마감 일정을 선택해주세요'
          error='날짜를 선택해 주세요.'
        />
      </div>
    );
  },
};
