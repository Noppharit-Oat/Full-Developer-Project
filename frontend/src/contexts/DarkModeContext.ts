// src/contexts/DarkModeContext.ts
import { createContext, useContext } from 'react';

interface DarkModeContextType {
  darkMode: boolean;
  setDarkMode: (darkMode: boolean) => void;
}

const DarkModeContext = createContext<DarkModeContextType | undefined>(undefined);

export function useDarkMode() {
  const context = useContext(DarkModeContext);
  if (context === undefined) {
    throw new Error('useDarkMode must be used within a DarkModeProvider');
  }
  return context;
}

export { DarkModeContext };