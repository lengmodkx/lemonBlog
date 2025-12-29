# 导航栏和主页布局重新设计实现计划

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**目标:** 优化导航栏和主页布局，在导航栏添加头像作为品牌标识，重新组织主页自我介绍内容，使用 CSS 对齐左右两列高度，并实现响应式间距。

**架构:** 修改 Navbar 组件添加头像，重组主页 page.tsx 的自我介绍内容和布局结构，使用 CSS Grid 的 items-stretch 实现等高对齐，使用 Tailwind 响应式类实现自适应间距。

**技术栈:** Next.js 16 (App Router), React 19, Tailwind CSS v4, TypeScript

---

## Task 1: 导航栏添加头像

**文件:**
- 修改: `src/components/Navbar.tsx`

**Step 1: 添加 Image 导入**

找到第 3 行：
```tsx
import Link from 'next/link';
import { useState, useEffect } from 'react';
```

替换为：
```tsx
import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
```

**Step 2: 在导航链接前添加头像链接**

找到第 26-30 行的 navigation 数组定义，在其之前添加头像链接：

当前代码：
```tsx
  const navigation = [
    { name: 'Home', href: '/' },
    { name: 'Blog', href: '/blog' },
    { name: 'About', href: '/about' },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-paper-50/80 dark:bg-ink-DEFAULT/80 backdrop-blur-sm">
      <div className="max-w-2xl mx-auto px-4">
        <div className="flex justify-center items-center h-16">
          {/* Navigation Links */}
          <div className="flex items-center gap-8">
```

替换为：
```tsx
  const navigation = [
    { name: 'Home', href: '/' },
    { name: 'Blog', href: '/blog' },
    { name: 'About', href: '/about' },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-paper-50/80 dark:bg-ink-DEFAULT/80 backdrop-blur-sm">
      <div className="max-w-2xl mx-auto px-4">
        <div className="flex justify-center items-center h-16">
          {/* Avatar Logo */}
          <Link href="/" className="flex items-center mr-8">
            <div className="relative w-10 h-10">
              <Image
                src="/images/avatar.jpg"
                alt="lemon"
                fill
                className="rounded-full object-cover shadow-md"
              />
              <div className="absolute inset-0 rounded-full ring-2 ring-lavender-200 dark:ring-lavender-800" />
            </div>
          </Link>

          {/* Navigation Links */}
          <div className="flex items-center gap-8">
```

**Step 3: 提交**

```bash
cd .worktrees/feature-navigation-and-layout-redesign
git add src/components/Navbar.tsx
git commit -m "feat: add avatar logo to navigation bar"
```

---

## Task 2: 重组主页自我介绍内容

**文件:**
- 修改: `src/app/page.tsx`

**Step 1: 去除左侧自我介绍中的重复信息**

找到第 30-48 行：
```tsx
        {/* Main Content with Info and Fixed Card */}
        <div className="grid grid-cols-1 sm:grid-cols-[1fr_16rem] gap-12 mb-8">
          {/* Self Introduction */}
          <div>
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
```

替换为（去除地点和工作信息）：
```tsx
        {/* Main Content with Info and Fixed Card */}
        <div className="grid grid-cols-1 sm:grid-cols-[1fr_16rem] items-stretch gap-0 sm:gap-12 lg:gap-16 mb-8">
          {/* Self Introduction */}
          <div className="flex flex-col">
            <h1 className="text-3xl font-bold text-ink dark:text-text-primary mb-2">
              I&apos;m <span className="text-primary">lemon</span>
            </h1>
            <p className="text-text-secondary text-base mb-6">
              Learner | Builder | Java Backend Developer
            </p>
```

**Step 2: 调整详细介绍段落的样式和位置**

找到第 54-80 行：
```tsx
        {/* Introduction */}
        <div className="space-y-2 text-text-secondary mb-8 text-sm">
          <p className="flex items-start gap-2">
            <span className="shrink-0">•</span>
            <span>I&apos;m a learner, builder, and knowledge seeker.</span>
          </p>
          <p className="flex items-start gap-2">
            <span className="shrink-0">•</span>
            <span>I live in China and work as a backend engineer.</span>
          </p>
          <p className="flex items-start gap-2">
            <span className="shrink-0">•</span>
            <span>My first programming language was Java.</span>
          </p>
          <p className="flex items-start gap-2">
            <span className="shrink-0">•</span>
            <span>I work mostly with Java technologies.</span>
          </p>
          <p className="flex items-start gap-2">
            <span className="shrink-0">•</span>
            <span>I love coding, reading, and sharing knowledge.</span>
          </p>
          <p className="flex items-start gap-2">
            <span className="shrink-0">•</span>
            <span>I started this blog to document and share my experience.</span>
          </p>
        </div>
```

移动到左侧自我介绍 div 内部，并调整样式：

```tsx
        {/* Main Content with Info and Fixed Card */}
        <div className="grid grid-cols-1 sm:grid-cols-[1fr_16rem] items-stretch gap-0 sm:gap-12 lg:gap-16 mb-8">
          {/* Self Introduction */}
          <div className="flex flex-col">
            <h1 className="text-3xl font-bold text-ink dark:text-text-primary mb-2">
              I&apos;m <span className="text-primary">lemon</span>
            </h1>
            <p className="text-text-secondary text-base mb-6">
              Learner | Builder | Java Backend Developer
            </p>

            {/* Introduction */}
            <div className="space-y-2 text-text-secondary text-sm">
              <p className="flex items-start gap-2">
                <span className="shrink-0">•</span>
                <span>I&apos;m a learner, builder, and knowledge seeker.</span>
              </p>
              <p className="flex items-start gap-2">
                <span className="shrink-0">•</span>
                <span>I live in China and work as a backend engineer.</span>
              </p>
              <p className="flex items-start gap-2">
                <span className="shrink-0">•</span>
                <span>My first programming language was Java.</span>
              </p>
              <p className="flex items-start gap-2">
                <span className="shrink-0">•</span>
                <span>I work mostly with Java technologies.</span>
              </p>
              <p className="flex items-start gap-2">
                <span className="shrink-0">•</span>
                <span>I love coding, reading, and sharing knowledge.</span>
              </p>
              <p className="flex items-start gap-2">
                <span className="shrink-0">•</span>
                <span>I started this blog to document and share my experience.</span>
              </p>
            </div>
          </div>
```

**Step 3: 提交**

```bash
git add src/app/page.tsx
git commit -m "refactor: reorganize homepage self-introduction layout

- Remove duplicate location and job info from left column
- Move introduction bullet points inside left column
- Add items-stretch to grid for equal height alignment
- Increase job title font size (text-sm → text-base)
- Add responsive spacing: gap-0 sm:gap-12 lg:gap-16
- Wrap left column in flex flex-col for proper alignment"
```

---

## Task 3: 调整 FixedInfoCard 布局以适应等高对齐

**文件:**
- 修改: `src/components/FixedInfoCard/index.tsx`

**Step 1: 为卡片容器添加 flex 布局以适应等高**

找到第 23-33 行：
```tsx
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
```

替换为（添加 flex flex-col）：
```tsx
  return (
    <div className="
      flex flex-col
      backdrop-blur-md bg-white/80 dark:bg-ink-DEFAULT/80
      border border-lavender-200 dark:border-lavender-800
      rounded-2xl shadow-md p-5
      hover:scale-105
      hover:shadow-2xl
      hover:-translate-y-1
      hover:border-primary
      transition-all duration-300 ease-out
      h-full
    ">
```

**Step 2: 提交**

```bash
git add src/components/FixedInfoCard/index.tsx
git commit -m "style: add flex layout to FixedInfoCard for equal height

- Add flex flex-col to card container
- Add h-full to fill parent height
- Ensures card stretches to match left column height"
```

---

## Task 4: 类型检查

**文件:**
- 测试: 所有修改的文件

**Step 1: 运行类型检查**

```bash
cd .worktrees/feature-navigation-and-layout-redesign
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
cd .worktrees/feature-navigation-and-layout-redesign
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
cd .worktrees/feature-navigation-and-layout-redesign
npm run dev
```

**Step 2: 测试以下场景**

1. **导航栏头像测试**:
   - 头像显示在导航栏左侧
   - 头像是圆形，带 ring 效果
   - 点击头像可以跳转到首页
   - 头像在不同屏幕尺寸下正常显示

2. **主页布局测试**:
   - 左侧自我介绍包含：名字、职位、6个 bullet points
   - 右侧 FixedInfoCard 包含：头像、名字、职位、地点、工作、邮箱、社交链接
   - 左右两列高度对齐
   - 没有重复信息（地点和工作只在右侧显示）

3. **响应式间距测试**:
   - 移动端（<640px）: 单列布局，gap-0
   - 平板/小桌面（640px-1024px）: 两列布局，gap-12
   - 大桌面（>1024px）: 两列布局，gap-16

4. **暗色模式测试**:
   - 导航栏头像在暗色模式下正常显示
   - 主页布局在暗色模式下正常显示
   - Ring 效果在暗色模式下正确显示

5. **交互测试**:
   - 导航栏头像链接正常工作
   - FixedInfoCard hover 效果正常
   - 主题切换功能正常

**Step 3: 如果所有测试通过，继续合并**

---

## Task 7: 最终合并准备

**Step 1: 查看更改**

```bash
cd .worktrees/feature-navigation-and-layout-redesign
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
git merge feature/navigation-and-layout-redesign --no-ff
```

**Step 4: 推送到远程**

```bash
git push origin main
```

---

## 完成检查清单

- [ ] 导航栏头像已添加（40x40px 圆形，带 ring）
- [ ] 主页自我介绍已重组（去除重复，层次清晰）
- [ ] 左右两列高度对齐（items-stretch）
- [ ] 响应式间距已实现（gap-0 sm:gap-12 lg:gap-16）
- [ ] 类型检查通过
- [ ] 构建成功
- [ ] 手动测试完成
- [ ] 代码已合并到 main
- [ ] 已推送到远程
- [ ] worktree 已清理（使用 `git worktree remove`）

---

## 注意事项

- **渐进式实现**: 每个任务独立提交，便于回滚
- **保持一致性**: Ring 样式、hover 效果与现有设计保持一致
- **响应式优先**: 确保所有改动在移动端和桌面端都正常工作
- **性能优化**: 使用 Next.js Image 组件优化头像加载
