import { createContext, useContext } from 'react';

interface DropdownContextType {
  isOpen: boolean;
  toggle: () => void;
  close: () => void;
}

export const DropdownContext = createContext<DropdownContextType | null>(null);

export const useDropdown = () => {
  const ctx = useContext(DropdownContext);
  if (!ctx) throw new Error('Dropdown 내부에서만 사용 가능');
  return ctx;
};
