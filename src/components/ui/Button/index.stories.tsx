import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { GoogleIcon } from '@/components/ui/Icon/GoogleIcon';
import { SearchIcon } from '@/components/ui/Icon/SearchIcon';
import { KakaoIcon } from '@/components/ui/Icon/KakaoIcon';
import { ArrowIcon } from '@/components/ui/Icon/ArrowIcon';
import { FireButtonIcon } from '@/components/ui/Icon/FireButtonIcon';
import { HandIcon } from '@/components/ui/Icon/HandIcon';
import { ReviewIcon } from '@/components/ui/Icon/ReviewIcon';
import { HeartIcon } from '@/components/ui/Icon/HeartIcon';
import { EmailIcon } from '@/components/ui/Icon/EmailIcon';
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
  args: { variant: 'primary', size: 'join-login', children: '회원가입', disabled: false },
  argTypes: {
    children: { control: 'select', options: ['회원가입', '로그인'] },
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
  args: { variant: 'action', size: 'action', children: '작성 완료', disabled: false },
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
  render: () => (
    <div className='flex flex-col gap-4'>
      <Button variant='participation-outline-sm' size='participation-sm'>
        참여하기
      </Button>
      <Button variant='participation' size='participation-sm'>
        참여하기
      </Button>
    </div>
  ),
};

// Social
export const Social: Story = {
  name: 'Social',
  render: () => (
    <div className='flex flex-col gap-4'>
      <Button variant='social' size='social'>
        <GoogleIcon size={24} />
        구글로 시작하기
      </Button>
      <Button variant='social-kakao' size='social-kakao'>
        <KakaoIcon size={24} />
        카카오로 시작하기
      </Button>
    </div>
  ),
};

// Social Icon
export const SocialIcon: Story = {
  name: 'Social Icon',
  render: () => (
    <div className='flex gap-4'>
      <Button variant='social-icon-kakao' size='social-icon'>
        <KakaoIcon size={24} />
      </Button>
      <Button variant='social-icon-google' size='social-icon'>
        <GoogleIcon size={24} />
      </Button>
      <Button variant='social-icon-email' size='social-icon'>
        <EmailIcon size={24} />
      </Button>
    </div>
  ),
};

// Keyword Search
export const KeywordSearch: Story = {
  name: 'Keyword Search',
  args: {
    variant: 'keyword-search',
    size: 'keyword-search',
    children: (
      <>
        <SearchIcon size={28} />
        키워드를 검색하세요.
      </>
    ),
  },
};

// Dropdown
export const Dropdown: Story = {
  name: 'Dropdown',
  args: {
    variant: 'dropdown',
    size: 'dropdown',
    children: (
      <>
        내 달성률
        <ArrowIcon size={24} className='rotate-90' />
      </>
    ),
  },
};

// Add Task
export const AddTask: Story = {
  name: 'Add Task',
  args: {
    variant: 'add-task',
    size: 'add-task',
    children: (
      <>
        <span className='text-[28px] leading-none font-light'>+</span>할 일 추가
      </>
    ),
  },
};

// Fire
export const Fire: Story = {
  name: 'Fire',
  render: () => (
    <div className='flex gap-4'>
      <Button variant='fire' size='fire'>
        <FireButtonIcon size={32} variant='active' />
      </Button>
      <Button variant='fire' size='fire' data-selected='true'>
        <FireButtonIcon size={32} variant='disabled' />
      </Button>
    </div>
  ),
};

// Bookmark
export const Bookmark: Story = {
  name: 'Bookmark',
  render: () => (
    <div className='flex items-end gap-4'>
      <Button variant='bookmark' size='bookmark-sm'>
        <HeartIcon size={24} variant='outline' />
      </Button>
      <Button variant='bookmark' size='bookmark-sm' data-selected='true'>
        <HeartIcon size={24} variant='filled' />
      </Button>
      <Button variant='bookmark' size='bookmark-lg'>
        <HeartIcon size={36} variant='outline' />
      </Button>
      <Button variant='bookmark' size='bookmark-lg' data-selected='true'>
        <HeartIcon size={36} variant='filled' />
      </Button>
    </div>
  ),
};

// Write Review
export const WriteReview: Story = {
  name: 'Write Review',
  args: {
    variant: 'write-review',
    size: 'write-review',
    children: (
      <>
        <ReviewIcon size={24} />
        리뷰 쓰기
      </>
    ),
  },
};

// Tag
export const Tag: Story = {
  name: 'Tag',
  args: { variant: 'tag', size: 'tag', children: '나' },
};

// Icon Hand
export const IconHand: Story = {
  name: 'Icon Hand',
  args: { variant: 'icon-hand', size: 'icon-hand', children: <HandIcon /> },
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
