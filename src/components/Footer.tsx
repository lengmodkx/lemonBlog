export default function Footer() {
  return (
    <footer className="border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted">
            © {new Date().getFullYear()} Lemon Blog. All rights reserved.
          </p>
          <div className="flex gap-6 text-sm text-muted">
            <a href="https://github.com" className="hover:text-accent dark:hover:text-accent-dark transition-colors">
              GitHub
            </a>
            <a href="https://twitter.com" className="hover:text-accent dark:hover:text-accent-dark transition-colors">
              Twitter
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}