// src/components/providers/DarkModeProvider.tsx
"use client";

import React, { useState, useEffect } from "react";
import { DarkModeContext } from "@/contexts/DarkModeContext";

interface DarkModeProviderProps {
  children: React.ReactNode;
}

export function DarkModeProvider({ children }: DarkModeProviderProps) {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  return (
    <DarkModeContext.Provider value={{ darkMode, setDarkMode }}>
      <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
        {children}
      </div>
    </DarkModeContext.Provider>
  );
}