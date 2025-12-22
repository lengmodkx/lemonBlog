# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Lemon Blog is a modern, static blog platform built with Next.js App Router and Tailwind CSS. It features:

- **Static Site Generation**: All blog posts are generated as static pages at build time
- **Markdown Content**: Articles are stored as Markdown files in `/content/articles`
- **Syntax Highlighting**: Code blocks with Prism.js syntax highlighting
- **Dark Mode**: Full dark/light mode support with system preference detection
- **Responsive Design**: Mobile-first design with Tailwind CSS
- **SEO Optimized**: Built-in metadata and OpenGraph support

## Development Commands

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm run start

# Lint code
npm run lint

# Fix linting issues
npm run lint:fix

# Type checking
npm run type-check

# Build and export static files
npm run export
```

## Project Architecture

### Directory Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── blog/              # Blog-related pages
│   │   ├── [slug]/        # Dynamic blog post pages
│   │   └── page.tsx       # Blog listing page
│   ├── layout.tsx         # Root layout with Navbar and Footer
│   └── page.tsx           # Homepage
├── components/            # Reusable React components
│   ├── Navbar.tsx         # Navigation with dark mode toggle
│   └── Footer.tsx         # Site footer
└── lib/                   # Utility functions and configurations
    ├── posts.ts           # Markdown processing utilities
    └── styles.css         # Custom styles for syntax highlighting

content/articles/          # Markdown blog posts
├── getting-started-with-react.md
├── understanding-javascript-closures.md
└── web-performance-optimization.md
```

### Key Files and Their Purpose

- **`src/lib/posts.ts`**: Core utilities for processing Markdown files, extracting frontmatter, and generating static paths
- **`src/app/blog/[slug]/page.tsx`**: Dynamic route handler for individual blog posts with static generation
- **`src/components/Navbar.tsx`**: Responsive navigation with mobile menu and dark mode toggle
- **`tailwind.config.ts`**: Tailwind configuration with custom typography and dark mode
- **`next.config.ts`**: Next.js configuration optimized for static export and Vercel deployment

## Content Management

### Adding New Blog Posts

1. Create a new `.md` file in `/content/articles/`
2. Include required frontmatter:
   ```yaml
   ---
   title: "Article Title"
   date: "YYYY-MM-DD"
   description: "Brief description"
   author: "Author Name"
   tags: ["tag1", "tag2"]
   ---
   ```
3. Write Markdown content with standard formatting
4. Images should be placed in `/public/images/` and referenced relatively

### Frontmatter Fields

- **title**: Required. The article title
- **date**: Required. Publication date (YYYY-MM-DD format)
- **description**: Required. Brief description for SEO and previews
- **author**: Required. Author name (defaults to "Anonymous")
- **tags**: Optional. Array of string tags for categorization

## Styling and Design

- **Tailwind CSS**: Utility-first CSS framework
- **Dark Mode**: Class-based dark mode with system preference detection
- **Typography**: Custom prose styles using @tailwindcss/typography
- **Responsive**: Mobile-first responsive design
- **Components**: Consistent design system with reusable components

## Deployment

The project is configured for one-click deployment to Vercel:

1. Push to GitHub
2. Connect repository to Vercel
3. Vercel automatically builds and deploys

### Build Configuration

- **Static Export**: `output: 'export'` in next.config.ts
- **Image Optimization**: Disabled for static export compatibility
- **Security Headers**: Configured for production security
- **Performance**: Optimized bundle splitting and compression

## Development Notes

### Working with Markdown

- Uses `gray-matter` for frontmatter parsing
- Uses `remark` and `rehype` for Markdown processing
- `rehype-prism-plus` provides syntax highlighting
- Code blocks support line numbers and theme switching

### State Management

- Dark mode preference stored in localStorage
- Theme state managed in Navbar component
- System preference detection on first load

### Performance Considerations

- All blog posts are statically generated at build time
- Images should be optimized before adding to content
- Use Next.js `<Image>` component for automatic optimization
- Lazy loading implemented for better performance

## Common Tasks

### Add a new blog post:
```bash
# Create new markdown file
touch content/articles/new-article.md

# Add frontmatter and content
# Build to test
npm run build
```

### Update styling:
- Modify tailwind.config.ts for design system changes
- Update components in src/components/
- Custom styles in src/lib/styles.css

### Deploy to production:
```bash
# Build and test locally
npm run build

# Deploy to Vercel (automatic on git push)
git add .
git commit -m "Deploy updates"
git push origin main
```

## Dependencies Key

- **Next.js**: React framework with App Router
- **Tailwind CSS**: Utility-first CSS framework
- **gray-matter**: Frontmatter parser for Markdown
- **remark/rehype**: Markdown processor ecosystem
- **rehype-prism-plus**: Syntax highlighting
- **date-fns**: Date formatting utilities