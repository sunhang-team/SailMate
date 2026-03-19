import { fireEvent, render, screen } from '@testing-library/react';
import { Modal } from '.';

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

describe('Modal', () => {
  const onClose = jest.fn();

  beforeEach(() => {
    onClose.mockClear();
  });

  it('isOpen=true일 때 dialog를 렌더링한다', () => {
    render(
      <Modal isOpen={true} onClose={onClose}>
        <Modal.Body>내용</Modal.Body>
      </Modal>,
    );

    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByText('내용')).toBeInTheDocument();
  });

  it('isOpen=false일 때 렌더링하지 않는다', () => {
    render(
      <Modal isOpen={false} onClose={onClose}>
        <Modal.Body>내용</Modal.Body>
      </Modal>,
    );

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('ESC 키를 누르면 onClose가 호출된다', () => {
    render(
      <Modal isOpen={true} onClose={onClose}>
        <Modal.Body>내용</Modal.Body>
      </Modal>,
    );

    fireEvent.keyDown(document, { key: 'Escape' });
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('Overlay를 클릭하면 onClose가 호출된다', () => {
    render(
      <Modal isOpen={true} onClose={onClose}>
        <Modal.Body>내용</Modal.Body>
      </Modal>,
    );

    fireEvent.click(screen.getByTestId('modal-overlay'));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('모달 내부 콘텐츠를 클릭해도 onClose가 호출되지 않는다', () => {
    render(
      <Modal isOpen={true} onClose={onClose}>
        <Modal.Body>내용</Modal.Body>
      </Modal>,
    );

    fireEvent.click(screen.getByText('내용'));
    expect(onClose).not.toHaveBeenCalled();
  });

  it('Compound Component(Header, Body, Footer)가 올바르게 렌더링된다', () => {
    render(
      <Modal isOpen={true} onClose={onClose}>
        <Modal.Header>헤더</Modal.Header>
        <Modal.Body>본문</Modal.Body>
        <Modal.Footer>푸터</Modal.Footer>
      </Modal>,
    );

    expect(screen.getByText('헤더')).toBeInTheDocument();
    expect(screen.getByText('본문')).toBeInTheDocument();
    expect(screen.getByText('푸터')).toBeInTheDocument();
  });

  it('dialog에 접근성 속성이 존재한다', () => {
    render(
      <Modal isOpen={true} onClose={onClose}>
        <Modal.Body>내용</Modal.Body>
      </Modal>,
    );

    const dialog = screen.getByRole('dialog');
    expect(dialog).toHaveAttribute('aria-modal', 'true');
  });

  it('Header 사용 시 aria-labelledby가 Header의 id와 연결된다', () => {
    render(
      <Modal isOpen={true} onClose={onClose}>
        <Modal.Header>제목</Modal.Header>
        <Modal.Body>내용</Modal.Body>
      </Modal>,
    );

    const dialog = screen.getByRole('dialog');
    const labelledBy = dialog.getAttribute('aria-labelledby');
    expect(labelledBy).toBeTruthy();

    const header = document.getElementById(labelledBy!);
    expect(header).toBeInTheDocument();
    expect(header).toHaveTextContent('제목');
  });

  it('열릴 때 body overflow가 hidden으로 설정된다', () => {
    render(
      <Modal isOpen={true} onClose={onClose}>
        <Modal.Body>내용</Modal.Body>
      </Modal>,
    );

    expect(document.body.style.overflow).toBe('hidden');
  });

  it('열릴 때 dialog에 포커스가 이동한다', () => {
    render(
      <Modal isOpen={true} onClose={onClose}>
        <Modal.Body>내용</Modal.Body>
      </Modal>,
    );

    const dialog = screen.getByRole('dialog');
    expect(document.activeElement).toBe(dialog);
  });
});
