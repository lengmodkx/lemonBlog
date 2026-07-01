'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useSyncExternalStore } from 'react';
import { usePathname } from 'next/navigation';
import { Sun, Moon } from '@phosphor-icons/react';

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
    window.dispatchEvent(new StorageEvent('storage', { key: 'theme' }));
  };

  const navigation = [
    { name: '首页', href: '/' },
    { name: '文章', href: '/blog' },
    { name: '关于', href: '/about' },
  ];

  return (
    <nav className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-md">
      <div className="max-w-5xl mx-auto px-6">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative w-9 h-9 rounded-full overflow-hidden ring-1 ring-border group-hover:ring-accent transition-colors">
              <Image
                src="/images/avatar.jpg"
                alt="lemon"
                fill
                sizes="36px"
                className="object-cover"
              />
            </div>
            <span className="font-semibold text-foreground tracking-tight">Lemon</span>
          </Link>

          <div className="flex items-center gap-6">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`text-sm transition-colors ${
                  pathname === item.href
                    ? 'text-foreground font-medium'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {item.name}
              </Link>
            ))}

            <div className="h-4 w-px bg-border" />

            <button
              onClick={toggleDarkMode}
              className="p-2 text-muted-foreground hover:text-foreground transition-colors rounded-lg hover:bg-muted"
              aria-label="Toggle dark mode"
            >
              {isDarkMode ? (
                <Sun size={18} weight="regular" />
              ) : (
                <Moon size={18} weight="regular" />
              )}
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
