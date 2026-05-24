import { render, screen } from '@testing-library/react';

import { EmptyState } from '.';

describe('EmptyState', () => {
  describe('렌더링', () => {
    it('title을 렌더링한다', () => {
      render(<EmptyState title='모임이 없어요' />);

      expect(screen.getByText('모임이 없어요')).toBeInTheDocument();
    });

    it('emoji가 있으면 렌더링한다', () => {
      render(<EmptyState emoji='🔥' title='모임이 없어요' />);

      expect(screen.getByText('🔥')).toBeInTheDocument();
    });

    it('emoji가 없으면 렌더링하지 않는다', () => {
      render(<EmptyState title='모임이 없어요' />);

      expect(screen.queryByText('🔥')).not.toBeInTheDocument();
    });

    it('description이 있으면 렌더링한다', () => {
      render(<EmptyState title='모임이 없어요' description='새로 만들어 보세요' />);

      expect(screen.getByText('새로 만들어 보세요')).toBeInTheDocument();
    });

    it('description이 없으면 렌더링하지 않는다', () => {
      render(<EmptyState title='모임이 없어요' />);

      expect(screen.queryByText('새로 만들어 보세요')).not.toBeInTheDocument();
    });
  });

  describe('action', () => {
    it('action이 있으면 label과 href가 링크로 렌더링된다', () => {
      render(<EmptyState title='모임이 없어요' action={{ label: '모임 만들기', href: '/gatherings/new' }} />);

      const link = screen.getByRole('link', { name: '모임 만들기' });
      expect(link).toBeInTheDocument();
      expect(link).toHaveAttribute('href', '/gatherings/new');
    });

    it('action이 없으면 링크를 렌더링하지 않는다', () => {
      render(<EmptyState title='모임이 없어요' />);

      expect(screen.queryByRole('link')).not.toBeInTheDocument();
    });
  });
});
