import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Input } from './index';

const meta: Meta<typeof Input> = {
  title: 'components/Input',
  component: Input,
  tags: ['autodocs'],
  argTypes: {
    type: {
      control: 'select',
      options: ['text', 'password', 'email'],
    },
    error: {
      control: 'text',
    },
  },
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof Input>;

// 1. 이메일 타입 (Email)
export const Email: Story = {
  args: {
    label: '이메일',
    placeholder: '이메일을 입력해주세요',
  },
};

// 2. 닉네임 타입 (Nickname)
export const Nickname: Story = {
  args: {
    label: '닉네임',
    placeholder: '닉네임을 입력해주세요',
  },
};

// 3. 에러 발생 상태 (Error)
export const WithEmailError: Story = {
  args: {
    label: '이메일',
    placeholder: '이메일을 입력해주세요',
    error: '이메일 형식이 올바르지 않습니다.',
    defaultValue: 'wrong-email@',
  },
};

// 4. 비밀번호 타입 (Password)
export const Password: Story = {
  args: {
    label: '비밀번호',
    type: 'password',
    placeholder: '영문, 숫자, 특수문자 포함 8자 이상 입력해주세요',
  },
};

export const WithPasswordError: Story = {
  args: {
    label: '비밀번호',
    type: 'password',
    placeholder: '영문, 숫자, 특수문자 포함 8자 이상 입력해주세요',
    error: '영문, 숫자, 특수문자 포함 8자 이상 입력해주세요',
    defaultValue: 'wrong-password',
  },
};

export const NoLabel: Story = {
  args: {
    placeholder: '',
  },
};

/** default · focus · error · disabled 한 화면에서 비교 */
export const StatesMatrix: Story = {
  render: () => (
    <div className='grid max-w-md grid-cols-1 gap-6'>
      <Input label='Default' placeholder='기본 상태' />
      <Input label='Focus' placeholder='포커스 시 링·테두리 (탭으로 포커스)' autoFocus />
      <Input label='Error' placeholder='에러' error='필수 입력 항목입니다.' defaultValue='invalid' />
    </div>
  ),
};
