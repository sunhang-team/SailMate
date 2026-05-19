import { trackEvent } from './index';
import { resolveGatheringEntrySource, trackGatheringSearch, trackGatheringView } from './gathering';

jest.mock('./index', () => ({
  trackEvent: jest.fn(),
}));

describe('lib/analytics/gathering', () => {
  const trackEventMock = trackEvent as jest.Mock;

  beforeEach(() => {
    trackEventMock.mockClear();
  });

  describe('trackGatheringSearch', () => {
    it('query / result_count 와 함께 search 이벤트를 발사한다', () => {
      trackGatheringSearch({ query: '리액트', resultCount: 12 });

      expect(trackEventMock).toHaveBeenCalledWith('search', { query: '리액트', result_count: 12 });
    });

    it('category 가 있으면 같이 전송한다', () => {
      trackGatheringSearch({ query: '리액트', category: '1,3', resultCount: 5 });

      expect(trackEventMock).toHaveBeenCalledWith('search', {
        query: '리액트',
        category: '1,3',
        result_count: 5,
      });
    });

    it('category 가 빈 문자열이면 키를 누락시킨다 (값 없음)', () => {
      trackGatheringSearch({ query: '리액트', category: '', resultCount: 0 });

      expect(trackEventMock).toHaveBeenCalledWith('search', { query: '리액트', result_count: 0 });
    });
  });

  describe('trackGatheringView', () => {
    it('gathering_id / category / source 와 함께 view_gathering 이벤트를 발사한다', () => {
      trackGatheringView({ gatheringId: '42', category: '스터디', source: 'search' });

      expect(trackEventMock).toHaveBeenCalledWith('view_gathering', {
        gathering_id: '42',
        category: '스터디',
        source: 'search',
      });
    });
  });

  describe('resolveGatheringEntrySource', () => {
    it('명시적 source=search 를 그대로 사용한다', () => {
      const params = new URLSearchParams('source=search');
      expect(resolveGatheringEntrySource(params)).toBe('search');
    });

    it('source=recommendation 을 그대로 사용한다', () => {
      const params = new URLSearchParams('source=recommendation');
      expect(resolveGatheringEntrySource(params)).toBe('recommendation');
    });

    it('source=profile 을 그대로 사용한다', () => {
      const params = new URLSearchParams('source=profile');
      expect(resolveGatheringEntrySource(params)).toBe('profile');
    });

    it('허용되지 않은 source 값은 무시한다 (direct 로 fallback)', () => {
      const params = new URLSearchParams('source=hacker');
      expect(resolveGatheringEntrySource(params)).toBe('direct');
    });

    it('source 미설정 + utm_source 존재 시 shared_link 로 판정한다', () => {
      const params = new URLSearchParams('utm_source=instagram&utm_medium=social');
      expect(resolveGatheringEntrySource(params)).toBe('shared_link');
    });

    it('source 와 utm 모두 없으면 direct 로 판정한다', () => {
      const params = new URLSearchParams('');
      expect(resolveGatheringEntrySource(params)).toBe('direct');
    });

    it('source 가 우선이며, utm 과 함께 박혀 있어도 source 가 이긴다', () => {
      const params = new URLSearchParams('source=search&utm_source=instagram');
      expect(resolveGatheringEntrySource(params)).toBe('search');
    });
  });
});
