'use client';

import { useRouter } from 'next/navigation';

import { useLogout } from '@/api/auth/queries';
import { useAuth } from '@/hooks/useAuth';
import { cn } from '@/lib/cn';
import { Dropdown } from '@/components/ui/Dropdown';
import { NotificationsIcon } from '@/components/ui/Icon';
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
  const handleMoveSignup = () => router.push('/signup');
  const handleMoveMyPage = () => router.push('/my');

  return (
    <div className={cn('flex items-center', isLoggedIn ? 'lg:gap-4' : 'lg:gap-2')}>
      {isLoading || !isLoggedIn ? (
        <>
          <Button variant='login-outline' size='login-sm' onClick={handleMoveLogin}>
            로그인
          </Button>
          <Button variant='primary' size='join-sm' onClick={handleMoveSignup}>
            회원가입
          </Button>
        </>
      ) : (
        <>
          <button
            type='button'
            aria-label='알림'
            className='inline-flex h-9 w-9 items-center justify-center rounded-full text-gray-500 transition-colors hover:bg-gray-100'
          >
            <NotificationsIcon size={36} />
          </button>

          <Dropdown className='flex items-center gap-1'>
            <Dropdown.Trigger>
              <Profile imageUrl={user?.profileImage} nickname={user?.nickname} className='h-10 w-10' />
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
        </>
      )}
    </div>
  );
}
