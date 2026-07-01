export default function Footer() {
  const currentYear = new Date().getFullYear();

  const socialLinks = [
    { name: 'GitHub', href: 'https://github.com/lengmodkx' },
    { name: 'Twitter', href: 'https://twitter.com/DKX_LM' },
    { name: 'Telegram', href: 'https://t.me/lemon2Judy' },
    { name: 'Analytics', href: 'https://cloud.umami.is/share/zpSFsgjbd68Fuk3l' },
  ];

  return (
    <footer className="mt-auto border-t border-border">
      <div className="max-w-5xl mx-auto px-6 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            © {currentYear} lemon. All rights reserved.
          </p>

          <div className="flex items-center gap-6">
            {socialLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                {link.name}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
