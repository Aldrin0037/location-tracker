'use client';

import { ReactNode } from 'react';
import ThemeToggle from './ThemeToggle';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '../hooks/useAuth';

interface LayoutProps {
  children: ReactNode;
  showThemeToggle?: boolean;
  showNavigation?: boolean;
}

export default function Layout({ children, showThemeToggle = true, showNavigation = false }: LayoutProps) {
  const pathname = usePathname();
  const { isAuthenticated } = useAuth();

  const navLinks = [
    { href: '/admin', label: '📊 Dashboard', icon: '📊' },
    { href: '/analytics', label: '📈 Analytics', icon: '📈' },
			{ href: '/admin/pages', label: '📝 Pages', icon: '📝' },
    { href: '/settings', label: '⚙️ Settings', icon: '⚙️' },
  ];

  const isActive = (path: string) => pathname === path;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors duration-300">
      {showThemeToggle && <ThemeToggle />}
      
      {/* Navigation Bar */}
      {showNavigation && isAuthenticated && (
        <nav className="bg-white dark:bg-gray-800 shadow-md border-b border-gray-200 dark:border-gray-700">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center space-x-1">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                      isActive(link.href)
                        ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-200'
                        : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Geolocation Tracker
              </div>
            </div>
          </div>
        </nav>
      )}

      <main className="container mx-auto px-4 py-8">
        {children}
      </main>
    </div>
  );
}

