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
      <div className="relative w-12 h-6 rounded-full p-0.5 border border-border flex items-center">
        <div
          className={`absolute inset-0 rounded-full transition-colors ${isDark ? "bg-gray-700" : "bg-gray-200"}`}
        />
        <div
          className={`relative z-10 flex items-center justify-center w-5 h-5 rounded-full bg-white shadow transform transition-transform ${
            isDark ? "translate-x-6" : "translate-x-0"
          }`}
        >
          {isDark ? <Moon className="w-3 h-3 text-gray-700" /> : <Sun className="w-3 h-3 text-yellow-500" />}
        </div>
      </div>
    </div>
  );
}

