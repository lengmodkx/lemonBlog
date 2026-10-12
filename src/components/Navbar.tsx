'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { List, Moon, Sun, X } from '@phosphor-icons/react';
import { useIsDarkTheme } from '@/lib/use-theme';

export default function Navbar() {
  const pathname = usePathname();
  const isDarkMode = useIsDarkTheme();
  const [menuOpen, setMenuOpen] = useState(false);

  // 路由变化时收起移动端菜单（渲染期调整，无需 effect）
  const [prevPath, setPrevPath] = useState(pathname);
  if (prevPath !== pathname) {
    setPrevPath(pathname);
    setMenuOpen(false);
  }

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDarkMode);
  }, [isDarkMode]);

  const toggleDarkMode = () => {
    const newDarkMode = !isDarkMode;
    localStorage.setItem('theme', newDarkMode ? 'dark' : 'light');
    window.dispatchEvent(new StorageEvent('storage', { key: 'theme' }));
  };

  const navigation = [
    { name: 'Home', href: '/' },
    { name: 'Posts', href: '/blog' },
    { name: 'Projects', href: '/projects' },
    { name: 'Friends', href: '/friends' },
    { name: 'Travel', href: '/travel' },
    { name: 'Thoughts', href: '/thoughts' },
    { name: 'About', href: '/about' },
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

          {/* 桌面端：横排导航 */}
          <div className="hidden md:flex items-center gap-6">
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

          {/* 移动端：主题切换 + 汉堡菜单 */}
          <div className="flex md:hidden items-center gap-1">
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
            <button
              onClick={() => setMenuOpen((prev) => !prev)}
              className="p-2 text-muted-foreground hover:text-foreground transition-colors rounded-lg hover:bg-muted"
              aria-label={menuOpen ? '关闭菜单' : '打开菜单'}
              aria-expanded={menuOpen}
            >
              {menuOpen ? <X size={20} /> : <List size={20} />}
            </button>
          </div>
        </div>

        {/* 移动端下拉菜单 */}
        {menuOpen && (
          <div className="md:hidden pb-4 pt-1 grid grid-cols-2 gap-1">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setMenuOpen(false)}
                className={`rounded-lg px-3 py-2 text-sm transition-colors ${
                  pathname === item.href
                    ? 'bg-muted text-foreground font-medium'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                }`}
              >
                {item.name}
              </Link>
            ))}
          </div>
        )}
      </div>
    </nav>
  );
}
