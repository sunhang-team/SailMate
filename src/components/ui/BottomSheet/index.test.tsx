import { fireEvent, render, screen } from '@testing-library/react';

import { BottomSheet } from '.';

beforeEach(() => {
  const modalRoot = document.createElement('div');
  modalRoot.id = 'modal-root';
  document.body.appendChild(modalRoot);
});

afterEach(() => {
  const modalRoot = document.getElementById('modal-root');
  if (modalRoot) {
    document.body.removeChild(modalRoot);
  }
  document.body.style.overflow = '';
});

describe('BottomSheet', () => {
  const onClose = jest.fn();

  beforeEach(() => {
    onClose.mockClear();
  });

  it('isOpen=true일 때 dialog를 렌더링한다', () => {
    render(
      <BottomSheet isOpen={true} onClose={onClose}>
        <BottomSheet.Body>내용</BottomSheet.Body>
      </BottomSheet>,
    );

    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByText('내용')).toBeInTheDocument();
  });

  it('isOpen=false일 때 렌더링하지 않는다', () => {
    render(
      <BottomSheet isOpen={false} onClose={onClose}>
        <BottomSheet.Body>내용</BottomSheet.Body>
      </BottomSheet>,
    );

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('ESC 키를 누르면 onClose가 호출된다', () => {
    render(
      <BottomSheet isOpen={true} onClose={onClose}>
        <BottomSheet.Body>내용</BottomSheet.Body>
      </BottomSheet>,
    );

    fireEvent.keyDown(document, { key: 'Escape' });
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('Overlay를 클릭하면 onClose가 호출된다', () => {
    render(
      <BottomSheet isOpen={true} onClose={onClose}>
        <BottomSheet.Body>내용</BottomSheet.Body>
      </BottomSheet>,
    );

    fireEvent.click(screen.getByTestId('bottom-sheet-overlay'));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('바텀시트 내부 콘텐츠를 클릭해도 onClose가 호출되지 않는다', () => {
    render(
      <BottomSheet isOpen={true} onClose={onClose}>
        <BottomSheet.Body>내용</BottomSheet.Body>
      </BottomSheet>,
    );

    fireEvent.click(screen.getByText('내용'));
    expect(onClose).not.toHaveBeenCalled();
  });

  it('Compound Component(Header, Body, Footer)가 올바르게 렌더링된다', () => {
    render(
      <BottomSheet isOpen={true} onClose={onClose}>
        <BottomSheet.Header>헤더</BottomSheet.Header>
        <BottomSheet.Body>본문</BottomSheet.Body>
        <BottomSheet.Footer>푸터</BottomSheet.Footer>
      </BottomSheet>,
    );

    expect(screen.getByText('헤더')).toBeInTheDocument();
    expect(screen.getByText('본문')).toBeInTheDocument();
    expect(screen.getByText('푸터')).toBeInTheDocument();
  });

  it('dialog에 접근성 속성이 존재한다', () => {
    render(
      <BottomSheet isOpen={true} onClose={onClose}>
        <BottomSheet.Body>내용</BottomSheet.Body>
      </BottomSheet>,
    );

    const dialog = screen.getByRole('dialog');
    expect(dialog).toHaveAttribute('aria-modal', 'true');
  });

  it('Header 사용 시 aria-labelledby가 Header의 id와 연결된다', () => {
    render(
      <BottomSheet isOpen={true} onClose={onClose}>
        <BottomSheet.Header>제목</BottomSheet.Header>
        <BottomSheet.Body>내용</BottomSheet.Body>
      </BottomSheet>,
    );

    const dialog = screen.getByRole('dialog');
    const labelledBy = dialog.getAttribute('aria-labelledby');
    expect(labelledBy).toBeTruthy();

    const header = document.getElementById(labelledBy!);
    expect(header).toBeInTheDocument();
    expect(header).toHaveTextContent('제목');
  });

  it('Header 닫기 버튼 클릭 시 onClose가 호출된다', () => {
    render(
      <BottomSheet isOpen={true} onClose={onClose}>
        <BottomSheet.Header>제목</BottomSheet.Header>
        <BottomSheet.Body>내용</BottomSheet.Body>
      </BottomSheet>,
    );

    fireEvent.click(screen.getByRole('button', { name: '닫기' }));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('Header가 없으면 aria-label을 사용할 수 있다', () => {
    render(
      <BottomSheet isOpen={true} onClose={onClose} ariaLabel='설정 시트'>
        <BottomSheet.Body>내용</BottomSheet.Body>
      </BottomSheet>,
    );

    expect(screen.getByRole('dialog')).toHaveAttribute('aria-label', '설정 시트');
  });

  it('열릴 때 body overflow가 hidden으로 설정된다', () => {
    render(
      <BottomSheet isOpen={true} onClose={onClose}>
        <BottomSheet.Body>내용</BottomSheet.Body>
      </BottomSheet>,
    );

    expect(document.body.style.overflow).toBe('hidden');
  });

  it('열릴 때 dialog에 포커스가 이동한다', () => {
    render(
      <BottomSheet isOpen={true} onClose={onClose}>
        <BottomSheet.Body>
          <button>버튼</button>
        </BottomSheet.Body>
      </BottomSheet>,
    );

    const dialog = screen.getByRole('dialog');
    expect(document.activeElement).toBe(dialog);
  });

  it('Footer 기본 스타일(sticky, 패딩, 높이)을 적용한다', () => {
    render(
      <BottomSheet isOpen={true} onClose={onClose}>
        <BottomSheet.Body>내용</BottomSheet.Body>
        <BottomSheet.Footer>푸터</BottomSheet.Footer>
      </BottomSheet>,
    );

    const footer = screen.getByText('푸터');
    expect(footer).toHaveClass('sticky', 'h-[120px]', 'px-7', 'py-6');
  });
});
