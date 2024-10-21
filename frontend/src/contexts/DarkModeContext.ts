// src/contexts/DarkModeContext.ts

import { createContext } from "react";

interface DarkModeContextType {
  darkMode: boolean;
  setDarkMode: (darkMode: boolean) => void;
}

export const DarkModeContext = createContext<DarkModeContextType | undefined>(
  undefined
);
