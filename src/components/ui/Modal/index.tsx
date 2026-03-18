'use client';

import {
  createContext,
  useContext,
  useEffect,
  useId,
  useRef,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from 'react';
import { createPortal } from 'react-dom';

import { cn } from '@/lib/cn';

const MODAL_ROOT_ID = 'modal-root';

const getPortalContainer = (): HTMLElement => {
  const existing = document.getElementById(MODAL_ROOT_ID);
  if (existing) return existing;

  const created = document.createElement('div');
  created.id = MODAL_ROOT_ID;
  document.body.appendChild(created);
  return created;
};

interface ModalContextValue {
  titleId: string;
}

const ModalContext = createContext<ModalContextValue | null>(null);

const useModalContext = (): ModalContextValue => {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error('Modal 하위 컴포넌트는 <Modal> 내부에서 사용해야 합니다.');
  }
  return context;
};

const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

const useFocusTrap = (dialogRef: React.RefObject<HTMLDivElement | null>, isOpen: boolean) => {
  useEffect(() => {
    if (!isOpen || !dialogRef.current) return;

    const dialog = dialogRef.current;
    dialog.focus();

    const handleTabKey = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;

      const focusableElements = dialog.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR);
      if (focusableElements.length === 0) {
        e.preventDefault();
        return;
      }

      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      if (e.shiftKey) {
        if (document.activeElement === firstElement || document.activeElement === dialog) {
          e.preventDefault();
          lastElement.focus();
        }
      } else {
        if (document.activeElement === lastElement) {
          e.preventDefault();
          firstElement.focus();
        }
      }
    };

    dialog.addEventListener('keydown', handleTabKey);
    return () => {
      dialog.removeEventListener('keydown', handleTabKey);
    };
  }, [isOpen, dialogRef]);
};

interface ModalHeaderProps {
  children: ReactNode;
  className?: string;
}

function ModalHeader({ children, className }: ModalHeaderProps) {
  const { titleId } = useModalContext();

  return (
    <div id={titleId} className={cn('px-6 pt-6 pb-4', className)}>
      {children}
    </div>
  );
}

interface ModalBodyProps {
  children: ReactNode;
  className?: string;
}

function ModalBody({ children, className }: ModalBodyProps) {
  return <div className={cn('overflow-y-auto px-6 py-2', className)}>{children}</div>;
}

interface ModalFooterProps {
  children: ReactNode;
  className?: string;
}

function ModalFooter({ children, className }: ModalFooterProps) {
  return <div className={cn('px-6 pt-4 pb-6', className)}>{children}</div>;
}

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  className?: string;
}

function ModalBase({ isOpen, onClose, children, className }: ModalProps) {
  const titleId = useId();
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  useFocusTrap(dialogRef, isOpen);

  const isMounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );

  if (!isMounted || !isOpen) return null;

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return createPortal(
    <ModalContext.Provider value={{ titleId }}>
      <div
        className='fixed inset-0 z-50 flex items-center justify-center bg-black/50'
        onClick={handleOverlayClick}
        data-testid='modal-overlay'
      >
        <div
          ref={dialogRef}
          role='dialog'
          aria-modal='true'
          aria-labelledby={titleId}
          tabIndex={-1}
          className={cn(
            'mx-4 flex max-h-[90vh] w-full max-w-md flex-col rounded-lg bg-white shadow-lg outline-none',
            className,
          )}
        >
          {children}
        </div>
      </div>
    </ModalContext.Provider>,
    getPortalContainer(),
  );
}

export const Modal = Object.assign(ModalBase, {
  Header: ModalHeader,
  Body: ModalBody,
  Footer: ModalFooter,
});
