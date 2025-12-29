# 导航栏和主页布局重新设计

## 概述

优化导航栏和主页布局，提升品牌识别度和视觉一致性。

## 设计目标

1. **导航栏增加头像** - 在导航栏左侧添加头像作为品牌标识
2. **主页自我介绍重组** - 重新组织左侧自我介绍内容，创建清晰的视觉层次
3. **卡片高度对齐** - 使用 CSS 让左右两列高度对齐
4. **响应式间距** - 根据屏幕尺寸调整间距

---

## 第1部分：导航栏头像

### 修改文件
- `src/components/Navbar.tsx`

### 设计方案

**头像规格**：
- 尺寸：40x40px
- 形状：圆形
- 样式：带 ring 效果（与主页风格一致）
- 交互：可点击，跳转到首页

**布局结构**：
```
[头像] [Home] [Blog] [About] ... [主题按钮]
```

**实现细节**：
```tsx
<Link href="/" className="flex items-center">
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
```

**位置**：导航链接之前，作为 logo/品牌标识

---

## 第2部分：主页自我介绍重组

### 修改文件
- `src/app/page.tsx`

### 设计方案

**内容重组**：

左侧（自我介绍）专注于：
1. 名字（大号，text-3xl）
2. 职位/头衔（中等，text-base）
3. 6个 bullet points 个人介绍（text-sm）

右侧（FixedInfoCard）包含：
- 头像
- 名字
- 职位
- 地点（📍）
- 工作（💼）
- 邮箱（📧）
- 社交链接

**视觉层次**：
```
名字（text-3xl, font-bold）
  ↓
职位（text-base, text-text-secondary）
  ↓
个人介绍段落（6 points, text-sm, space-y-2）
```

**去除重复**：
- 左侧去除：地点、工作信息（右侧已包含）
- 左侧保留：名字、职位、个人介绍

---

## 第3部分：卡片高度对齐

### 修改文件
- `src/app/page.tsx`

### 设计方案

使用 Grid 的 `items-stretch` 属性：

```tsx
<div className="grid grid-cols-1 sm:grid-cols-[1fr_16rem] items-stretch gap-X">
  <div className="flex flex-col"> {/* 左侧内容 */} </div>
  <div> {/* FixedInfoCard 自动拉伸 */} </div>
</div>
```

**效果**：
- 左侧自我介绍和右侧卡片高度自动对齐
- 移动端自动堆叠（单列）
- 桌面端两列等高

---

## 第4部分：响应式间距

### 修改文件
- `src/app/page.tsx`

### 设计方案

使用 Tailwind 响应式间距类：

**方案 1：渐进式间距**
```tsx
gap-0 sm:gap-12 lg:gap-16
```
- 移动端（<640px）：gap-0（单列堆叠）
- 平板/小桌面（640px-1024px）：gap-12 (48px)
- 大桌面（>1024px）：gap-16 (64px)

**方案 2：固定间距**
```tsx
gap-8 sm:gap-12
```
- 移动端：gap-8 (32px)
- 桌面端：gap-12 (48px)

**推荐方案 1**（渐进式），因为移动端单列布局不需要 gap。

---

## 实现任务清单

1. **修改 Navbar 组件**
   - 添加头像导入
   - 在导航链接前添加头像链接
   - 调整布局样式

2. **修改主页布局**
   - 重组左侧自我介绍内容
   - 去除重复信息（地点、工作）
   - 调整字体大小和间距
   - 添加 `items-stretch` 到 grid
   - 更新为响应式间距

3. **调整 FixedInfoCard**
   - 可能需要调整内部布局以适应等高对齐

4. **测试验证**
   - 测试不同屏幕尺寸
   - 验证暗色模式
   - 确认交互正常

---

## 技术实现

### 关键技术点

- **Next.js Image 组件**：用于导航栏头像优化
- **CSS Grid items-stretch**：实现等高对齐
- **Tailwind 响应式类**：实现自适应间距
- **Flexbox**：用于内容内部布局

### 保持一致性

- Ring 样式与主页头像一致
- 圆形头像设计
- Hover 效果
- 暗色模式支持

---

## 预期效果

1. **品牌识别度提升** - 导航栏头像增加个人品牌标识
2. **视觉层次清晰** - 左侧内容层次分明，信息不重复
3. **布局平衡** - 左右两列高度对齐，视觉协调
4. **响应式体验** - 不同屏幕尺寸下间距和布局自适应

---

## 设计原则

- **YAGNI**：只实现必要功能，不过度设计
- **一致性**：保持与现有设计风格一致
- **渐进式优化**：小步迭代，逐步改进
- **用户优先**：提升用户体验和视觉舒适度
