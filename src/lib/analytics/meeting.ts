import { trackEvent } from './index';

interface TrackMeetingEnterParams {
  gatheringId: string;
}

// LiveKit 토큰 발급 성공 직후 = 회의 실제 입장 시점 1회 발사.
// 대시보드 "회의" 탭 진입(view_dashboard tab=meeting)과 회의 참석은 다른 의도이므로 별도 이벤트.
export const trackMeetingEnter = ({ gatheringId }: TrackMeetingEnterParams) => {
  trackEvent('enter_meeting', { gathering_id: gatheringId });
};
