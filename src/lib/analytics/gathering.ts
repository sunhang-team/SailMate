import { extractFailureReason } from './extractFailureReason';
import { trackEvent } from './index';

import type { DashboardTab, GatheringEntrySource, ShareChannel } from './events';

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

interface TrackGatheringCreateFailedParams {
  category: string;
  error: unknown;
}

export const trackGatheringCreateFailed = ({ category, error }: TrackGatheringCreateFailedParams) => {
  trackEvent('create_gathering_failed', { category, reason: extractFailureReason(error) });
};

interface TrackGatheringJoinFailedParams {
  gatheringId: string;
  category: string;
  error: unknown;
}

export const trackGatheringJoinFailed = ({ gatheringId, category, error }: TrackGatheringJoinFailedParams) => {
  trackEvent('join_gathering_failed', {
    gathering_id: gatheringId,
    category,
    reason: extractFailureReason(error),
  });
};

interface TrackGatheringDashboardViewParams {
  gatheringId: string;
  tab: DashboardTab;
}

export const trackGatheringDashboardView = ({ gatheringId, tab }: TrackGatheringDashboardViewParams) => {
  trackEvent('view_dashboard', { gathering_id: gatheringId, tab });
};

interface TrackGatheringShareParams {
  gatheringId: string;
  channel: ShareChannel;
}

export const trackGatheringShare = ({ gatheringId, channel }: TrackGatheringShareParams) => {
  trackEvent('share_gathering', { gathering_id: gatheringId, channel });
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
