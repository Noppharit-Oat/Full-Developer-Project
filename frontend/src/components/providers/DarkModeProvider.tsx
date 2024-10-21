// src/components/providers/DarkModeProvider.tsx

"use client";
import React, { useState, useEffect } from "react";
import { DarkModeContext } from "../../contexts/DarkModeContext";
import Navbar from "../layout/navbar";

export function DarkModeProvider({ children }: { children: React.ReactNode }) {
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
        <Navbar />
        {children}
      </div>
    </DarkModeContext.Provider>
  );
}
