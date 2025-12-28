export default function Footer() {
  return (
    <footer className="border-t border-lavender-200 dark:border-lavender-800 bg-white dark:bg-ink-DEFAULT">
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-sm text-text-muted">
            © {new Date().getFullYear()} Lemon Blog
          </p>
          <div className="flex gap-6 text-sm">
            <a
              href="https://github.com"
              className="text-text-muted hover:text-primary transition-colors"
            >
              GitHub
            </a>
            <a
              href="https://twitter.com"
              className="text-text-muted hover:text-primary transition-colors"
            >
              Twitter
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
