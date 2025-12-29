# 首页固定信息框设计

## 概述

在首页自我介绍右侧添加一个固定显示的个人信息卡片，包含头像、名字、职位、联系方式、社交链接。鼠标浮动时触发组合动画效果（放大、阴影、位移、边框高亮）。

## 功能需求

### 布局结构

三列网格布局：
- **左侧**：头像（圆形，112x112px）
- **中间**：自我介绍区域（flex-1）
- **右侧**：固定信息框（固定宽度 16rem/256px）

### 固定信息框内容

```
┌─────────────────────┐
│   [头像 - 圆形]      │
│                     │
│   lemon             │
│   Learner | Builder │
│   Java Developer    │
│                     │
│   📍 China          │
│   💼 Backend Eng    │
│   📧 xxx@gmail.com  │
│                     │
│   [GitHub] [Twitter]│
│   [Telegram]        │
└─────────────────────┘
```

**内容项：**
1. **头像**：圆形，与左侧头像相同
2. **名字**：lemon（主题色高亮）
3. **职位**：Learner | Builder | Java Backend Developer
4. **联系方式**：
   - 📍 China
   - 💼 Backend Development Engineer
   - 📧 lengmodkx@gmail.com
5. **社交链接**：GitHub、Twitter、Telegram

## 视觉设计

### 卡片样式

- **背景**：`backdrop-blur-md bg-white/80 dark:bg-ink-DEFAULT/80`
- **边框**：`border border-lavender-200 dark:border-lavender-800`
- **圆角**：`rounded-2xl`
- **内边距**：`p-5`
- **默认阴影**：`shadow-md`

### Hover 动画效果

鼠标浮动时触发组合动画：

1. **缩放**：`hover:scale-105`（放大 5%）
2. **阴影**：`hover:shadow-2xl`
3. **位移**：`hover:-translate-y-1`（向上移动 4px）
4. **边框**：`hover:border-primary`（主题色边框）
5. **过渡**：`transition-all duration-300 ease-out`

### 响应式设计

- **移动端（< 640px）**：堆叠布局，信息框在自我介绍下方
- **桌面端（≥ 640px）**：三列网格布局

## 组件架构

### 文件结构

```
src/components/FixedInfoCard/
└── index.tsx    # 主组件
```

### 组件设计

**组件名**：`FixedInfoCard`

**类型**：客户端组件（`'use client'`）

**Props**：无（静态数据硬编码在组件内）

**数据内容**：
```typescript
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
```

## 技术实现

### 布局代码

```tsx
<div className="grid grid-cols-1 sm:grid-cols-[auto_1fr_16rem] gap-6">
  {/* 头像 */}
  <div className="relative w-28 h-28 shrink-0">
    <Image src="/images/avatar.jpg" alt="lemon" fill className="rounded-full object-cover shadow-lg" />
  </div>

  {/* 自我介绍 */}
  <div className="flex-1">
    <h1>I'm <span className="text-primary">lemon</span></h1>
    <p>Learner | Builder | Java Backend Developer</p>
    {/* ... */}
  </div>

  {/* 固定信息框 */}
  <FixedInfoCard />
</div>
```

### FixedInfoCard 组件结构

```tsx
'use client'

export default function FixedInfoCard() {
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
      {/* 头像 */}
      {/* 名字和职位 */}
      {/* 联系方式 */}
      {/* 社交链接 */}
    </div>
  )
}
```

## 错误处理

### 图片加载失败

头像加载失败时显示占位符：
```tsx
<Image
  src="/images/avatar.jpg"
  alt="lemon"
  fill
  onError={(e) => {
    // 显示默认占位符
  }}
/>
```

### 响应式处理

使用 Tailwind 响应式前缀：
- 移动端优先：默认样式用于小屏幕
- `sm:` 前缀：640px 及以上应用

## 无障碍访问

- 头像添加 `alt` 属性
- 社交链接添加 `aria-label`
- 使用语义化 HTML 结构

## 性能优化

- 头像使用 Next.js `Image` 组件（自动优化）
- 动画使用 `transform` 而非 `position`（GPU 加速）
- 过渡使用 `transition-all` 批量优化

## 设计参考

参考网站：https://cxhello.top/

主要借鉴：
- 信息框的固定位置（右侧）
- 内容组织方式
- 交互效果（hover 动画）

## 与现有代码的集成

### 需要修改的文件

1. **src/app/page.tsx**
   - 移除 `HoverInfoCard` 组件（之前的错误实现）
   - 将布局从 `flex` 改为 `grid`
   - 添加 `FixedInfoCard` 组件

2. **src/components/FixedInfoCard/index.tsx**
   - 新建组件文件

### 移除旧代码

删除或移除：
- `src/components/HoverInfoCard/` 目录（旧的 hover 实现）
- 相关的导入和引用
