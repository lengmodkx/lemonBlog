export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="mt-auto">
      <div className="max-w-2xl mx-auto px-4 py-8">
        {/* Divider */}
        <div className="h-px bg-gradient-to-r from-transparent via-lavender-300 dark:via-lavender-700 to-transparent mb-6" />

        {/* Content */}
        <div className="flex flex-col items-center gap-4">
          <p className="text-sm text-text-muted">
            © {currentYear} lemon. All rights reserved.
          </p>

          {/* Social Links */}
          <div className="flex gap-6">
            <a
              href="https://github.com/lengmodkx"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-text-muted hover:text-primary transition-colors"
            >
              GitHub
            </a>
            <a
              href="https://twitter.com/DKX_LM"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-text-muted hover:text-primary transition-colors"
            >
              Twitter
            </a>
            <a
              href="https://t.me/lemon2Judy"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-text-muted hover:text-primary transition-colors"
            >
              Telegram
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
