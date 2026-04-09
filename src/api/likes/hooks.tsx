'use client';

import { useQuery } from '@tanstack/react-query';

import { AuthModal } from '@/components/AuthModal';
import { useAuth } from '@/hooks/useAuth';
import { useOverlay } from '@/hooks/useOverlay';
import { useToastStore } from '@/components/ui/Toast/useToastStore';

import { likeQueries, useAddLike, useRemoveLike } from './queries';

export const useLikeToggle = (gatheringId: number) => {
  const { isLoggedIn } = useAuth();
  const overlay = useOverlay();
  const { showToast } = useToastStore();

  const { data: likedIds = [] } = useQuery({
    ...likeQueries.myIds(),
    enabled: isLoggedIn,
  });

  const isLiked = likedIds.includes(gatheringId);

  const { mutate: addLike, isPending: isAdding } = useAddLike();
  const { mutate: removeLike, isPending: isRemoving } = useRemoveLike();

  const toggleLike = async () => {
    if (!isLoggedIn) {
      const isLoginSuccessful = await overlay.open(({ isOpen, close }) => (
        <AuthModal isOpen={isOpen} onClose={() => close(false)} onSuccess={() => close(true)} />
      ));

      if (!isLoginSuccessful) return;

      addLike(gatheringId);
      showToast({ variant: 'success', title: '관심 모임에 추가되었습니다.' });
      return;
    }

    if (isLiked) {
      removeLike(gatheringId);
      showToast({ variant: 'success', title: '관심 모임에서 제외되었습니다.' });
    } else {
      addLike(gatheringId);
      showToast({ variant: 'success', title: '관심 모임에 추가되었습니다.' });
    }
  };

  return {
    isLiked,
    toggleLike,
    isPending: isAdding || isRemoving,
  };
};
