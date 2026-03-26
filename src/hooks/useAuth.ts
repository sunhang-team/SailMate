import { useQuery } from '@tanstack/react-query';

import { userQueries } from '@/api/users/queries';

import type { User } from '@/api/users/types';

interface AuthState {
  user: User | null;
  isLoggedIn: boolean;
  isLoading: boolean;
}

export const useAuth = (): AuthState => {
  const { data, isError, isLoading } = useQuery(userQueries.me());

  const isLoggedIn = !isLoading && !isError && data !== undefined;

  return {
    user: isLoggedIn ? data : null,
    isLoggedIn,
    isLoading,
  };
};
