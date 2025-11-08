'use client';

import { ReactNode } from 'react';
import ThemeToggle from './ThemeToggle';

interface LayoutProps {
  children: ReactNode;
  showThemeToggle?: boolean;
}

export default function Layout({ children, showThemeToggle = true }: LayoutProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors duration-300">
      {showThemeToggle && <ThemeToggle />}
      <main className="container mx-auto px-4 py-8">
        {children}
      </main>
    </div>
  );
}

