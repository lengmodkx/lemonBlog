# 主页样式优化设计 - 间距与布局

## 概述

在现有固定信息框基础上，进行渐进式优化。本次优化专注于**增加留白间距**、**优化字体层级**和**改进动画过渡效果**，参考 https://cxhello.top/ 的简洁排版风格。

## 优化目标

1. **增加留白间距** - 让布局更透气、更舒适
2. **字体层级优化** - 提升文字的可读性和视觉层次
3. **动画过渡效果** - 让交互更流畅自然

## 第一部分：布局和间距优化

### 整体容器间距

**Hero Section 上下间距：**
- 当前：`py-20` (5rem = 80px)
- 优化：`py-24` (6rem = 96px)
- 原因：增加垂直留白，让内容呼吸感更好

**Section 之间间距：**
- 当前：各 section 之间间距不统一
- 优化：统一使用 `gap-12` 或更多
- 范围：Hero 和 Introduction、Introduction 和 Tech Stack 之间

### 网格布局间距

**三列网格间距：**
- 当前：`gap-6` (1.5rem = 24px)
- 优化：`gap-8` (2rem = 32px)
- 原因：让头像、自我介绍、固定信息框之间更宽松

### 固定信息框内部间距

**头像与名字之间：**
- 当前：`mb-4` (1rem = 16px)
- 优化：`mb-5` (1.25rem = 20px)

**各 section 之间：**
- 当前：`space-y-2` (0.5rem = 8px)
- 优化：`space-y-3` (0.75rem = 12px)

**社交链接之间：**
- 当前：`gap-3` (0.75rem = 12px)
- 优化：`gap-4` (1rem = 16px)

## 第二部分：字体层级优化

### 标题层级

**主标题（首页名字）：**
- 当前：`text-3xl font-bold`
- 优化：保持 `text-3xl font-bold`，但可以增加 `tracking-tight` 让字母间距更紧凑

**副标题（职位）：**
- 当前：`text-sm`
- 优化：`text-sm font-medium` 增加字重

### 固定信息框字体

**名字标题：**
- 当前：`text-xl font-bold`
- 优化：`text-xl font-bold tracking-tight`

**职位文字：**
- 当前：`text-xs`
- 优化：`text-xs leading-relaxed` 增加行高

**联系信息：**
- 当前：`text-xs`
- 优化：`text-xs leading-relaxed` 统一增加行高

## 第三部分：动画过渡效果

### 固定信息框 Hover 动画

**当前动画：**
- `scale-105` (放大 5%)
- `shadow-2xl` (阴影增强)
- `-translate-y-1` (向上 4px)
- `border-primary` (边框变主题色)

**优化建议：**
- 保持所有现有效果
- 增加更长的过渡时间：`duration-300` → `duration-500` 让动画更优雅
- 使用 `ease-out` 替代 `ease-out` 保持，或考虑 `cubic-bezier(0.4, 0, 0.2, 1)`

### 交互元素动画

**链接 hover：**
- 当前：`transition-colors`
- 优化：添加 `transition-all duration-200` 让所有属性变化更平滑

**头像区域：**
- 当前：ring 效果是静态的
- 优化：可以添加 hover 时的 ring 颜色变化或轻微放大

## 实现策略

### 试点先行

优先实现以下最容易看出效果的优化：

1. **Hero Section 上下间距** - `py-20` → `py-24`
2. **网格间距** - `gap-6` → `gap-8`
3. **固定信息框内部间距** - 各项间距调整

### 文件修改清单

**需要修改的文件：**
1. `src/app/page.tsx` - 主页布局和间距
2. `src/components/FixedInfoCard/index.tsx` - 固定信息框样式

### 测试验证

- 检查不同屏幕尺寸下的响应式效果
- 验证暗色模式下的视觉效果
- 测试动画流畅度

## 后续优化方向

如果本次间距优化效果良好，可以继续：
- 配色方案优化
- 更多动画细节
- 文章列表区域优化

## 设计参考

参考网站：https://cxhello.top/

主要参考：
- 简洁的留白和间距
- 清晰的视觉层次
- 流畅的交互动画
