# FixedInfoCard Dark Mode Fix Design

**Date:** 2025-01-03
**Author:** Claude Code
**Status:** Design Approved

## Problem Statement

When users switch to dark mode using the theme toggle in the Navbar, the `FixedInfoCard` component (right-side profile card on the Home page) does not respond to the theme change. The card maintains its light mode styling regardless of the current theme.

## Root Cause Analysis

The issue is in `src/components/FixedInfoCard/index.tsx` at lines 26-27:

```tsx
backdrop-blur-md bg-white/80 dark:bg-ink-DEFAULT/80
```

The hardcoded `bg-white/80` class overrides the `dark:bg-ink-DEFAULT/80` variant, preventing dark mode from taking effect.

## Solution

Replace hardcoded colors with semantic color tokens from the project's design system:

### Before
```tsx
bg-white/80 dark:bg-ink-DEFAULT/80
```

### After
```tsx
bg-paper-50/80 dark:bg-ink-DEFAULT/80
```

### Color Tokens (from tailwind.config.ts)

- **Light mode:** `paper-50` = `#F8F7FF` (light purple-tinted background)
- **Dark mode:** `ink-DEFAULT` = `#1F2937` (dark gray background)

## Implementation

**File to modify:** `src/components/FixedInfoCard/index.tsx`
**Line to change:** Line 26

**Single change:**
- Change `bg-white/80` to `bg-paper-50/80`

## Expected Behavior

After the fix:

| Mode | Background | Border | Text Colors |
|------|-----------|--------|-------------|
| Light | `#F8F7FF` (80% opacity) | `#DDD6FE` (lavender-200) | Correct (already working) |
| Dark | `#1F2937` (80% opacity) | `#5B21B6` (lavender-800) | Correct (already working) |

## Testing Checklist

- [ ] Start dev server (`npm run dev`)
- [ ] Navigate to http://localhost:3000
- [ ] Verify light mode displays correctly (card should have light purple background)
- [ ] Click theme toggle button in Navbar
- [ ] Verify dark mode displays correctly (card should have dark gray background)
- [ ] Toggle back to light mode
- [ ] Verify hover effects work in both modes
- [ ] Verify all text is readable in both modes
- [ ] Verify transition animations are smooth

## Notes

- Other styles in FixedInfoCard (border, text colors) are already correctly implemented with dark mode variants
- No additional changes needed beyond the single background color fix
- The component already has `'use client'` directive and requires no architecture changes
