import { useQuery } from '@tanstack/react-query';

import { useIsMounted } from '@frontend-toolkit-js/hooks';

import { userQueries } from '@/api/users/queries';

import type { User } from '@/api/users/types';

interface AuthState {
  user: User | null;
  isLoggedIn: boolean;
  isLoading: boolean;
}

export const useAuth = (): AuthState => {
  const isMounted = useIsMounted();
  const hasSession = isMounted && document.cookie.includes('has-session=');

  const { data, isError, isLoading } = useQuery({
    ...userQueries.me(),
    enabled: hasSession,
  });

  if (!hasSession) {
    return { user: null, isLoggedIn: false, isLoading: false };
  }

  const isLoggedIn = !isLoading && !isError && data !== undefined;

  return {
    user: isLoggedIn ? data : null,
    isLoggedIn,
    isLoading,
  };
};
