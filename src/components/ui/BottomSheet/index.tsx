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

import { CloseIcon } from '@/components/ui/Icon';
import { OVERLAY_ANIMATION_DURATION } from '@/constants/overlay';
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

interface BottomSheetContextValue {
  titleId: string;
  onClose: () => void;
}

const BottomSheetContext = createContext<BottomSheetContextValue | null>(null);

const useBottomSheetContext = (): BottomSheetContextValue => {
  const context = useContext(BottomSheetContext);
  if (!context) {
    throw new Error('BottomSheet 하위 컴포넌트는 <BottomSheet> 내부에서 사용해야 합니다.');
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
      } else if (document.activeElement === lastElement) {
        e.preventDefault();
        firstElement.focus();
      }
    };

    dialog.addEventListener('keydown', handleTabKey);
    return () => {
      dialog.removeEventListener('keydown', handleTabKey);
    };
  }, [isOpen, dialogRef]);
};

interface BottomSheetHeaderProps {
  children: ReactNode;
  className?: string;
  showCloseButton?: boolean;
}

function BottomSheetHeader({ children, className, showCloseButton = true }: BottomSheetHeaderProps) {
  const { titleId, onClose } = useBottomSheetContext();
  return (
    <div id={titleId} className={cn('flex items-start justify-between gap-4 px-7 pt-8', className)}>
      <div className='min-w-0 flex-1'>{children}</div>
      {showCloseButton ? (
        <button
          type='button'
          aria-label='닫기'
          onClick={onClose}
          className='shrink-0 rounded p-1 text-gray-600 transition-colors'
        >
          <CloseIcon className='h-8 w-8 text-gray-600 md:h-12 md:w-12' />
        </button>
      ) : null}
    </div>
  );
}

interface BottomSheetBodyProps {
  children: ReactNode;
  className?: string;
}

function BottomSheetBody({ children, className }: BottomSheetBodyProps) {
  return <div className={cn('min-h-0 flex-1 gap-7 overflow-y-auto px-7 py-7', className)}>{children}</div>;
}

interface BottomSheetFooterProps {
  children: ReactNode;
  className?: string;
}

function BottomSheetFooter({ children, className }: BottomSheetFooterProps) {
  return <div className={cn('sticky bottom-0 z-10 h-[120px] shrink-0 bg-white px-7 py-6', className)}>{children}</div>;
}

interface BottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  className?: string;
  ariaLabel?: string;
}

function BottomSheetBase({ isOpen, onClose, children, className, ariaLabel }: BottomSheetProps) {
  const titleId = useId();
  const dialogRef = useRef<HTMLDivElement>(null);
  const [shouldRender, setShouldRender] = useState(isOpen);

  if (isOpen && !shouldRender) {
    setShouldRender(true);
  }

  useEffect(() => {
    if (!isOpen && shouldRender) {
      const timer = setTimeout(() => {
        setShouldRender(false);
      }, OVERLAY_ANIMATION_DURATION);
      return () => clearTimeout(timer);
    }
  }, [isOpen, shouldRender]);

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

  if (!isMounted || !shouldRender) return null;

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return createPortal(
    <BottomSheetContext.Provider value={{ titleId, onClose }}>
      <div
        className={cn(
          'fixed inset-0 z-50 flex items-end justify-center bg-black/50',
          isOpen ? 'animate-modal-fade-in' : 'animate-modal-fade-out pointer-events-none',
        )}
        onClick={handleOverlayClick}
        data-testid='bottom-sheet-overlay'
      >
        <div
          ref={dialogRef}
          role='dialog'
          aria-modal='true'
          aria-labelledby={titleId}
          aria-label={ariaLabel}
          tabIndex={-1}
          className={cn(
            'mx-auto flex max-h-[90vh] w-full flex-col rounded-t-2xl bg-white shadow-xl outline-none',
            isOpen ? 'animate-sheet-slide-up-in' : 'animate-sheet-slide-down-out',
            className,
          )}
        >
          {children}
        </div>
      </div>
    </BottomSheetContext.Provider>,
    getPortalContainer(),
  );
}

export const BottomSheet = Object.assign(BottomSheetBase, {
  Header: BottomSheetHeader,
  Body: BottomSheetBody,
  Footer: BottomSheetFooter,
});
