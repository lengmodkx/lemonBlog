# 薰衣草紫清新风格博客重设计

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** 将博客重构为清新柔和风格，使用薰衣草紫（#8B5CF6）为主色调，单列居中布局，17px 正文字号，1.7 行高。

**Architecture:** 保持现有 Next.js 16 + Tailwind CSS v3 架构，更新配色系统、组件样式和页面布局。使用 CSS 变量管理主题颜色。

**Tech Stack:** Next.js 16, React 19, TypeScript, Tailwind CSS v3

---

## Task 1: 更新 Tailwind 配置与颜色系统

**Files:**
- Modify: `tailwind.config.ts`
- Modify: `src/app/globals.css`

**Step 1: 更新 tailwind.config.ts 添加薰衣草紫色调**

打开 `tailwind.config.ts`，替换 colors 部分：

```typescript
colors: {
  lavender: {
    50: '#F5F3FF',
    100: '#EDE9FE',
    200: '#DDD6FE',
    300: '#C4B5FD',
    400: '#A78BFA',
    500: '#8B5CF6',
    600: '#7C3AED',
    700: '#6D28D9',
    800: '#5B21B6',
    900: '#4C1D95',
  },
  paper: {
    50: '#F8F7FF',
    100: '#F0EFFA',
    200: '#E5E3F6',
  },
  ink: {
    DEFAULT: '#1F2937',
    light: '#4B5563',
    muted: '#9CA3AF',
  },
}
```

**Step 2: 更新 globals.css 添加 CSS 变量**

打开 `src/app/globals.css`，替换为：

```css
:root {
  --background: #F8F7FF;
  --card: #FFFFFF;
  --text-primary: #1F2937;
  --text-secondary: #4B5563;
  --text-muted: #9CA3AF;
  --primary: #8B5CF6;
  --primary-hover: #7C3AED;
}

.dark {
  --background: #1E1E2E;
  --card: #2A2A3C;
  --text-primary: #F3F4F6;
  --text-secondary: #D1D5DB;
  --text-muted: #6B7280;
  --primary: #A78BFA;
  --primary-hover: #8B5CF6;
}

@theme inline {
  --color-background: var(--background);
  --color-card: var(--card);
  --color-text-primary: var(--text-primary);
  --color-text-secondary: var(--text-secondary);
  --color-text-muted: var(--text-muted);
  --color-primary: var(--primary);
  --color-primary-hover: var(--primary-hover);
}
```

**Step 3: 验证构建**

```bash
cd D:\lemonArticle\lemonBlog
npm run build
```

预期: 构建成功

**Step 4: 提交**

```bash
git add tailwind.config.ts src/app/globals.css
git commit -m "style: update color system to lavender theme

- Add lavender purple color palette (#8B5CF6)
- Add paper background colors (#F8F7FF)
- Add CSS variables for theme management
- Light/dark mode color scheme"
```

---

## Task 2: 重构 ArticleCard 组件

**Files:**
- Modify: `src/components/ArticleCard.tsx`

**Step 1: 替换 ArticleCard 为新样式**

打开 `src/components/ArticleCard.tsx`，替换为：

```typescript
import Link from 'next/link';
import type { Post } from '@/types/post';

interface ArticleCardProps {
  post: Post;
}

export default function ArticleCard({ post }: ArticleCardProps) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group block bg-card rounded-xl p-6 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 hover:border-l-4 hover:border-lavender-500"
    >
      {post.tags && post.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-3">
          {post.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="text-xs px-2 py-1 rounded-full bg-lavender-100 dark:bg-lavender-900/30 text-primary dark:text-lavender-400"
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      <h3 className="text-xl font-semibold text-ink dark:text-text-primary mb-2 line-clamp-2 group-hover:text-primary dark:group-hover:text-primary transition-colors">
        {post.title}
      </h3>

      <p className="text-ink-light dark:text-text-secondary line-clamp-2 mb-4 text-sm">
        {post.description || post.excerpt || ''}
      </p>

      <div className="flex items-center gap-4 text-xs text-text-muted">
        <time dateTime={post.date}>
          {new Date(post.date).toLocaleDateString('zh-CN', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
          })}
        </time>
        <span>·</span>
        <span>{post.readingTime || 5} 分钟阅读</span>
      </div>
    </Link>
  );
}
```

**Step 2: 验证构建**

```bash
cd D:\lemonArticle\lemonBlog
npm run build
```

预期: 构建成功

**Step 3: 提交**

```bash
git add src/components/ArticleCard.tsx
git commit -m "refactor: update ArticleCard with lavender theme

- Add lavender color accents
- Add hover border effect on left side
- Update typography to match new design
- Improve spacing and transitions"
```

---

## Task 3: 重构首页

**Files:**
- Modify: `src/app/page.tsx`

**Step 1: 替换首页内容**

打开 `src/app/page.tsx`，替换为：

```typescript
import Link from 'next/link';
import { getLatestPosts } from '@/lib/posts';
import ArticleCard from '@/components/ArticleCard';

export const metadata = {
  title: 'Lemon Blog',
  description: 'Personal blog about web development, programming, and technology.',
};

export default function Home() {
  const latestPosts = getLatestPosts(6);

  return (
    <div className="min-h-screen bg-paper-50 dark:bg-ink-DEFAULT">
      {/* Hero Section */}
      <section className="max-w-2xl mx-auto px-4 py-20 text-center">
        <div className="mb-8">
          <div className="w-20 h-20 bg-gradient-to-br from-lavender-400 to-lavender-600 rounded-full mx-auto mb-6 flex items-center justify-center shadow-lg ring-4 ring-lavender-100 dark:ring-lavender-900/30">
            <span className="text-white font-bold text-3xl">L</span>
          </div>
          <h1 className="text-3xl font-bold text-ink dark:text-text-primary mb-3">
            Hello, World
          </h1>
          <p className="text-ink-light dark:text-text-secondary text-base max-w-md mx-auto">
            热爱编程，专注于 Web 开发与技术分享
          </p>
        </div>

        <div className="flex justify-center gap-6 text-sm">
          <Link href="/blog" className="text-text-muted hover:text-primary transition-colors">
            文章
          </Link>
          <Link href="/about" className="text-text-muted hover:text-primary transition-colors">
            关于
          </Link>
        </div>
      </section>

      {/* Latest Posts */}
      <section className="max-w-2xl mx-auto px-4 pb-20">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-xl font-semibold text-ink dark:text-text-primary">
            最新文章
          </h2>
          <Link
            href="/blog"
            className="text-sm text-primary hover:text-primary-hover transition-colors"
          >
            查看全部 →
          </Link>
        </div>

        {latestPosts.length > 0 ? (
          <div className="space-y-4">
            {latestPosts.map((post) => (
              <ArticleCard key={post.slug} post={post} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-text-muted">暂无文章</p>
          </div>
        )}
      </section>
    </div>
  );
}
```

**Step 2: 验证构建**

```bash
cd D:\lemonArticle\lemonBlog
npm run build
```

预期: 构建成功

**Step 3: 提交**

```bash
git add src/app/page.tsx
git commit -m "refactor: redesign homepage with lavender theme

- Single column layout with centered content
- Simplified hero section with circular avatar
- Clean post list with lavender accents
- Proper spacing and typography"
```

---

## Task 4: 重构 Navbar

**Files:**
- Modify: `src/components/Navbar.tsx`

**Step 1: 替换 Navbar 内容**

打开 `src/components/Navbar.tsx`，替换为：

```typescript
'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';

export default function Navbar() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const shouldBeDark = savedTheme === 'dark' || (!savedTheme && prefersDark);
    setIsDarkMode(shouldBeDark);
    document.documentElement.classList.toggle('dark', shouldBeDark);
  }, []);

  const toggleDarkMode = () => {
    const newDarkMode = !isDarkMode;
    setIsDarkMode(newDarkMode);
    localStorage.setItem('theme', newDarkMode ? 'dark' : 'light');
    document.documentElement.classList.toggle('dark', newDarkMode);
  };

  const navigation = [
    { name: '首页', href: '/' },
    { name: '博客', href: '/blog' },
    { name: '关于', href: '/about' },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-white/80 dark:bg-ink-DEFAULT/80 backdrop-blur-md border-b border-lavender-200/50 dark:border-lavender-800/50">
      <div className="max-w-2xl mx-auto px-4">
        <div className="flex justify-between items-center h-14">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-7 h-7 bg-gradient-to-br from-lavender-400 to-lavender-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">L</span>
            </div>
            <span className="text-base font-semibold text-ink dark:text-text-primary">
              Lemon Blog
            </span>
          </Link>

          {/* Navigation Links */}
          <div className="flex items-center space-x-6">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`text-sm font-medium transition-colors ${
                  pathname === item.href
                    ? 'text-primary'
                    : 'text-ink-light dark:text-text-secondary hover:text-primary'
                }`}
              >
                {item.name}
              </Link>
            ))}

            {/* Theme Toggle */}
            <button
              onClick={toggleDarkMode}
              className="p-1.5 rounded-lg text-text-muted hover:text-primary transition-colors"
              aria-label="Toggle dark mode"
            >
              {isDarkMode ? (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              ) : (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
```

**Step 2: 验证构建**

```bash
cd D:\lemonArticle\lemonBlog
npm run build
```

预期: 构建成功

**Step 3: 提交**

```bash
git add src/components/Navbar.tsx
git commit -m "refactor: simplify Navbar with lavender theme

- Lavender colored bottom border
- Smaller, cleaner navigation items
- Simplified theme toggle icon
- Glassmorphism background effect"
```

---

## Task 5: 重构文章详情页

**Files:**
- Modify: `src/app/blog/[slug]/page.tsx`
- Modify: `src/app/globals.css` (添加 prose 样式)

**Step 1: 更新 globals.css 中的 prose 样式**

在 `src/app/globals.css` 中添加/替换：

```css
/* Prose styles for article content */
.prose {
  font-size: 1.0625rem; /* 17px */
  line-height: 1.7;
}

.prose p {
  margin-bottom: 1.25em;
}

.prose h2 {
  margin-top: 2em;
  margin-bottom: 0.75em;
  font-weight: 600;
}

.prose h3 {
  margin-top: 1.5em;
  margin-bottom: 0.5em;
  font-weight: 600;
}

.prose a {
  color: var(--primary);
  text-decoration: none;
  border-bottom: 1px solid transparent;
  transition: border-color 0.2s;
}

.prose a:hover {
  border-bottom-color: var(--primary);
}

.prose code {
  color: var(--primary);
  background-color: var(--bg-paper-200, #E5E3F6);
  padding: 0.15em 0.4em;
  border-radius: 0.25rem;
  font-size: 0.875em;
}

.prose pre {
  background-color: #1E1E2E;
  padding: 1rem;
  border-radius: 0.75rem;
  overflow-x: auto;
}

.prose pre code {
  background-color: transparent;
  padding: 0;
  color: #E5E3F6;
}

.prose blockquote {
  border-left: 4px solid var(--primary);
  padding-left: 1em;
  color: var(--text-secondary);
  font-style: italic;
}

.prose img {
  border-radius: 0.75rem;
  box-shadow: 0 4px 12px rgba(139, 92, 246, 0.15);
}
```

**Step 2: 更新文章页面**

打开 `src/app/blog/[slug]/page.tsx`，替换为：

```typescript
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getPostBySlug, getAllPosts } from '@/lib/posts';

interface BlogPostPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateStaticParams() {
  const posts = getAllPosts();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({ params }: BlogPostPageProps) {
  const resolvedParams = await params;
  const post = await getPostBySlug(resolvedParams.slug);

  if (!post) return { title: 'Post not found' };

  return {
    title: post.title,
    description: post.description,
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const resolvedParams = await params;
  const post = await getPostBySlug(resolvedParams.slug);

  if (!post) notFound();

  return (
    <div className="min-h-screen bg-paper-50 dark:bg-ink-DEFAULT">
      <article className="max-w-2xl mx-auto px-4 py-12">
        {/* Back Link */}
        <Link
          href="/blog"
          className="inline-flex items-center text-sm text-text-muted hover:text-primary mb-8 transition-colors"
        >
          ← 返回
        </Link>

        {/* Article Header */}
        <header className="mb-10">
          <h1 className="text-3xl font-bold text-ink dark:text-text-primary mb-4 leading-tight">
            {post.title}
          </h1>

          <div className="flex flex-wrap items-center gap-3 text-sm text-text-muted">
            <time dateTime={post.date}>
              {new Date(post.date).toLocaleDateString('zh-CN', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </time>
            <span>·</span>
            <span>{post.readingTime || 5} 分钟</span>
            {post.tags && post.tags.length > 0 && (
              <>
                <span>·</span>
                <div className="flex gap-2">
                  {post.tags.map((tag) => (
                    <span key={tag} className="text-primary">
                      #{tag}
                    </span>
                  ))}
                </div>
              </>
            )}
          </div>
        </header>

        {/* Divider */}
        <div className="w-12 h-1 bg-gradient-to-r from-lavender-400 to-lavender-600 rounded-full mb-10" />

        {/* Article Content */}
        <div
          className="prose dark:prose-invert max-w-none"
          dangerouslySetInnerHTML={{ __html: post.content || '' }}
        />

        {/* Article Footer */}
        <footer className="mt-12 pt-8 border-t border-lavender-200 dark:border-lavender-800">
          <p className="text-text-muted text-sm text-center">
            感谢阅读
          </p>
        </footer>
      </article>
    </div>
  );
}
```

**Step 3: 验证构建**

```bash
cd D:\lemonArticle\lemonBlog
npm run build
```

预期: 构建成功

**Step 4: 提交**

```bash
git add src/app/blog/[slug]/page.tsx src/app/globals.css
git commit -m "refactor: update article page with lavender theme

- 17px font size with 1.7 line-height
- Lavender colored divider and accents
- Simplified header and footer
- Improved prose typography"
```

---

## Task 6: 重构博客列表页

**Files:**
- Modify: `src/app/blog/page.tsx`

**Step 1: 替换博客列表页**

打开 `src/app/blog/page.tsx`，替换为：

```typescript
import { getAllPosts } from '@/lib/posts';
import ArticleCard from '@/components/ArticleCard';

export const metadata = {
  title: '博客 | Lemon Blog',
  description: '所有文章',
};

export default function BlogPage() {
  const posts = getAllPosts();

  return (
    <div className="min-h-screen bg-paper-50 dark:bg-ink-DEFAULT">
      <div className="max-w-2xl mx-auto px-4 py-12">
        <h1 className="text-2xl font-bold text-ink dark:text-text-primary mb-8">
          所有文章
        </h1>

        {posts.length > 0 ? (
          <div className="space-y-4">
            {posts.map((post) => (
              <ArticleCard key={post.slug} post={post} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-text-muted">暂无文章</p>
          </div>
        )}
      </div>
    </div>
  );
}
```

**Step 2: 验证构建**

```bash
cd D:\lemonArticle\lemonBlog
npm run build
```

预期: 构建成功

**Step 3: 提交**

```bash
git add src/app/blog/page.tsx
git commit -m "refactor: update blog listing page

- Single column layout matching homepage
- Clean spacing and typography
- Consistent design with ArticleCard"
```

---

## Task 7: 重构关于页

**Files:**
- Modify: `src/app/about/page.tsx`

**Step 1: 替换关于页**

打开 `src/app/about/page.tsx`，替换为：

```typescript
export const metadata = {
  title: '关于 | Lemon Blog',
  description: '关于 Lemon 和这个博客',
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-paper-50 dark:bg-ink-DEFAULT">
      <div className="max-w-2xl mx-auto px-4 py-12">
        <h1 className="text-2xl font-bold text-ink dark:text-text-primary mb-8">
          关于
        </h1>

        <div className="prose dark:prose-invert max-w-none">
          <p className="text-ink-light dark:text-text-secondary mb-6">
            你好，我是 Lemon，一名热爱编程的软件工程师。
          </p>

          <h2 className="text-lg font-semibold text-ink dark:text-text-primary mb-3">
            关于我
          </h2>
          <p className="text-ink-light dark:text-text-secondary mb-6">
            我专注于 Web 开发，喜欢探索新技术，热衷于分享知识和经验。
          </p>

          <h2 className="text-lg font-semibold text-ink dark:text-text-primary mb-3">
            技术栈
          </h2>
          <div className="flex flex-wrap gap-2 mb-8">
            {['React', 'Next.js', 'TypeScript', 'Tailwind CSS'].map((tech) => (
              <span
                key={tech}
                className="px-3 py-1 rounded-full bg-lavender-100 dark:bg-lavender-900/30 text-primary dark:text-lavender-400 text-sm"
              >
                {tech}
              </span>
            ))}
          </div>

          <h2 className="text-lg font-semibold text-ink dark:text-text-primary mb-3">
            联系方式
          </h2>
          <ul className="text-ink-light dark:text-text-secondary space-y-2 text-sm">
            <li>Email: your-email@example.com</li>
            <li>GitHub: github.com/yourusername</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
```

**Step 2: 验证构建**

```bash
cd D:\lemonArticle\lemonBlog
npm run build
```

预期: 构建成功

**Step 3: 提交**

```bash
git add src/app/about/page.tsx
git commit -m "refactor: update about page with lavender theme

- Consistent styling with other pages
- Lavender colored tags
- Clean and minimal layout"
```

---

## Task 8: 重构 Footer

**Files:**
- Modify: `src/components/Footer.tsx`

**Step 1: 替换 Footer**

打开 `src/components/Footer.tsx`，替换为：

```typescript
export default function Footer() {
  return (
    <footer className="border-t border-lavender-200 dark:border-lavender-800 bg-white dark:bg-ink-DEFAULT">
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-sm text-text-muted">
            © {new Date().getFullYear()} Lemon Blog
          </p>
          <div className="flex gap-6 text-sm">
            <a
              href="https://github.com"
              className="text-text-muted hover:text-primary transition-colors"
            >
              GitHub
            </a>
            <a
              href="https://twitter.com"
              className="text-text-muted hover:text-primary transition-colors"
            >
              Twitter
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
```

**Step 2: 验证构建**

```bash
cd D:\lemonArticle\lemonBlog
npm run build
```

预期: 构建成功

**Step 3: 提交**

```bash
git add src/components/Footer.tsx
git commit -m "refactor: simplify Footer with lavender theme

- Lavender colored top border
- Minimal design with essential links
- Responsive layout"
```

---

## Task 9: 最终构建测试

**Files:**
- All modified files

**Step 1: 运行完整构建**

```bash
cd D:\lemonArticle\lemonBlog
npm run build
```

预期: 构建成功，所有页面正常生成

**Step 2: 检查构建输出**

确认以下页面都在输出中：
- `/`
- `/blog`
- `/about`
- `/blog/[slug]` (所有文章)

**Step 3: 最终提交**

```bash
git add .
git commit -m "style: complete lavender theme redesign

- Lavender purple as primary color (#8B5CF6)
- Clean paper background (#F8F7FF)
- Single column centered layout
- 17px font with 1.7 line-height
- All pages updated with consistent design"
```

---

## 测试清单

完成所有任务后，请验证：

- [ ] 首页单列布局正常显示
- [ ] 卡片 hover 效果正常（边框动画）
- [ ] 文章详情页排版舒适（17px，1.7行高）
- [ ] 深色模式切换正常
- [ ] 导航栏紫色边框显示
- [ ] 所有页面响应式正常
- [ ] 阅读时间显示正确
- [ ] 构建成功，无错误
- [ ] 移动端触摸友好

## 注意事项

1. **颜色变量**：确保使用新的 CSS 变量而不是硬编码
2. **深色模式**：每个组件都要测试深色模式
3. **响应式**：单列布局在移动端自动适配
4. **一致性**：所有页面使用相同的颜色和间距
