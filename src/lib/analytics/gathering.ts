import { trackEvent } from './index';

import type { GatheringEntrySource } from './events';

interface TrackGatheringSearchParams {
  query: string;
  category?: string;
  resultCount: number;
}

interface TrackGatheringViewParams {
  gatheringId: string;
  category: string;
  source: GatheringEntrySource;
}

export const trackGatheringSearch = ({ query, category, resultCount }: TrackGatheringSearchParams) => {
  trackEvent('search', { query, ...(category && { category }), result_count: resultCount });
};

export const trackGatheringView = ({ gatheringId, category, source }: TrackGatheringViewParams) => {
  trackEvent('view_gathering', { gathering_id: gatheringId, category, source });
};

export const trackGatheringCreateStart = () => {
  trackEvent('create_gathering_start', {});
};

interface TrackGatheringCreateSubmitParams {
  category: string;
  memberCount: number;
}

export const trackGatheringCreateSubmit = ({ category, memberCount }: TrackGatheringCreateSubmitParams) => {
  trackEvent('create_gathering_submit', { category, member_count: memberCount });
};

interface TrackGatheringJoinParams {
  gatheringId: string;
  category: string;
}

export const trackGatheringJoin = ({ gatheringId, category }: TrackGatheringJoinParams) => {
  trackEvent('join_gathering', { gathering_id: gatheringId, category });
};

/**
 * URL searchParams 에서 모임 상세 진입 경로를 판정한다.
 * 판정 규칙은 events.ts 의 GatheringEntrySource JSDoc 참고.
 */
export const resolveGatheringEntrySource = (searchParams: URLSearchParams): GatheringEntrySource => {
  const source = searchParams.get('source');
  if (source === 'search' || source === 'recommendation' || source === 'profile') return source;

  const hasUtm = searchParams.has('utm_source') || searchParams.has('utm_medium') || searchParams.has('utm_campaign');
  if (hasUtm) return 'shared_link';

  return 'direct';
};
