# Lemon Blog

A modern, static blog platform built with Next.js App Router and Tailwind CSS. Features Markdown-based content management, syntax highlighting, dark mode, and responsive design.

## ✨ Features

- 🚀 **Static Site Generation** - All blog posts are generated as static pages at build time
- 📝 **Markdown Content** - Articles are stored as Markdown files in `/content/articles`
- 🎨 **Syntax Highlighting** - Code blocks with Prism.js syntax highlighting
- 🌙 **Dark Mode** - Full dark/light mode support with system preference detection
- 📱 **Responsive Design** - Mobile-first design with Tailwind CSS
- 🔍 **SEO Optimized** - Built-in metadata and OpenGraph support
- ⚡ **Performance** - Optimized for fast loading times

## 🚀 Getting Started

### Prerequisites

- Node.js 18.0 or later
- npm, yarn, or pnpm

### Installation

1. Clone the repository:
```bash
git clone https://github.com/your-username/lemon-blog.git
cd lemon-blog
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📚 Content Management

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
3. Write your Markdown content
4. Save the file and rebuild to see your changes

### Frontmatter Fields

- **title**: Required. The article title
- **date**: Required. Publication date (YYYY-MM-DD format)
- **description**: Required. Brief description for SEO and previews
- **author**: Required. Author name (defaults to "Anonymous")
- **tags**: Optional. Array of string tags for categorization

## 🛠 Development

### Available Scripts

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
```

### Project Structure

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
└── lib/                   # Utility functions
    ├── posts.ts           # Markdown processing utilities
    └── styles.css         # Custom styles

content/articles/          # Markdown blog posts
├── getting-started-with-react.md
├── understanding-javascript-closures.md
└── web-performance-optimization.md
```

## 🚀 Deployment

### Deploy to Vercel

The easiest way to deploy is using Vercel:

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Vercel will automatically build and deploy your site

### Manual Deployment

1. Build the project:
```bash
npm run build
```

2. Deploy the `out` folder to your hosting provider

## 🎨 Customization

### Styling

The project uses Tailwind CSS for styling. You can customize:

- **Colors**: Modify `tailwind.config.ts`
- **Components**: Update components in `src/components/`
- **Typography**: Custom styles in `src/lib/styles.css`

### Adding New Features

- **New Pages**: Add to `src/app/` directory
- **Components**: Create in `src/components/`
- **Utilities**: Add to `src/lib/`

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📞 Support

If you have any questions or need help, please open an issue on GitHub.
