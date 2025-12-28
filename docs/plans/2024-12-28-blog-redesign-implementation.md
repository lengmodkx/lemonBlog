# 极简博客重设计实施计划

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** 将现有博客重构为 Medium 风格的极简阅读体验，采用温暖纸张色调和宽松舒适的排版。

**Architecture:** 保持现有 Next.js 16 + Tailwind CSS v3 架构，通过更新配置、重构组件和修改页面来实现新设计。使用 CSS 变量管理主题，确保深色模式和无障碍访问。

**Tech Stack:** Next.js 16, React 19, TypeScript, Tailwind CSS v3, gray-matter, remark/rehype

---

## Task 1: 更新 Tailwind 配置与主题变量

**Files:**
- Modify: `tailwind.config.ts`
- Modify: `src/app/globals.css`

**Step 1: 更新 tailwind.config.ts 添加自定义颜色**

打开 `tailwind.config.ts`，在 `theme.extend` 中添加新的颜色系统：

```typescript
colors: {
  paper: {
    50: '#FAF9F6',
    100: '#F5F3F0',
    200: '#ECE9E4',
  },
  ink: {
    DEFAULT: '#1A1A1A',
    light: '#2D2D2D',
    muted: '#6B7280',
  },
  accent: {
    DEFAULT: '#F59E0B',
    hover: '#D97706',
    dark: '#FBBF24',
    darkHover: '#F59E0B',
  },
}
```

**Step 2: 更新 globals.css 添加 CSS 变量**

打开 `src/app/globals.css`，在 `:root` 中添加：

```css
:root {
  --bg-paper: #FAF9F6;
  --bg-card: #FFFFFF;
  --text-primary: #1A1A1A;
  --text-secondary: #2D2D2D;
  --text-muted: #6B7280;
  --accent-primary: #F59E0B;
  --accent-hover: #D97706;
}

.dark {
  --bg-paper: #1A1A1A;
  --bg-card: #242424;
  --text-primary: #FAF9F6;
  --text-secondary: #E0E0E0;
  --text-muted: #9CA3AF;
  --accent-primary: #FBBF24;
  --accent-hover: #F59E0B;
}
```

**Step 3: 验证配置**

运行: `cd D:\lemonArticle\lemonBlog && npm run build`
预期: 构建成功，无错误

**Step 4: 提交**

```bash
git add tailwind.config.ts src/app/globals.css
git commit -m "style: add custom color system for minimalist design
- Add paper/ink/accent color palette
- Add CSS variables for theme management
- Support for warm paper color scheme"
```

---

## Task 2: 创建新的 ArticleCard 组件

**Files:**
- Create: `src/components/ArticleCard.tsx`
- Modify: `src/lib/posts.ts` (添加阅读时间计算)

**Step 1: 在 posts.ts 中添加阅读时间计算函数**

打开 `src/lib/posts.ts`，添加：

```typescript
export function getReadingTime(content: string): number {
  const wordsPerMinute = 200; // 中文阅读速度
  const wordCount = content.length;
  return Math.ceil(wordCount / wordsPerMinute);
}

// 更新 getPostBySlug 函数，添加 readingTime 字段
export function getPostBySlug(slug: string) {
  // ... 现有代码 ...
  return {
    // ... 现有字段 ...
    readingTime: getReadingTime(content),
  };
}
```

**Step 2: 创建新的 ArticleCard 组件**

创建 `src/components/ArticleCard.tsx`：

```typescript
import Link from 'next/link';

interface ArticleCardProps {
  title: string;
  slug: string;
  description: string;
  date: string;
  readingTime: number;
  tags?: string[];
}

export default function ArticleCard({
  title,
  slug,
  description,
  date,
  readingTime,
  tags = [],
}: ArticleCardProps) {
  return (
    <Link
      href={`/blog/${slug}`}
      className="group block bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm hover:shadow-lg transition-all duration-200 hover:-translate-y-1"
    >
      {tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-3">
          {tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="text-xs px-2 py-1 rounded-full bg-paper-100 dark:bg-gray-700 text-accent dark:text-accent-dark"
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      <h3 className="text-xl font-semibold text-ink dark:text-text-primary mb-2 line-clamp-2 group-hover:text-accent dark:group-hover:text-accent-dark transition-colors">
        {title}
      </h3>

      <p className="text-ink-light dark:text-text-secondary line-clamp-3 mb-4">
        {description}
      </p>

      <div className="flex items-center gap-4 text-sm text-muted">
        <time dateTime={date}>
          {new Date(date).toLocaleDateString('zh-CN', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}
        </time>
        <span>·</span>
        <span>{readingTime} 分钟阅读</span>
      </div>
    </Link>
  );
}
```

**Step 3: 更新 posts.ts 导出类型**

在 `src/lib/posts.ts` 中确保 Post 类型包含 readingTime：

```typescript
export interface Post {
  slug: string;
  title: string;
  description: string;
  date: string;
  tags: string[];
  content: string;
  readingTime: number; // 添加此字段
}
```

**Step 4: 验证构建**

运行: `cd D:\lemonArticle\lemonBlog && npm run build`
预期: 构建成功

**Step 5: 提交**

```bash
git add src/lib/posts.ts src/components/ArticleCard.tsx
git commit -m "feat: create new ArticleCard component
- Add card-based layout with hover effects
- Add reading time calculation
- Support tag display with line clamping"
```

---

## Task 3: 重构首页为网格布局

**Files:**
- Modify: `src/app/page.tsx`

**Step 1: 替换首页内容**

打开 `src/app/page.tsx`，完全替换为：

```typescript
import Link from 'next/link';
import { getLatestPosts } from '@/lib/posts';
import ArticleCard from '@/components/ArticleCard';

export const metadata = {
  title: 'Lemon Blog',
  description: 'Personal blog about web development, programming, and technology.',
};

export default function Home() {
  const latestPosts = getLatestPosts(9); // 获取最多9篇文章

  return (
    <div className="min-h-screen bg-paper-50 dark:bg-ink-DEFAULT">
      {/* Hero Section */}
      <section className="max-w-4xl mx-auto px-4 py-20 text-center">
        <div className="mb-8">
          <div className="w-24 h-24 bg-gradient-to-br from-accent to-accent-hover rounded-full mx-auto mb-6 flex items-center justify-center shadow-lg">
            <span className="text-white font-bold text-4xl">L</span>
          </div>
          <h1 className="text-4xl font-bold text-ink dark:text-text-primary mb-4">
            你好，我是 Lemon
          </h1>
          <p className="text-lg text-ink-light dark:text-text-secondary max-w-2xl mx-auto">
            热爱编程，专注于 Web 开发与技术分享
          </p>
        </div>

        <div className="flex justify-center gap-6 text-sm text-muted">
          <Link href="/blog" className="hover:text-accent dark:hover:text-accent-dark transition-colors">
            文章
          </Link>
          <Link href="/about" className="hover:text-accent dark:hover:text-accent-dark transition-colors">
            关于
          </Link>
        </div>
      </section>

      {/* Latest Posts Grid */}
      <section className="max-w-6xl mx-auto px-4 pb-20">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold text-ink dark:text-text-primary">
            最新文章
          </h2>
          <Link
            href="/blog"
            className="text-accent dark:text-accent-dark hover:text-accent-hover dark:hover:text-accent-darkHover text-sm font-medium"
          >
            查看全部 →
          </Link>
        </div>

        {latestPosts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {latestPosts.map((post) => (
              <ArticleCard key={post.slug} post={post} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="text-muted text-lg">暂无文章</p>
          </div>
        )}
      </section>
    </div>
  );
}
```

**Step 2: 验证页面渲染**

运行: `cd D:\lemonArticle\lemonBlog && npm run dev`
访问: http://localhost:3000
预期: 看到新的网格布局首页

**Step 3: 测试响应式**

- 桌面宽度：3列网格
- 平板宽度（768px）：2列网格
- 移动宽度（<640px）：1列

**Step 4: 提交**

```bash
git add src/app/page.tsx
git commit -m "feat: redesign homepage with grid layout
- Replace list with responsive card grid
- Simplify hero section
- Add proper spacing for paper background"
```

---

## Task 4: 创建简化的 Navbar 组件

**Files:**
- Modify: `src/components/Navbar.tsx`

**Step 1: 替换 Navbar 内容**

打开 `src/components/Navbar.tsx`，替换为简化版本：

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
    <nav className="sticky top-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-100 dark:border-gray-800">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-accent to-accent-hover rounded-lg flex items-center justify-center">
              <span className="text-white font-bold">L</span>
            </div>
            <span className="text-lg font-semibold text-ink dark:text-text-primary">
              Lemon Blog
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`text-sm font-medium transition-colors relative ${
                  pathname === item.href
                    ? 'text-accent dark:text-accent-dark'
                    : 'text-ink-light dark:text-text-secondary hover:text-accent dark:hover:text-accent-dark'
                }`}
              >
                {item.name}
                {pathname === item.href && (
                  <span className="absolute bottom-[-20px] left-0 right-0 h-0.5 bg-accent dark:bg-accent-dark" />
                )}
              </Link>
            ))}

            {/* Dark Mode Toggle */}
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-lg text-muted hover:text-accent dark:hover:text-accent-dark transition-colors"
              aria-label="Toggle dark mode"
            >
              {isDarkMode ? '☀️' : '🌙'}
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
```

**Step 2: 测试导航功能**

- 点击各个链接，确认高亮状态
- 切换深色模式，确认动画
- 测试 sticky 定位

**Step 3: 提交**

```bash
git add src/components/Navbar.tsx
git commit -m "refactor: simplify Navbar component
- Use backdrop blur for modern glass effect
- Simplified logo and navigation
- Add active state indicator"
```

---

## Task 5: 优化文章详情页排版

**Files:**
- Modify: `src/app/blog/[slug]/page.tsx`

**Step 1: 更新文章页面样式**

打开 `src/app/blog/[slug]/page.tsx`，更新为宽松舒适的排版：

```typescript
import { getPostBySlug, getAllPosts } from '@/lib/posts';
import { notFound } from 'next/navigation';
import Link from 'next/link';

export async function generateStaticParams() {
  const posts = getAllPosts();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const post = getPostBySlug(params.slug);
  if (!post) return {};

  return {
    title: post.title,
    description: post.description,
  };
}

export default function BlogPost({ params }: { params: { slug: string } }) {
  const post = getPostBySlug(params.slug);

  if (!post) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-paper-50 dark:bg-ink-DEFAULT">
      <article className="max-w-3xl mx-auto px-4 py-12">
        {/* Back Link */}
        <Link
          href="/blog"
          className="inline-flex items-center text-sm text-muted hover:text-accent dark:hover:text-accent-dark mb-8 transition-colors"
        >
          ← 返回博客
        </Link>

        {/* Article Header */}
        <header className="mb-12">
          <h1 className="text-5xl font-bold text-ink dark:text-text-primary mb-6 leading-tight">
            {post.title}
          </h1>

          <div className="flex flex-wrap items-center gap-4 text-sm text-muted">
            <time dateTime={post.date}>
              {new Date(post.date).toLocaleDateString('zh-CN', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </time>
            <span>·</span>
            <span>{post.readingTime} 分钟阅读</span>
            {post.tags.length > 0 && (
              <>
                <span>·</span>
                <div className="flex gap-2">
                  {post.tags.map((tag) => (
                    <span key={tag} className="text-accent dark:text-accent-dark">
                      #{tag}
                    </span>
                  ))}
                </div>
              </>
            )}
          </div>
        </header>

        {/* Article Content */}
        <div
          className="prose prose-lg dark:prose-invert max-w-none
            prose-headings:text-ink dark:prose-headings:text-text-primary
            prose-p:text-ink-light dark:prose-p:text-text-secondary
            prose-p:leading-relaxed
            prose-a:text-accent dark:prose-a:text-accent-dark
            prose-strong:text-ink dark:prose-strong:text-text-primary
            prose-code:text-accent dark:prose-code:text-accent-dark
            prose-pre:bg-paper-100 dark:prose-pre:bg-gray-900
            prose-img:rounded-lg"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        {/* Article Footer */}
        <footer className="mt-16 pt-8 border-t border-gray-200 dark:border-gray-700">
          <p className="text-muted text-sm">
            感谢阅读！如有问题或建议，欢迎留言讨论。
          </p>
        </footer>
      </article>
    </div>
  );
}
```

**Step 2: 更新 globals.css 中的 prose 样式**

在 `src/app/globals.css` 中添加：

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

/* 自定义 prose 样式 */
.prose {
  font-size: 1.125rem; /* 18px */
  line-height: 1.8;
}

.prose p {
  margin-bottom: 1.5em;
}

.prose h2 {
  margin-top: 2.5em;
  margin-bottom: 1em;
}

.prose h3 {
  margin-top: 2em;
  margin-bottom: 0.75em;
}

.prose code {
  font-size: 0.875em;
  padding: 0.2em 0.4em;
  border-radius: 0.25rem;
  background-color: var(--bg-paper-200);
}

.prose pre {
  padding: 1rem;
  border-radius: 0.5rem;
  overflow-x: auto;
}

.prose img {
  margin: 2em auto;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}
```

**Step 3: 测试文章页面**

访问任意文章详情页
检查：标题大小、行距、代码块样式

**Step 4: 提交**

```bash
git add src/app/blog/[slug]/page.tsx src/app/globals.css
git commit -m "feat: optimize article page typography
- Increase font size to 18px with 1.8 line-height
- Add better spacing for headings and paragraphs
- Improve code block styling"
```

---

## Task 6: 创建关于页面

**Files:**
- Create: `src/app/about/page.tsx`

**Step 1: 创建关于页面**

创建 `src/app/about/page.tsx`：

```typescript
export const metadata = {
  title: '关于 | Lemon Blog',
  description: '关于 Lemon 和这个博客',
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-paper-50 dark:bg-ink-DEFAULT">
      <div className="max-w-3xl mx-auto px-4 py-20">
        <h1 className="text-4xl font-bold text-ink dark:text-text-primary mb-8">
          关于
        </h1>

        <div className="prose prose-lg dark:prose-invert max-w-none">
          <p className="text-xl text-ink-light dark:text-text-secondary mb-8">
            你好，我是 Lemon，一名热爱编程的软件工程师。
          </p>

          <h2 className="text-2xl font-semibold text-ink dark:text-text-primary mb-4">
            关于我
          </h2>
          <p className="text-ink-light dark:text-text-secondary mb-6">
            我专注于 Web 开发，喜欢探索新技术，热衷于分享知识和经验。
            这个博客是我记录学习心得、技术总结和项目实践的地方。
          </p>

          <h2 className="text-2xl font-semibold text-ink dark:text-text-primary mb-4">
            技术栈
          </h2>
          <div className="flex flex-wrap gap-2 mb-8">
            {['React', 'Next.js', 'TypeScript', 'Tailwind CSS', 'Node.js', 'MySQL'].map((tech) => (
              <span
                key={tech}
                className="px-3 py-1 rounded-full bg-white dark:bg-gray-800 text-accent dark:text-accent-dark shadow-sm"
              >
                {tech}
              </span>
            ))}
          </div>

          <h2 className="text-2xl font-semibold text-ink dark:text-text-primary mb-4">
            联系方式
          </h2>
          <p className="text-ink-light dark:text-text-secondary">
            欢迎通过以下方式与我交流：
          </p>
          <ul className="list-disc list-inside text-ink-light dark:text-text-secondary mt-4 space-y-2">
            <li>Email: your-email@example.com</li>
            <li>GitHub: github.com/yourusername</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
```

**Step 2: 测试页面**

访问: http://localhost:3000/about
预期: 看到关于页面正常显示

**Step 3: 提交**

```bash
git add src/app/about/page.tsx
git commit -m "feat: create about page
- Add personal introduction
- Display tech stack as tags
- Include contact information"
```

---

## Task 7: 创建博客列表页面

**Files:**
- Create: `src/app/blog/page.tsx`

**Step 1: 创建博客列表页**

创建 `src/app/blog/page.tsx`：

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
      <div className="max-w-6xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-ink dark:text-text-primary mb-8">
          所有文章
        </h1>

        {posts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post) => (
              <ArticleCard key={post.slug} post={post} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="text-muted text-lg">暂无文章</p>
          </div>
        )}
      </div>
    </div>
  );
}
```

**Step 2: 测试页面**

访问: http://localhost:3000/blog
预期: 看到所有文章的网格布局

**Step 3: 提交**

```bash
git add src/app/blog/page.tsx
git commit -m "feat: create blog listing page
- Display all posts in responsive grid
- Consistent design with homepage"
```

---

## Task 8: 更新 Footer 组件

**Files:**
- Modify: `src/components/Footer.tsx`

**Step 1: 简化 Footer**

打开 `src/components/Footer.tsx`，替换为极简版本：

```typescript
export default function Footer() {
  return (
    <footer className="border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted">
            © {new Date().getFullYear()} Lemon Blog. All rights reserved.
          </p>
          <div className="flex gap-6 text-sm text-muted">
            <a href="https://github.com" className="hover:text-accent dark:hover:text-accent-dark transition-colors">
              GitHub
            </a>
            <a href="https://twitter.com" className="hover:text-accent dark:hover:text-accent-dark transition-colors">
              Twitter
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
```

**Step 2: 提交**

```bash
git add src/components/Footer.tsx
git commit -m "refactor: simplify Footer component
- Minimal design with essential links
- Better spacing and responsive layout"
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
- `/blog/[slug]` (所有文章)
- `/about`

**Step 3: 本地测试生产构建**

```bash
npm run start
```

访问并测试所有页面和功能

**Step 4: 最终提交**

```bash
git add .
git commit -m "style: complete minimalist blog redesign
- Implemented warm paper color scheme
- Added responsive card-based layout
- Improved typography for better reading experience
- All pages tested and working"
```

---

## 测试清单

完成所有任务后，请验证：

- [ ] 首页网格布局正常显示（1/2/3列响应式）
- [ ] 文章卡片 hover 效果正常
- [ ] 文章详情页排版舒适（18px，1.8行高）
- [ ] 深色模式切换正常
- [ ] 导航栏 active 状态正确
- [ ] 所有页面响应式正常
- [ ] 阅读时间计算正确
- [ ] 标签显示正确
- [ ] 构建成功，无错误
- [ ] 移动端触摸友好

## 注意事项

1. **颜色变量**：确保使用定义的 CSS 变量而不是硬编码颜色值
2. **性能**：图片使用 Next.js Image 组件
3. **无障碍**：保持足够的颜色对比度（WCAG AA）
4. **深色模式**：每个新组件都要测试深色模式
5. **响应式**：在移动端、平板、桌面都进行测试
