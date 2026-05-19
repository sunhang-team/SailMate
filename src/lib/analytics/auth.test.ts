import { identifyUser, setUserProperties, trackEvent } from './index';
import { trackAuthLogin, trackAuthSignUp } from './auth';

jest.mock('./index', () => ({
  trackEvent: jest.fn(),
  identifyUser: jest.fn(),
  setUserProperties: jest.fn(),
}));

describe('lib/analytics/auth', () => {
  const trackEventMock = trackEvent as jest.Mock;
  const identifyUserMock = identifyUser as jest.Mock;
  const setUserPropertiesMock = setUserProperties as jest.Mock;

  beforeEach(() => {
    trackEventMock.mockClear();
    identifyUserMock.mockClear();
    setUserPropertiesMock.mockClear();
  });

  describe('trackAuthLogin', () => {
    it('login 이벤트 + identifyUser + auth_method user property 를 발사한다', () => {
      trackAuthLogin({ userId: '42', method: 'kakao' });

      expect(trackEventMock).toHaveBeenCalledWith('login', { method: 'kakao' });
      expect(identifyUserMock).toHaveBeenCalledWith('42');
      expect(setUserPropertiesMock).toHaveBeenCalledWith({ auth_method: 'kakao' });
    });

    it('login에서는 signup_date를 설정하지 않는다 (가입 시점 보존)', () => {
      trackAuthLogin({ userId: '42', method: 'email' });

      expect(setUserPropertiesMock).toHaveBeenCalledWith({ auth_method: 'email' });
      expect(setUserPropertiesMock).not.toHaveBeenCalledWith(
        expect.objectContaining({ signup_date: expect.anything() }),
      );
    });
  });

  describe('trackAuthSignUp', () => {
    it('sign_up 이벤트 + identifyUser + signup_date/auth_method user properties 를 발사한다', () => {
      jest.useFakeTimers().setSystemTime(new Date('2026-05-19T12:00:00Z'));

      trackAuthSignUp({ userId: '99', method: 'google' });

      expect(trackEventMock).toHaveBeenCalledWith('sign_up', { method: 'google' });
      expect(identifyUserMock).toHaveBeenCalledWith('99');
      expect(setUserPropertiesMock).toHaveBeenCalledWith({
        signup_date: '2026-05-19',
        auth_method: 'google',
      });

      jest.useRealTimers();
    });

    it('signup_date 는 YYYY-MM-DD 포맷이다', () => {
      trackAuthSignUp({ userId: '1', method: 'email' });

      const properties = setUserPropertiesMock.mock.calls[0][0];
      expect(properties.signup_date).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    });
  });
});
