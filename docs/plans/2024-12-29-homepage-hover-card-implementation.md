# Homepage Hover Info Card Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build a hover information panel that appears next to the homepage Info Card when hovered, displaying contact links, blog statistics, and current status.

**Architecture:** Client-side React component using Tailwind CSS group-hover pattern. The HoverInfoCard component wraps the existing Info Card, displaying a floating panel on hover. Blog statistics are computed server-side and passed as props.

**Tech Stack:** Next.js 16 (App Router), React 19, Tailwind CSS v4, TypeScript

---

## Task 1: Create ContactItem Component

**Files:**
- Create: `src/components/HoverInfoCard/ContactItem.tsx`

**Step 1: Create the ContactItem component**

```tsx
// src/components/HoverInfoCard/ContactItem.tsx
'use client'

import React from 'react'

interface ContactItemProps {
  icon: string
  label: string
  href: string
}

export default function ContactItem({ icon, label, href }: ContactItemProps) {
  const isEmail = href.startsWith('mailto:')

  return (
    <a
      href={href}
      target={isEmail ? undefined : '_blank'}
      rel={isEmail ? undefined : 'noopener noreferrer'}
      className="flex items-center gap-2 text-sm text-text-muted hover:text-primary transition-colors"
    >
      <span className="shrink-0">{icon}</span>
      <span>{label}</span>
    </a>
  )
}
```

**Step 2: Commit**

```bash
cd .worktrees/feature-homepage-hover-card
git add src/components/HoverInfoCard/ContactItem.tsx
git commit -m "feat: add ContactItem component for hover info card"
```

---

## Task 2: Create HoverPanel Component

**Files:**
- Create: `src/components/HoverInfoCard/HoverPanel.tsx`

**Step 1: Create the HoverPanel component**

```tsx
// src/components/HoverInfoCard/HoverPanel.tsx
'use client'

import { useState, useEffect } from 'react'
import ContactItem from './ContactItem'

interface BlogStats {
  postCount: number
  latestDate: string
}

interface HoverPanelProps {
  stats: BlogStats
}

export default function HoverPanel({ stats }: HoverPanelProps) {
  const [currentTime, setCurrentTime] = useState('')

  useEffect(() => {
    const updateTime = () => {
      const now = new Date()
      setCurrentTime(
        now.toLocaleTimeString('zh-CN', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: false
        })
      )
    }

    updateTime()
    const interval = setInterval(updateTime, 1000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="absolute left-full top-0 ml-4 w-64 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 ease-out z-10 sm:block hidden">
      <div
        className="backdrop-blur-md bg-white/90 dark:bg-ink-DEFAULT/90 border border-lavender-200 dark:border-lavender-800 rounded-xl shadow-xl p-4"
        role="tooltip"
        aria-label="Contact and blog information"
      >
        {/* Contact Section */}
        <div className="mb-4">
          <p className="text-xs font-medium text-text-muted mb-2 flex items-center gap-1">
            <span>📬</span>
            <span>联系方式</span>
          </p>
          <div className="space-y-1">
            <ContactItem
              icon="🔗"
              label="GitHub"
              href="https://github.com/lengmodkx"
            />
            <ContactItem
              icon="🐦"
              label="Twitter"
              href="https://twitter.com/DKX_LM"
            />
            <ContactItem
              icon="✈️"
              label="Telegram"
              href="https://t.me/lemon2Judy"
            />
            <ContactItem
              icon="📧"
              label="Email"
              href="mailto:lengmodkx@gmail.com"
            />
          </div>
        </div>

        {/* Blog Stats Section */}
        <div className="mb-4">
          <p className="text-xs font-medium text-text-muted mb-2 flex items-center gap-1">
            <span>📊</span>
            <span>博客统计</span>
          </p>
          <div className="space-y-1 text-xs text-text-muted">
            <p className="flex items-center gap-2">
              <span>📝</span>
              <span>文章: {stats.postCount} 篇</span>
            </p>
            <p className="flex items-center gap-2">
              <span>📅</span>
              <span>最新: {stats.latestDate}</span>
            </p>
          </div>
        </div>

        {/* Current Status Section */}
        <div>
          <p className="text-xs font-medium text-text-muted mb-2 flex items-center gap-1">
            <span>📍</span>
            <span>当前状态</span>
          </p>
          <div className="space-y-1 text-xs text-text-muted">
            <p className="flex items-center gap-2">
              <span>🌏</span>
              <span>中国</span>
            </p>
            <p className="flex items-center gap-2">
              <span>🕐</span>
              <span>{currentTime}</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
```

**Step 2: Commit**

```bash
git add src/components/HoverInfoCard/HoverPanel.tsx
git commit -m "feat: add HoverPanel component with stats and time"
```

---

## Task 3: Create HoverInfoCard Main Component

**Files:**
- Create: `src/components/HoverInfoCard/index.tsx`

**Step 1: Create the HoverInfoCard wrapper component**

```tsx
// src/components/HoverInfoCard/index.tsx
'use client'

import React from 'react'
import HoverPanel from './HoverPanel'

interface BlogStats {
  postCount: number
  latestDate: string
}

interface HoverInfoCardProps {
  children: React.ReactNode
  stats: BlogStats
}

export default function HoverInfoCard({ children, stats }: HoverInfoCardProps) {
  return (
    <div className="relative group">
      {children}
      <HoverPanel stats={stats} />
    </div>
  )
}
```

**Step 2: Commit**

```bash
git add src/components/HoverInfoCard/index.tsx
git commit -m "feat: add HoverInfoCard wrapper component"
```

---

## Task 4: Update Homepage to Use HoverInfoCard

**Files:**
- Modify: `src/app/page.tsx:1-60`

**Step 1: Get blog statistics in the Home component**

Modify the imports and add stats calculation:

```tsx
import Link from 'next/link';
import Image from 'next/image';
import { getLatestPosts, getAllPosts } from '@/lib/posts';
import ArticleCard from '@/components/ArticleCard';
import HoverInfoCard from '@/components/HoverInfoCard';
```

**Step 2: Calculate stats in the component**

Modify the Home function to calculate stats:

```tsx
export default function Home() {
  const latestPosts = getLatestPosts(6);
  const allPosts = getAllPosts();

  // Calculate blog statistics
  const stats = {
    postCount: allPosts.length,
    latestDate: allPosts.length > 0 ? allPosts[0].date : '-'
  };
```

**Step 3: Wrap the Info Card with HoverInfoCard**

Locate the "Main Content with Avatar and Info Card" section (lines 28-60) and wrap the Info Card div with HoverInfoCard:

```tsx
        {/* Main Content with Avatar and Info Card */}
        <div className="flex flex-col sm:flex-row gap-8 mb-8">
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

          {/* Info Card - Wrapped with HoverInfoCard */}
          <HoverInfoCard stats={stats}>
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
          </HoverInfoCard>
        </div>
```

**Step 4: Commit**

```bash
git add src/app/page.tsx
git commit -m "feat: wrap Info Card with HoverInfoCard component"
```

---

## Task 5: Type Check

**Files:**
- Test: All modified files

**Step 1: Run type check**

```bash
cd .worktrees/feature-homepage-hover-card
npm run type-check
```

Expected: No type errors

**Step 2: If type check passes, commit**

```bash
git commit --allow-empty -m "test: type check passing"
```

---

## Task 6: Build Verification

**Files:**
- Test: Build output

**Step 1: Run production build**

```bash
cd .worktrees/feature-homepage-hover-card
npm run build
```

Expected: Build succeeds with no errors

**Step 2: If build succeeds, commit**

```bash
git commit --allow-empty -m "test: production build successful"
```

---

## Task 7: Manual Testing

**Step 1: Start dev server**

```bash
cd .worktrees/feature-homepage-hover-card
npm run dev
```

**Step 2: Test the following scenarios:**

1. **Hover Test**: Navigate to homepage, hover over the Info Card area
   - Expected: Hover panel appears on the right side
   - Expected: Panel has backdrop blur effect
   - Expected: All contact links are visible

2. **Links Test**: Click each contact link
   - GitHub: Opens github.com/lengmodkx in new tab
   - Twitter: Opens twitter.com/DKX_LM in new tab
   - Telegram: Opens t.me/lemon2Judy in new tab
   - Email: Opens email client

3. **Stats Test**: Verify blog statistics
   - Post count matches actual number of articles
   - Latest date shows most recent article date

4. **Time Test**: Verify current time updates
   - Time displays in HH:MM:SS format
   - Time updates every second

5. **Responsive Test**: Resize browser window
   - Desktop (≥640px): Panel appears on right
   - Mobile (<640px): Panel hidden (sm:block hidden)

6. **Dark Mode Test**: Toggle dark mode
   - Panel background adapts to theme
   - Text colors remain readable
   - Borders adjust to theme

**Step 3: If all tests pass, proceed to merge**

---

## Task 8: Final Preparation for Merge

**Step 1: Review changes**

```bash
cd .worktrees/feature-homepage-hover-card
git log --oneline -10
```

**Step 2: Ensure worktree is clean**

```bash
git status
```

Expected: No uncommitted changes

**Step 3: Switch to main and merge**

```bash
cd ../..
git checkout main
git merge feature/homepage-hover-card --no-ff
```

**Step 4: Push to remote**

```bash
git push origin main
```

---

## Documentation to Update

**Files:**
- Modify: `CLAUDE.md`

Add to Components section:

```markdown
### HoverInfoCard Component

Location: `src/components/HoverInfoCard/`

A client-side component that wraps the Info Card and displays a hover panel with:
- Contact links (GitHub, Twitter, Telegram, Email)
- Blog statistics (post count, latest article date)
- Current status (location, real-time clock)

Usage:
```tsx
<HoverInfoCard stats={{ postCount: number, latestDate: string }}>
  {/* Info Card content */}
</HoverInfoCard>
```

The hover panel appears on desktop screens when hovering over the Info Card.
```

---

## Completion Checklist

- [ ] All components created
- [ ] Homepage updated
- [ ] Type check passes
- [ ] Build succeeds
- [ ] Manual testing complete
- [ ] Documentation updated
- [ ] Code merged to main
- [ ] Pushed to remote
- [ ] Worktree cleaned up (use `git worktree remove`)

---

## Notes

- **CSS Colors Used**: All colors are from the existing Tailwind config (lavender, ink, paper, etc.)
- **Responsive**: Hover panel is hidden on mobile screens (<640px)
- **Accessibility**: Includes `aria-label="tooltip"` for screen readers
- **Performance**: Time update interval is cleaned up on unmount
- **Error Handling**: Missing stats defaults to `-` for latest date, `0` for post count
