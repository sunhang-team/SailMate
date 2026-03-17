import type { Meta, StoryObj } from '@storybook/nextjs';
import { Input } from './index';

const meta: Meta<typeof Input> = {
  title: 'Common/Input', // 스토리북 좌측 메뉴 구조
  component: Input,
  tags: ['autodocs'], // 자동으로 Props 문서 생성
  argTypes: {
    // 스토리북 제어판에서 테스트할 속성들
    type: {
      control: 'select',
      options: ['text', 'password', 'email'],
    },
    error: {
      control: 'text',
    },
  },
};

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
export const WithError: Story = {
  args: {
    label: '이메일',
    placeholder: '이메일을 입력해주세요',
    error: '올바른 이메일 형식이 아닙니다.',
    defaultValue: 'wrong-email@',
  },
};

// 4. 비밀번호 타입 (Password)
export const Password: Story = {
  args: {
    label: '비밀번호',
    type: 'password',
    placeholder: '비밀번호를 입력해주세요',
  },
};

// 5. 라벨 없는 상태 (No Label)
export const NoLabel: Story = {
  args: {
    placeholder: '',
  },
};
