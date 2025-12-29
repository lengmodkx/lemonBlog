# 首页固定信息框实现计划

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**目标:** 在首页自我介绍右侧添加固定显示的个人信息卡片，包含头像、名字、职位、联系方式、社交链接，鼠标浮动时有组合动画效果。

**架构:** 创建 FixedInfoCard 客户端组件，使用三列网格布局（头像、自我介绍、固定信息框），使用 Tailwind CSS 实现毛玻璃效果和 hover 动画。

**技术栈:** Next.js 16 (App Router), React 19, Tailwind CSS v4, TypeScript

---

## Task 1: 创建 FixedInfoCard 组件

**文件:**
- 创建: `src/components/FixedInfoCard/index.tsx`

**Step 1: 创建组件文件**

```tsx
// src/components/FixedInfoCard/index.tsx
'use client'

import Image from 'next/image'
import { useState } from 'react'

export default function FixedInfoCard() {
  const [imageError, setImageError] = useState(false)

  const profile = {
    name: 'lemon',
    title: 'Learner | Builder | Java Backend Developer',
    location: 'China',
    job: 'Backend Development Engineer',
    email: 'lengmodkx@gmail.com',
    avatar: '/images/avatar.jpg',
    socialLinks: {
      github: 'https://github.com/lengmodkx',
      twitter: 'https://twitter.com/DKX_LM',
      telegram: 'https://t.me/lemon2Judy'
    }
  }

  return (
    <div className="
      backdrop-blur-md bg-white/80 dark:bg-ink-DEFAULT/80
      border border-lavender-200 dark:border-lavender-800
      rounded-2xl shadow-md p-5
      hover:scale-105
      hover:shadow-2xl
      hover:-translate-y-1
      hover:border-primary
      transition-all duration-300 ease-out
    ">
      {/* Avatar Section */}
      <div className="flex justify-center mb-4">
        <div className="relative w-20 h-20">
          {!imageError ? (
            <Image
              src={profile.avatar}
              alt={profile.name}
              fill
              className="rounded-full object-cover shadow-lg"
              onError={() => setImageError(true)}
            />
          ) : (
            <div className="w-full h-full rounded-full bg-lavender-200 dark:bg-lavender-900/30 flex items-center justify-center text-3xl">
              👤
            </div>
          )}
        </div>
      </div>

      {/* Name & Title Section */}
      <div className="text-center mb-4">
        <h2 className="text-xl font-bold text-ink dark:text-text-primary mb-1">
          <span className="text-primary">{profile.name}</span>
        </h2>
        <p className="text-xs text-text-secondary leading-relaxed">
          {profile.title}
        </p>
      </div>

      {/* Contact Info Section */}
      <div className="space-y-2 mb-4 text-xs">
        <p className="flex items-center gap-2 text-text-muted">
          <span className="shrink-0">📍</span>
          <span>{profile.location}</span>
        </p>
        <p className="flex items-center gap-2 text-text-muted">
          <span className="shrink-0">💼</span>
          <span>{profile.job}</span>
        </p>
        <a
          href={`mailto:${profile.email}`}
          className="flex items-center gap-2 text-text-muted hover:text-primary transition-colors"
        >
          <span className="shrink-0">📧</span>
          <span>{profile.email}</span>
        </a>
      </div>

      {/* Social Links Section */}
      <div className="flex justify-center gap-3">
        <a
          href={profile.socialLinks.github}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="GitHub"
          className="text-text-muted hover:text-primary transition-colors text-sm"
        >
          GitHub
        </a>
        <span className="text-text-muted">•</span>
        <a
          href={profile.socialLinks.twitter}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Twitter"
          className="text-text-muted hover:text-primary transition-colors text-sm"
        >
          Twitter
        </a>
        <span className="text-text-muted">•</span>
        <a
          href={profile.socialLinks.telegram}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Telegram"
          className="text-text-muted hover:text-primary transition-colors text-sm"
        >
          Telegram
        </a>
      </div>
    </div>
  )
}
```

**Step 2: 提交**

```bash
cd .worktrees/feature-fixed-info-card
git add src/components/FixedInfoCard/index.tsx
git commit -m "feat: add FixedInfoCard component with hover animations"
```

---

## Task 2: 更新首页布局为网格

**文件:**
- 修改: `src/app/page.tsx:1-70`

**Step 1: 移除旧的导入**

删除第 5 行的 HoverInfoCard 导入：
```tsx
// 删除这行
import HoverInfoCard from '@/components/HoverInfoCard';
```

**Step 2: 移除 stats 计算**

删除第 16-20 行的 stats 计算：
```tsx
// 删除这些行
// Calculate blog statistics
const stats = {
  postCount: allPosts.length,
  latestDate: allPosts.length > 0 ? allPosts[0].date : '-'
};
```

**Step 3: 添加 FixedInfoCard 导入**

在第 4 行后添加：
```tsx
import FixedInfoCard from '@/components/FixedInfoCard';
```

**Step 4: 修改布局为网格**

找到 "Main Content with Avatar and Info Card" 部分（第 36-70 行），替换为：

```tsx
        {/* Main Content with Avatar, Info, and Fixed Card */}
        <div className="grid grid-cols-1 sm:grid-cols-[auto_1fr_16rem] gap-6 mb-8">
          {/* Avatar */}
          <div className="relative w-28 h-28 shrink-0">
            <Image
              src="/images/avatar.jpg"
              alt="lemon"
              fill
              className="rounded-full object-cover shadow-lg"
            />
            <div className="absolute inset-0 rounded-full ring-4 ring-lavender-100 dark:ring-lavender-900/30" />
          </div>

          {/* Self Introduction */}
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-ink dark:text-text-primary mb-2">
              I&apos;m <span className="text-primary">lemon</span>
            </h1>
            <p className="text-text-secondary text-sm mb-3">
              Learner | Builder | Java Backend Developer
            </p>
            <div className="space-y-1 text-xs text-text-muted">
              <p className="flex items-center gap-2">
                <span>📍</span>
                <span>China</span>
              </p>
              <p className="flex items-center gap-2">
                <span>💼</span>
                <span>Backend Development Engineer</span>
              </p>
            </div>
          </div>

          {/* Fixed Info Card */}
          <FixedInfoCard />
        </div>
```

**Step 5: 提交**

```bash
git add src/app/page.tsx
git commit -m "feat: update homepage layout to grid with FixedInfoCard"
```

---

## Task 3: 删除旧的 HoverInfoCard 组件

**文件:**
- 删除: `src/components/HoverInfoCard/`

**Step 1: 删除整个目录**

```bash
cd .worktrees/feature-fixed-info-card
rm -rf src/components/HoverInfoCard
```

**Step 2: 提交**

```bash
git add src/components/HoverInfoCard
git commit -m "refactor: remove old HoverInfoCard component"
```

---

## Task 4: 类型检查

**文件:**
- 测试: 所有修改的文件

**Step 1: 运行类型检查**

```bash
cd .worktrees/feature-fixed-info-card
npm run type-check
```

预期: 无类型错误

**Step 2: 如果通过，提交**

```bash
git commit --allow-empty -m "test: type check passing"
```

---

## Task 5: 构建验证

**文件:**
- 测试: 构建输出

**Step 1: 运行生产构建**

```bash
cd .worktrees/feature-fixed-info-card
npm run build
```

预期: 构建成功，无错误

**Step 2: 如果成功，提交**

```bash
git commit --allow-empty -m "test: production build successful"
```

---

## Task 6: 手动测试

**Step 1: 启动开发服务器**

```bash
cd .worktrees/feature-fixed-info-card
npm run dev
```

**Step 2: 测试以下场景**

1. **布局测试**:
   - 桌面端（≥640px）: 三列布局（头像、自我介绍、固定信息框）
   - 移动端（<640px）: 堆叠布局

2. **固定信息框内容测试**:
   - 头像显示正确
   - 名字 "lemon" 主题色高亮
   - 职位标题显示正确
   - 联系方式（中国、Backend Eng、邮箱）显示正确
   - 社交链接（GitHub、Twitter、Telegram）显示正确

3. **Hover 动画测试**:
   - 鼠标浮动时卡片放大 5%
   - 阴影从 md 变为 2xl
   - 向上移动 4px
   - 边框颜色变为主题色
   - 动画平滑过渡（300ms）

4. **暗色模式测试**:
   - 卡片背景适应暗色主题
   - 文字颜色保持可读
   - 边框适应暗色主题

5. **图片加载失败测试**:
   - 头像加载失败时显示占位符

**Step 3: 如果所有测试通过，继续合并**

---

## Task 7: 最终合并准备

**Step 1: 查看更改**

```bash
cd .worktrees/feature-fixed-info-card
git log --oneline -10
```

**Step 2: 确保工作树干净**

```bash
git status
```

预期: 无未提交的更改

**Step 3: 切换到 main 并合并**

```bash
cd ../..
git checkout main
git merge feature/fixed-info-card --no-ff
```

**Step 4: 推送到远程**

```bash
git push origin main
```

---

## 完成检查清单

- [ ] FixedInfoCard 组件已创建
- [ ] 首页布局已更新为网格
- [ ] 旧的 HoverInfoCard 组件已删除
- [ ] 类型检查通过
- [ ] 构建成功
- [ ] 手动测试完成
- [ ] 代码已合并到 main
- [ ] 已推送到远程
- [ ] worktree 已清理（使用 `git worktree remove`）

---

## 注意事项

- **CSS 颜色**: 所有颜色来自现有的 Tailwind 配置（lavender、ink、paper 等）
- **响应式**: 移动端堆叠布局，桌面端三列网格
- **无障碍访问**: 包含 `aria-label` 和语义化 HTML
- **性能**: 头像使用 Next.js Image 组件优化
- **动画**: 使用 `transform` 实现 GPU 加速
- **错误处理**: 头像加载失败时显示占位符
