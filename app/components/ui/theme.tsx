import React from 'react'

import { Sun, Moon } from 'lucide-react';

export default function ThemeToggle() {
  // Mantém tema no localStorage e aplica classe 'dark' no <html>
  const [isDark, setIsDark] = React.useState<boolean>(() => {
    if (typeof window === "undefined") return false;
    const saved = localStorage.getItem("theme");
    if (saved) return saved === "dark";
    // fallback: prefer-color-scheme
    return window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
  });

  React.useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      root.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [isDark]);

  return (
    <div
      onClick={() => setIsDark((s) => !s)}
      className="flex items-center gap-2 cursor-pointer"
      aria-label="Alternar tema"
    >
      <div className="relative w-10 h-5 sm:w-12 sm:h-6 rounded-full p-0.5 border border-border flex items-center">
        <div
          className={`absolute inset-0 rounded-full transition-colors ${isDark ? "bg-gray-700" : "bg-gray-200"}`}
        />
        <div
          className={`relative z-10 flex items-center justify-center w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-white shadow transform transition-transform ${
            isDark ? "translate-x-5 sm:translate-x-6" : "translate-x-0"
          }`}
        >
          {isDark ? <Moon className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-gray-700" /> : <Sun className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-yellow-500" />}
        </div>
      </div>
    </div>
  );
}

