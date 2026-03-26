import { userQueries } from '@/api/users/queries';
import { User } from '@/api/users/types';
import { useQuery } from '@tanstack/react-query';

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
