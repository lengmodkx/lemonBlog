import Link from 'next/link';
import Image from 'next/image';
import { getLatestPosts } from '@/lib/posts';
import ArticleCard from '@/components/ArticleCard';

export const metadata = {
  title: 'Lemon Blog',
  description: 'Personal blog about web development, programming, and technology.',
};

export default function Home() {
  const latestPosts = getLatestPosts(6);

  return (
    <div className="min-h-screen bg-paper-50 dark:bg-ink-DEFAULT">
      {/* Decorative Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[40%] h-[40%] rounded-full bg-lavender-200/30 dark:bg-lavender-900/20 blur-[120px]" />
        <div className="absolute top-[30%] right-[-15%] w-[35%] h-[35%] rounded-full bg-purple-200/20 dark:bg-purple-900/20 blur-[100px]" />
        <div className="absolute bottom-[-20%] left-[20%] w-[30%] h-[30%] rounded-full bg-pink-200/20 dark:bg-pink-900/20 blur-[80px]" />
      </div>

      {/* Hero Section */}
      <section className="relative max-w-2xl mx-auto px-4 py-20">
        {/* Greeting */}
        <p className="text-primary font-medium mb-4">Howdy, fellow!</p>

        {/* Avatar */}
        <div className="relative w-24 h-24 mb-8">
          <Image
            src="/images/avatar.jpg"
            alt="lemon"
            fill
            className="rounded-full object-cover shadow-lg"
          />
          <div className="absolute inset-0 rounded-full ring-4 ring-lavender-100 dark:ring-lavender-900/30" />
        </div>

        {/* Introduction */}
        <h1 className="text-4xl font-bold text-ink dark:text-text-primary mb-4">
          I&apos;m <span className="text-primary">lemon</span> - a Java backend developer
        </h1>

        <div className="space-y-3 text-text-secondary mb-8">
          <p>• I&apos;m a learner, builder, and knowledge seeker.</p>
          <p>• I live in China and work as a backend engineer.</p>
          <p>• My first programming language was Java.</p>
          <p>• I work mostly with Java technologies.</p>
          <p>• I love coding, reading, and sharing knowledge.</p>
          <p>• I started this blog to document and share my experience.</p>
        </div>

        {/* Tech Stack */}
        <div className="mb-8">
          <p className="text-sm text-text-muted mb-2">I work with:</p>
          <div className="flex flex-wrap gap-2">
            {['Java', 'Spring Boot', 'MySQL', 'Redis', 'Docker', 'Python'].map((tech) => (
              <span
                key={tech}
                className="px-3 py-1 rounded-full bg-lavender-100 dark:bg-lavender-900/30 text-primary dark:text-lavender-400 text-sm"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>

        {/* Quick Links */}
        <div className="flex flex-wrap gap-4 text-sm">
          <Link href="/blog" className="text-text-muted hover:text-primary transition-colors">
            → My writings
          </Link>
          <Link href="/about" className="text-text-muted hover:text-primary transition-colors">
            → About me & this blog
          </Link>
          <a href="https://github.com/lengmodkx" target="_blank" rel="noopener noreferrer" className="text-text-muted hover:text-primary transition-colors">
            → GitHub
          </a>
        </div>
      </section>

      {/* Divider */}
      <div className="max-w-2xl mx-auto px-4">
        <div className="h-px bg-gradient-to-r from-transparent via-lavender-300 dark:via-lavender-700 to-transparent" />
      </div>

      {/* Latest Posts */}
      <section className="max-w-2xl mx-auto px-4 py-12">
        <h2 className="text-xl font-semibold text-ink dark:text-text-primary mb-6">
          Latest posts
        </h2>

        {latestPosts.length > 0 ? (
          <div className="space-y-6">
            {latestPosts.map((post) => (
              <ArticleCard key={post.slug} post={post} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-text-muted">No posts yet</p>
          </div>
        )}

        <div className="mt-8 text-center">
          <Link
            href="/blog"
            className="text-sm text-primary hover:text-primary-hover transition-colors"
          >
            View all posts →
          </Link>
        </div>
      </section>

      {/* Footer Info */}
      <section className="max-w-2xl mx-auto px-4 pb-12">
        <div className="h-px bg-gradient-to-r from-transparent via-lavender-300 dark:via-lavender-700 to-transparent mb-8" />

        <div className="text-center space-y-2">
          <p className="text-text-muted text-sm">
            <span className="font-medium">lemon</span> | Java Backend Developer
          </p>
          <p className="text-xs text-text-muted">
            China · {new Date().getFullYear()}
          </p>
          <div className="flex justify-center gap-4 text-xs text-text-muted">
            <a href="https://github.com/lengmodkx" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">
              GitHub
            </a>
            <a href="https://twitter.com/DKX_LM" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">
              Twitter
            </a>
            <a href="https://t.me/lemon2Judy" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">
              Telegram
            </a>
            <a href="mailto:lengmodkx@gmail.com" className="hover:text-primary transition-colors">
              Email
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
