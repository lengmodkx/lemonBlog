# 主页间距优化实现计划

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**目标:** 优化主页的间距和留白，让布局更透气、更舒适，参考 https://cxhello.top/ 的简洁排版风格。

**架构:** 直接修改两个文件（主页和固定信息框组件），调整 Tailwind CSS 间距类，保持现有布局结构不变。

**技术栈:** Next.js 16 (App Router), React 19, Tailwind CSS v4, TypeScript

---

## Task 1: 优化 Hero Section 垂直间距

**文件:**
- 修改: `src/app/page.tsx:25`

**Step 1: 修改 Hero Section 的上下间距**

找到第 25 行：
```tsx
<section className="relative max-w-2xl mx-auto px-4 py-20">
```

替换为：
```tsx
<section className="relative max-w-2xl mx-auto px-4 py-24">
```

**Step 2: 提交**

```bash
cd .worktrees/feature-homepage-spacing-optimization
git add src/app/page.tsx
git commit -m "style: increase hero section vertical spacing (py-20 → py-24)"
```

---

## Task 2: 优化三列网格间距

**文件:**
- 修改: `src/app/page.tsx:30`

**Step 1: 修改网格布局的间距**

找到第 30 行：
```tsx
<div className="grid grid-cols-1 sm:grid-cols-[auto_1fr_16rem] gap-6 mb-8">
```

替换为：
```tsx
<div className="grid grid-cols-1 sm:grid-cols-[auto_1fr_16rem] gap-8 mb-8">
```

**Step 2: 提交**

```bash
git add src/app/page.tsx
git commit -m "style: increase grid layout spacing (gap-6 → gap-8)"
```

---

## Task 3: 优化固定信息框内部间距

**文件:**
- 修改: `src/components/FixedInfoCard/index.tsx`

**Step 1: 修改头像与名字之间的间距**

找到大约第 56 行：
```tsx
<div className="flex justify-center mb-4">
```

替换为：
```tsx
<div className="flex justify-center mb-5">
```

**Step 2: 修改各个 section 之间的间距**

找到 Contact Info Section 的 `space-y-2`（大约第 85 行）：
```tsx
<div className="space-y-2 mb-4 text-xs">
```

替换为：
```tsx
<div className="space-y-3 mb-4 text-xs">
```

**Step 3: 修改社交链接之间的间距**

找到 Social Links Section 的 `gap-3`（大约第 104 行）：
```tsx
<div className="flex justify-center gap-3">
```

替换为：
```tsx
<div className="flex justify-center gap-4">
```

**Step 4: 提交**

```bash
git add src/components/FixedInfoCard/index.tsx
git commit -m "style: increase spacing inside fixed info card"
```

---

## Task 4: 类型检查

**文件:**
- 测试: 所有修改的文件

**Step 1: 运行类型检查**

```bash
cd .worktrees/feature-homepage-spacing-optimization
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
cd .worktrees/feature-homepage-spacing-optimization
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
cd .worktrees/feature-homepage-spacing-optimization
npm run dev
```

**Step 2: 测试以下场景**

1. **Hero Section 间距测试**:
   - 页面顶部和第一个内容元素之间的间距增加了
   - 整体感觉更透气

2. **网格布局间距测试**:
   - 头像、自我介绍、固定信息框之间的间距增加了
   - 布局不会感觉拥挤

3. **固定信息框内部间距测试**:
   - 头像和名字之间的间距增加了
   - 各个信息板块之间的间距增加了
   - 社交链接之间的间距增加了

4. **响应式测试**:
   - 桌面端（≥640px）: 三列布局间距正常
   - 移动端（<640px）: 堆叠布局间距正常

5. **暗色模式测试**:
   - 所有间距调整在暗色模式下正常显示

**Step 3: 如果所有测试通过，继续合并**

---

## Task 7: 最终合并准备

**Step 1: 查看更改**

```bash
cd .worktrees/feature-homepage-spacing-optimization
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
git merge feature/homepage-spacing-optimization --no-ff
```

**Step 4: 推送到远程**

```bash
git push origin main
```

---

## 完成检查清单

- [ ] Hero Section 垂直间距已增加 (py-20 → py-24)
- [ ] 网格布局间距已增加 (gap-6 → gap-8)
- [ ] 固定信息框内部间距已优化
- [ ] 类型检查通过
- [ ] 构建成功
- [ ] 手动测试完成
- [ ] 代码已合并到 main
- [ ] 已推送到远程
- [ ] worktree 已清理（使用 `git worktree remove`）

---

## 注意事项

- **渐进式优化**: 本次只调整间距，不改变布局结构和功能
- **向后兼容**: 所有改动都是样式调整，不影响功能
- **响应式保持**: 所有间距调整在移动端和桌面端都正常工作
- **性能影响**: 仅修改 CSS 类，无性能影响
