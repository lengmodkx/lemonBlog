export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="mt-auto border-t border-border">
      <div className="max-w-3xl mx-auto px-6 py-8">
        {/* Content */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-ink-light">
            © {currentYear} lemon
          </p>

          {/* Social Links */}
          <div className="flex gap-6">
            <a
              href="https://github.com/lengmodkx"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-ink-light hover:text-accent transition-colors"
            >
              GitHub
            </a>
            <a
              href="https://twitter.com/DKX_LM"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-ink-light hover:text-accent transition-colors"
            >
              Twitter
            </a>
            <a
              href="https://t.me/lemon2Judy"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-ink-light hover:text-accent transition-colors"
            >
              Telegram
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
