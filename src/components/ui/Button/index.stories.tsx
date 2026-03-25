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

// ─── 인증 ───────────────────────────────────────────────
export const JoinLogin: Story = {
  name: '[인증] 로그인/회원가입',
  args: { variant: 'primary', size: 'join-login', children: '회원가입', disabled: false },
  argTypes: {
    children: { control: 'select', options: ['회원가입', '로그인'] },
    disabled: { control: 'boolean' },
  },
};

export const SignupSmall: Story = {
  name: '[인증] 회원가입 소형',
  args: { variant: 'primary', size: 'join-sm', children: '회원가입' },
};

export const LoginSmall: Story = {
  name: '[인증] 로그인 소형',
  args: { variant: 'login-outline', size: 'login-sm', children: '로그인' },
};

// ─── 소셜 ───────────────────────────────────────────────
export const Social: Story = {
  name: '[소셜] 텍스트',
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

export const SocialIcon: Story = {
  name: '[소셜] 아이콘',
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

// ─── 참여 ───────────────────────────────────────────────
export const Participation: Story = {
  name: '[참여] 대형',
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

export const ParticipationSm: Story = {
  name: '[참여] 소형',
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

export const Cancel: Story = {
  name: '[참여] 취소',
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

// ─── 액션 ───────────────────────────────────────────────
export const Action: Story = {
  name: '[액션] 대형',
  args: { variant: 'action', size: 'action', children: '작성 완료', disabled: false },
  argTypes: {
    children: { control: 'select', options: ['참여 신청하기', '작성 완료', '확인', '참여 대기중'] },
    disabled: { control: 'boolean' },
  },
};

export const ActionSmall: Story = {
  name: '[액션] 소형',
  args: { variant: 'action', size: 'action-sm', children: '작성 완료', disabled: false },
  argTypes: {
    disabled: { control: 'boolean' },
  },
};

export const Check: Story = {
  name: '[액션] 확인',
  args: { variant: 'check', size: 'check', children: '확인', disabled: false },
  argTypes: {
    disabled: { control: 'boolean' },
  },
};

// ─── 검색 ───────────────────────────────────────────────
export const Search: Story = {
  name: '[검색] 바',
  args: { variant: 'search', size: 'search', children: '검색' },
  argTypes: {
    variant: { control: 'select', options: ['search', 'search-gradient'] },
  },
};

export const KeywordSearch: Story = {
  name: '[검색] 키워드',
  args: {
    variant: 'keyword-search',
    size: 'keyword-search',
    children: (
      <>
        <SearchIcon size={28} gradient />
        키워드를 검색하세요.
      </>
    ),
  },
};

// ─── 태스크 ─────────────────────────────────────────────
export const AddTask: Story = {
  name: '[태스크] 추가',
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

export const Dropdown: Story = {
  name: '[태스크] 드롭다운',
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

// ─── 인터랙션 ────────────────────────────────────────────
export const Fire: Story = {
  name: '[인터랙션] 불꽃',
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

export const Bookmark: Story = {
  name: '[인터랙션] 북마크',
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

// ─── 마이페이지 ──────────────────────────────────────────
export const WriteReview: Story = {
  name: '[기타] 리뷰 쓰기',
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

export const MypageEdit: Story = {
  name: '[기타] 정보 수정',
  args: { variant: 'mypage-edit', size: 'mypage-edit', children: '내 정보 수정' },
};

export const FileUpload: Story = {
  name: '[기타] 파일 업로드',
  args: { variant: 'file-upload', size: 'file-upload', children: '파일 찾기' },
};

export const Tag: Story = {
  name: '[기타] 태그',
  args: { variant: 'tag', size: 'tag', children: '나' },
};

export const IconHand: Story = {
  name: '[기타] 아이콘 핸드',
  args: { variant: 'icon-hand', size: 'icon-hand', children: <HandIcon /> },
};
