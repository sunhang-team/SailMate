import { trackEvent } from './index';
import { trackMeetingEnter } from './meeting';

jest.mock('./index', () => ({
  trackEvent: jest.fn(),
}));

describe('lib/analytics/meeting', () => {
  const trackEventMock = trackEvent as jest.Mock;

  beforeEach(() => {
    trackEventMock.mockClear();
  });

  describe('trackMeetingEnter', () => {
    it('gathering_id 와 함께 enter_meeting 이벤트를 발사한다', () => {
      trackMeetingEnter({ gatheringId: '42' });

      expect(trackEventMock).toHaveBeenCalledWith('enter_meeting', { gathering_id: '42' });
    });
  });
});
