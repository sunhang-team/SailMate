'use client';

import { useRouter } from 'next/navigation';

import { useLogout } from '@/api/auth/queries';
import { useAuth } from '@/hooks/useAuth';
import { cn } from '@/lib/cn';
import { Dropdown } from '@/components/ui/Dropdown';
import { NotificationDropdown } from './NotificationDropdown';
import { Profile } from '@/components/ui/Profile';
import { Button } from '@/components/ui/Button';

export function AuthSection() {
  const router = useRouter();
  const { user, isLoggedIn, isLoading } = useAuth();

  const { mutate: logout, isPending: isLogoutPending } = useLogout({
    onSuccess: () => {
      router.push('/');
    },
  });

  const handleMoveLogin = () => router.push('/login');
  const handleMoveRegister = () => router.push('/register');
  const handleMoveMyPage = () => router.push('/my');

  if (isLoading) {
    return <div className='h-[42px] w-[154px]' aria-hidden />;
  }
  if (!isLoggedIn) {
    return (
      <div className='flex items-center gap-2 lg:gap-2'>
        <Button variant='login-outline' size='login-sm' onClick={handleMoveLogin}>
          로그인
        </Button>
        <Button variant='primary' size='join-sm' onClick={handleMoveRegister}>
          회원가입
        </Button>
      </div>
    );
  }
  return (
    <div className='flex items-center gap-2 lg:gap-4'>
      <NotificationDropdown />
      <Dropdown className='flex items-center'>
        <Dropdown.Trigger>
          <Profile imageUrl={user?.profileImage} className='h-[42px] w-[42px]' />
        </Dropdown.Trigger>
        <Dropdown.Menu className='border-gray-150 bg-gray-0 shadow-01 absolute top-[calc(100%+25px)] right-1/2 z-10 min-w-[100px] translate-x-1/2 rounded-lg border p-1'>
          <Dropdown.Item
            onClick={handleMoveMyPage}
            className='text-small-01-r cursor-pointer rounded-md px-2 py-2 text-gray-700 hover:bg-gray-100'
          >
            마이페이지
          </Dropdown.Item>
          <Dropdown.Item
            onClick={() => logout()}
            className={cn(
              'text-small-01-r cursor-pointer rounded-md px-2 py-2 text-gray-700 hover:bg-gray-100',
              isLogoutPending && 'pointer-events-none opacity-50',
            )}
          >
            로그아웃
          </Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
    </div>
  );
}
