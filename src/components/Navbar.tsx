'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useSyncExternalStore } from 'react';
import { usePathname } from 'next/navigation';

// 用于避免 hydration 不匹配的订阅函数
const getServerSnapshot = () => false;
const getSnapshot = () => {
  if (typeof window === 'undefined') return false;
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme) return savedTheme === 'dark';
  return window.matchMedia('(prefers-color-scheme: dark)').matches;
};
const subscribe = (callback: () => void) => {
  if (typeof window === 'undefined') return () => {};
  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
  mediaQuery.addEventListener('change', callback);
  window.addEventListener('storage', callback);
  return () => {
    mediaQuery.removeEventListener('change', callback);
    window.removeEventListener('storage', callback);
  };
};

export default function Navbar() {
  const pathname = usePathname();
  const isDarkMode = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDarkMode);
  }, [isDarkMode]);

  const toggleDarkMode = () => {
    const newDarkMode = !isDarkMode;
    localStorage.setItem('theme', newDarkMode ? 'dark' : 'light');
    // 触发 storage 事件以更新 useSyncExternalStore
    window.dispatchEvent(new StorageEvent('storage', { key: 'theme' }));
  };

  const navigation = [
    { name: '首页', href: '/' },
    { name: '文章', href: '/blog' },
    { name: '关于', href: '/about' },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-paper dark:bg-paper border-b border-border">
      <div className="max-w-3xl mx-auto px-6">
        <div className="flex justify-between items-center h-14">
          {/* Avatar Logo */}
          <Link href="/" className="flex items-center">
            <div className="relative w-9 h-9">
              <Image
                src="/images/avatar.jpg"
                alt="lemon"
                fill
                className="rounded-sm object-cover"
              />
            </div>
          </Link>

          {/* Navigation Links and Theme Toggle */}
          <div className="flex items-center gap-6">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`text-sm tracking-wide transition-colors ${
                  pathname === item.href
                    ? 'text-ink font-medium'
                    : 'text-ink-light hover:text-ink'
                }`}
              >
                {item.name}
              </Link>
            ))}

            {/* Divider */}
            <div className="h-4 w-px bg-border" />

            {/* Theme Toggle */}
            <button
              onClick={toggleDarkMode}
              className="p-1.5 text-ink-light hover:text-ink transition-colors"
              aria-label="Toggle dark mode"
            >
              {isDarkMode ? (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              ) : (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
