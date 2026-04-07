import { useQuery } from '@tanstack/react-query';

import { userQueries } from '@/api/users/queries';

import type { User } from '@/api/users/types';

interface AuthState {
  user: User | null;
  isLoggedIn: boolean;
  isLoading: boolean;
}

const hasSessionHint = () => typeof document !== 'undefined' && document.cookie.includes('has-session=');

export const useAuth = (): AuthState => {
  const enabled = hasSessionHint();
  const { data, isError, isLoading } = useQuery({
    ...userQueries.me(),
    enabled,
  });

  if (!enabled) {
    return { user: null, isLoggedIn: false, isLoading: false };
  }

  const isLoggedIn = !isLoading && !isError && data !== undefined;

  return {
    user: isLoggedIn ? data : null,
    isLoggedIn,
    isLoading,
  };
};
