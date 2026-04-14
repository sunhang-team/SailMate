import { useCallback, useState } from 'react';

import { DEFAULT_PROFILE_IMAGE, normalizeImageUrl } from '@/constants/image';

/**
 * Next.js Image 컴포넌트의 폴백 이미지 처리를 위한 훅
 *
 * @param imageUrl - 원본 이미지 URL
 * @param fallback - 에러 시 대체 이미지 URL (기본값: DEFAULT_PROFILE_IMAGE)
 * @returns imgSrc, onError 핸들러
 *
 * @example
 * ```tsx
 * const { imgSrc, onError } = useFallbackImage(user.profileImage);
 * <Image src={imgSrc} onError={onError} ... />
 * ```
 */
export function useFallbackImage(imageUrl?: string | null, fallback: string = DEFAULT_PROFILE_IMAGE) {
  const [imgSrc, setImgSrc] = useState(() => normalizeImageUrl(imageUrl));
  const onError = useCallback(() => setImgSrc(fallback), [fallback]);

  return { imgSrc, onError } as const;
}
