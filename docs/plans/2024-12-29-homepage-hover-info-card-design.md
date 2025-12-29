# 首页 Hover 信息框设计

## 概述

在首页自我介绍的 Info Card 旁边添加一个 hover 信息框，当用户将鼠标悬停在 Info Card 上时，在右侧弹出一个精美的信息面板，展示联系方式、博客统计和当前状态。

## 功能需求

### Hover 触发机制
- 当鼠标进入 Info Card 区域时触发 hover 状态
- 使用 Tailwind 的 `group` 和 `group-hover` 类控制显示/隐藏
- 平滑的过渡动画效果

### 信息框显示内容

#### 1. 联系方式区域
- GitHub: lengmodkx
- Twitter: @DKX_LM
- Telegram: @lemon2Judy
- Email: lengmodkx@gmail.com

#### 2. 博客统计区域
- 文章总数（动态获取）
- 最新文章发布日期

#### 3. 当前状态区域
- 所在城市：中国
- 实时更新的本地时间

## 组件架构

```
HoverInfoCard (客户端组件)
├── Info Card (现有的头像+名字信息)
└── Hover Panel (hover时显示的侧边信息框)
    ├── 联系方式区域
    ├── 博客统计区域
    └── 当前状态区域
```

## 视觉设计

### 信息框样式
- **位置**: 绝对定位在 Info Card 右侧 (`left-full ml-4`)
- **背景**: 半透明毛玻璃效果 (`backdrop-blur-md bg-white/90 dark:bg-ink-DEFAULT/90`)
- **边框**: 1px 淡紫色 (`border border-lavender-200 dark:border-lavender-800`)
- **圆角**: `rounded-xl`
- **阴影**: `shadow-xl`
- **内边距**: `p-4`
- **动画**: `transition-all duration-300 ease-out`

### 响应式设计
- 桌面端 (≥sm): 信息框在右侧弹出
- 移动端 (<sm): 信息框在下方显示

## 技术实现

### 文件结构
```
src/components/
├── HoverInfoCard/
│   ├── index.tsx           # 主组件入口
│   ├── HoverPanel.tsx      # hover信息框内容
│   └── ContactItem.tsx     # 联系方式单项组件
```

### 主组件设计

`HoverInfoCard/index.tsx` - 客户端组件：

```tsx
'use client'

export default function HoverInfoCard({ children, stats }) {
  // children = 现有的头像+名字Info Card
  // stats = { postCount, latestDate } 从服务端传入
}
```

### 数据获取策略

博客统计数据在服务端组件中获取：

```tsx
// page.tsx (服务端)
const allPosts = getAllPosts()
const stats = {
  postCount: allPosts.length,
  latestDate: allPosts[0]?.date
}

<HoverInfoCard stats={stats}>
  {/* 现有的Info Card内容 */}
</HoverInfoCard>
```

### 样式实现要点

- 使用 `group` 包裹 Info Card
- Hover 面板使用 `group-hover:opacity-100 group-hover:visible` 控制显示
- 默认状态 `opacity-0 invisible` 避免影响布局
- 添加 `pointer-events-none` 到容器防止闪烁

## 错误处理

### 数据缺失处理
- 无文章时显示 `postCount: 0` 和 `latestDate: '-'`
- 数据加载失败时隐藏统计区域

### 交互保障
- 使用 CSS `group-hover` 实现无需 JavaScript 状态管理
- 添加平滑的过渡动画
- 防止 hover 闪烁

### 性能优化
- 时间更新使用 `setInterval`，组件卸载时清除
- 使用 `React.memo` 避免不必要重渲染
- 图标使用内联 SVG 减少请求

### 可访问性
- 添加 `aria-label` 描述内容
- 外部链接添加 `rel="noopener noreferrer"`
- 保持足够的颜色对比度

## 设计参考

参考网站: https://cxhello.top/

主要借鉴：
- 信息框的位置和弹出方向
- 内容区域的组织方式
- 交互设计模式
