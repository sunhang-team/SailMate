import React from 'react';
import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Button } from '.';

const meta = {
  title: 'components/Button',
  component: Button,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
} satisfies Meta<typeof Button>;

export default meta;

type Story = StoryObj<typeof meta>;

// Join Login
export const JoinLogin: Story = {
  args: { variant: 'primary', size: 'join-login', children: '로그인', disabled: false },
  argTypes: {
    children: { control: 'select', options: ['로그인', '회원가입'] },
    disabled: { control: 'boolean' },
  },
};

// Join Login Small
export const SignupSmall: Story = {
  args: { variant: 'primary', size: 'join-sm', children: '회원가입' },
};

export const LoginSmall: Story = {
  args: { variant: 'login-outline', size: 'login-sm', children: '로그인' },
};

// Action
export const Action: Story = {
  args: { variant: 'action', size: 'action', children: '참여 신청하기', disabled: false },
  argTypes: {
    children: { control: 'select', options: ['참여 신청하기', '작성 완료', '확인', '참여 대기중'] },
    disabled: { control: 'boolean' },
  },
};

export const ActionSmall: Story = {
  args: { variant: 'action', size: 'action-sm', children: '작성 완료', disabled: false },
  argTypes: {
    disabled: { control: 'boolean' },
  },
};

// Participation
export const Participation: Story = {
  name: 'Participation',
  render: () => (
    <div className='flex flex-col gap-4'>
      <Button variant='participation-outline' size='participation'>
        참여하기
      </Button>
      <Button
        variant='participation-outline'
        size='participation'
        className='bg-gradient-primary text-white before:hidden'
      >
        참여하기
      </Button>
      <Button variant='participation-outline' size='participation' disabled>
        참여하기
      </Button>
    </div>
  ),
};

// Cancel
export const Cancel: Story = {
  name: 'Cancel',
  render: () => (
    <div className='flex flex-col gap-4'>
      <Button variant='cancel' size='cancel'>
        참여 취소하기
      </Button>
      <Button variant='cancel' size='cancel' aria-pressed='true'>
        참여 취소하기
      </Button>
    </div>
  ),
};

export const ParticipationSm: Story = {
  name: 'Participation Small',
  args: { variant: 'participation', size: 'participation-sm', children: '참여하기' },
  argTypes: {
    variant: { control: 'select', options: ['participation', 'participation-outline'] },
  },
};

// Mypage Edit
export const MypageEdit: Story = {
  name: 'Mypage Edit',
  args: { variant: 'mypage-edit', size: 'mypage-edit', children: '내 정보 수정' },
};

// File Upload
export const FileUpload: Story = {
  args: { variant: 'file-upload', size: 'file-upload', children: '파일 찾기' },
};

// Check
export const Check: Story = {
  args: { variant: 'check', size: 'check', children: '확인', disabled: false },
  argTypes: {
    disabled: { control: 'boolean' },
  },
};

// Search
export const Search: Story = {
  args: { variant: 'search', size: 'search', children: '검색' },
  argTypes: {
    variant: { control: 'select', options: ['search', 'search-gradient'] },
  },
};
