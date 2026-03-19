import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';

import { useOverlay } from './useOverlay';
import { OverlayProvider } from '@/providers/OverlayProvider';

function TestComponent() {
  const overlay = useOverlay();
  const [result, setResult] = useState('');

  const handleDelete = async () => {
    const isConfirmed = await overlay.open<boolean>(({ isOpen, close }) => (
      <div role='dialog' data-isopen={isOpen}>
        <h2>정말 삭제하시겠습니까?</h2>
        <button onClick={() => close(false)}>취소</button>
        <button onClick={() => close(true)}>삭제</button>
      </div>
    ));

    setResult(isConfirmed ? '삭제됨' : '취소됨');
  };

  return (
    <>
      <button onClick={handleDelete}>삭제 팝업 띄우기</button>
      <div data-testid='result'>{result}</div>
    </>
  );
}

describe('useOverlay (단일 모달 제어)', () => {
  it('모달을 열고 "삭제"를 누르면 true를 resolve 한다', async () => {
    render(
      <>
        <OverlayProvider />
        <TestComponent />
      </>,
    );

    const user = userEvent.setup();

    await user.click(screen.getByText('삭제 팝업 띄우기'));
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByText('정말 삭제하시겠습니까?')).toBeInTheDocument();

    await user.click(screen.getByText('삭제'));

    await waitFor(
      () => {
        expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
      },
      { timeout: 1000 },
    );

    expect(screen.getByTestId('result')).toHaveTextContent('삭제됨');
  });
});
