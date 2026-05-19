import { identifyUser, setUserProperties, trackEvent } from './index';

describe('lib/analytics', () => {
  const originalGaId = process.env.NEXT_PUBLIC_GA_ID;
  let consoleDebugSpy: jest.SpyInstance;
  let gtagMock: jest.Mock;

  beforeEach(() => {
    consoleDebugSpy = jest.spyOn(console, 'debug').mockImplementation(() => {});
    gtagMock = jest.fn();
    window.gtag = gtagMock;
  });

  afterEach(() => {
    consoleDebugSpy.mockRestore();
    delete window.gtag;
    process.env.NEXT_PUBLIC_GA_ID = originalGaId;
  });

  describe('trackEvent', () => {
    it('dev 환경에서는 console.debug만 호출하고 gtag을 호출하지 않는다', () => {
      jest.replaceProperty(process.env, 'NODE_ENV', 'development');

      trackEvent('sign_up', { method: 'kakao' });

      expect(consoleDebugSpy).toHaveBeenCalledWith('[analytics:dev] trackEvent', 'sign_up', { method: 'kakao' });
      expect(gtagMock).not.toHaveBeenCalled();
    });

    it('production 환경에서는 window.gtag을 event 커맨드로 호출한다', () => {
      jest.replaceProperty(process.env, 'NODE_ENV', 'production');

      trackEvent('join_gathering', { gathering_id: '42', category: '스터디' });

      expect(gtagMock).toHaveBeenCalledWith('event', 'join_gathering', { gathering_id: '42', category: '스터디' });
      expect(consoleDebugSpy).not.toHaveBeenCalled();
    });

    it('production 환경이라도 window.gtag이 미로드면 no-op (예외 없음)', () => {
      jest.replaceProperty(process.env, 'NODE_ENV', 'production');
      delete window.gtag;

      expect(() => trackEvent('login', { method: 'google' })).not.toThrow();
    });
  });

  describe('identifyUser', () => {
    it('dev 환경에서는 console.debug만 호출한다', () => {
      jest.replaceProperty(process.env, 'NODE_ENV', 'development');

      identifyUser('user-123');

      expect(consoleDebugSpy).toHaveBeenCalledWith('[analytics:dev] identifyUser', 'user-123');
      expect(gtagMock).not.toHaveBeenCalled();
    });

    it('production + NEXT_PUBLIC_GA_ID 모두 있으면 config 커맨드로 user_id를 전송한다', () => {
      jest.replaceProperty(process.env, 'NODE_ENV', 'production');
      process.env.NEXT_PUBLIC_GA_ID = 'G-TEST123';

      identifyUser('user-123');

      expect(gtagMock).toHaveBeenCalledWith('config', 'G-TEST123', { user_id: 'user-123' });
    });

    it('production이라도 NEXT_PUBLIC_GA_ID 미설정 시 no-op', () => {
      jest.replaceProperty(process.env, 'NODE_ENV', 'production');
      delete process.env.NEXT_PUBLIC_GA_ID;

      identifyUser('user-123');

      expect(gtagMock).not.toHaveBeenCalled();
    });
  });

  describe('setUserProperties', () => {
    it('dev 환경에서는 console.debug만 호출한다', () => {
      jest.replaceProperty(process.env, 'NODE_ENV', 'development');

      setUserProperties({ signup_date: '2026-05-19', auth_method: 'kakao' });

      expect(consoleDebugSpy).toHaveBeenCalledWith('[analytics:dev] setUserProperties', {
        signup_date: '2026-05-19',
        auth_method: 'kakao',
      });
      expect(gtagMock).not.toHaveBeenCalled();
    });

    it('production 환경에서는 set 커맨드로 user_properties를 전송한다', () => {
      jest.replaceProperty(process.env, 'NODE_ENV', 'production');

      setUserProperties({ signup_date: '2026-05-19', auth_method: 'google' });

      expect(gtagMock).toHaveBeenCalledWith('set', 'user_properties', {
        signup_date: '2026-05-19',
        auth_method: 'google',
      });
    });
  });
});
