import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Textarea } from '.';

const meta = {
  title: 'components/Textarea',
  component: Textarea,
  args: {
    placeholder: '내용을 입력해 주세요',
  },
  argTypes: {
    size: {
      control: 'select',
      options: ['lg'],
    },
    error: {
      control: 'text',
    },
  },
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Textarea>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Goal: Story = {
  args: {
    label: '나의 목표',
    placeholder: '이 모임에서 달성할 목표를 적어주세요.(최소 5자, 최대 200자)',
  },
};

export const ShortIntro: Story = {
  args: {
    label: '한 줄 소개',
    placeholder: '(선택) 모임장에게 한마디를 적어주세요.',
  },
};

export const WithError: Story = {
  args: {
    label: '나의 목표',
    placeholder: '내용을 입력해 주세요',
    error: '10자 이상 입력해 주세요.',
    defaultValue: '짧음',
  },
};

/** default · focus · error · disabled 한 화면에서 비교 */
export const StatesMatrix: Story = {
  render: () => (
    <div className='grid max-w-md grid-cols-1 gap-6'>
      <Textarea label='Default' placeholder='기본 상태' />
      <Textarea label='Focus' placeholder='포커스 시 링·테두리 (탭으로 포커스)' autoFocus />
      <Textarea label='Error' placeholder='에러' error='필수 입력 항목입니다.' defaultValue='invalid' />
    </div>
  ),
};
