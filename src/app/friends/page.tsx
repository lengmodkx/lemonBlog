import Link from 'next/link';
import { ArrowLeft, ArrowUpRight } from '@phosphor-icons/react/dist/ssr';

export const metadata = {
  title: 'Friends',
  description: 'Blogs from friends',
};

const friendLinks = [
  { name: 'cxhello', href: 'https://cxhello.top/about', description: "Java backend developer's tech blog" },
];

export default function FriendsPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-2xl mx-auto px-6 py-16 md:py-20">
        <Link
          href="/"
          className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-10 transition-colors"
        >
          <ArrowLeft size={14} weight="bold" />
          Back to home
        </Link>

        <h1 className="text-3xl md:text-4xl font-semibold text-foreground tracking-tight mb-3">
          Friends
        </h1>
        <p className="text-muted-foreground mb-10 leading-relaxed">
          A few blogs from friends. Feel free to explore and connect.
        </p>

        <div className="grid gap-4">
          {friendLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center justify-between p-5 rounded-xl border border-border bg-card hover:border-accent transition-colors"
            >
              <div>
                <h2 className="font-medium text-foreground group-hover:text-accent transition-colors">
                  {link.name}
                </h2>
                {link.description && (
                  <p className="text-sm text-muted-foreground mt-1">
                    {link.description}
                  </p>
                )}
                <p className="text-xs text-muted-foreground mt-2">
                  {link.href}
                </p>
              </div>
              <ArrowUpRight
                size={20}
                weight="bold"
                className="text-muted-foreground group-hover:text-accent transition-colors shrink-0 ml-4"
              />
            </a>
          ))}
        </div>

        <div className="mt-12 p-4 rounded-xl bg-muted border border-border text-sm text-muted-foreground">
          <p>
            Want to exchange links? Reach me by{' '}
            <a
              href="mailto:lengmodkx@gmail.com"
              className="text-foreground hover:text-accent transition-colors"
            >
              email
            </a>
            .
          </p>
        </div>
      </div>
    </div>
  );
}
