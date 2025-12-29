import Link from 'next/link';
import Image from 'next/image';
import { getLatestPosts, getAllPosts } from '@/lib/posts';
import ArticleCard from '@/components/ArticleCard';
import HoverInfoCard from '@/components/HoverInfoCard';

export const metadata = {
  title: 'Lemon Blog',
  description: 'Personal blog about web development, programming, and technology.',
};

export default function Home() {
  const latestPosts = getLatestPosts(6);
  const allPosts = getAllPosts();

  // Calculate blog statistics
  const stats = {
    postCount: allPosts.length,
    latestDate: allPosts.length > 0 ? allPosts[0].date : '-'
  };

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
        <p className="text-primary font-medium mb-4">👋 Howdy, fellow!</p>

        {/* Main Content with Avatar and Info Card */}
        <div className="flex flex-col sm:flex-row gap-8 mb-8">
          {/* Avatar */}
          <div className="relative w-28 h-28 shrink-0">
            <Image
              src="/images/avatar.jpg"
              alt="lemon"
              fill
              className="rounded-full object-cover shadow-lg"
            />
            <div className="absolute inset-0 rounded-full ring-4 ring-lavender-100 dark:ring-lavender-900/30" />
          </div>

          {/* Info Card - Wrapped with HoverInfoCard */}
          <HoverInfoCard stats={stats}>
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-ink dark:text-text-primary mb-2">
                I&apos;m <span className="text-primary">lemon</span>
              </h1>
              <p className="text-text-secondary text-sm mb-3">
                Learner | Builder | Java Backend Developer
              </p>
              <div className="space-y-1 text-xs text-text-muted">
                <p className="flex items-center gap-2">
                  <span>📍</span>
                  <span>China</span>
                </p>
                <p className="flex items-center gap-2">
                  <span>💼</span>
                  <span>Backend Development Engineer</span>
                </p>
              </div>
            </div>
          </HoverInfoCard>
        </div>

        {/* Introduction */}
        <div className="space-y-2 text-text-secondary mb-8 text-sm">
          <p className="flex items-start gap-2">
            <span className="shrink-0">•</span>
            <span>I&apos;m a learner, builder, and knowledge seeker.</span>
          </p>
          <p className="flex items-start gap-2">
            <span className="shrink-0">•</span>
            <span>I live in China and work as a backend engineer.</span>
          </p>
          <p className="flex items-start gap-2">
            <span className="shrink-0">•</span>
            <span>My first programming language was Java.</span>
          </p>
          <p className="flex items-start gap-2">
            <span className="shrink-0">•</span>
            <span>I work mostly with Java technologies.</span>
          </p>
          <p className="flex items-start gap-2">
            <span className="shrink-0">•</span>
            <span>I love coding, reading, and sharing knowledge.</span>
          </p>
          <p className="flex items-start gap-2">
            <span className="shrink-0">•</span>
            <span>I started this blog to document and share my experience.</span>
          </p>
        </div>

        {/* Tech Stack */}
        <div className="mb-8">
          <p className="text-sm text-text-muted mb-3 flex items-center gap-2">
            <span>💻</span>
            <span>I work with:</span>
          </p>
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
          <Link href="/blog" className="text-text-muted hover:text-primary transition-colors flex items-center gap-1">
            <span>📝</span>
            <span>My writings</span>
          </Link>
          <Link href="/about" className="text-text-muted hover:text-primary transition-colors flex items-center gap-1">
            <span>👤</span>
            <span>About me</span>
          </Link>
          <a href="https://github.com/lengmodkx" target="_blank" rel="noopener noreferrer" className="text-text-muted hover:text-primary transition-colors flex items-center gap-1">
            <span>🔗</span>
            <span>GitHub</span>
          </a>
        </div>
      </section>

      {/* Divider */}
      <div className="max-w-2xl mx-auto px-4">
        <div className="h-px bg-gradient-to-r from-transparent via-lavender-300 dark:via-lavender-700 to-transparent" />
      </div>

      {/* Latest Posts */}
      <section className="max-w-2xl mx-auto px-4 py-12">
        <h2 className="text-xl font-semibold text-ink dark:text-text-primary mb-6 flex items-center gap-2">
          <span>📚</span>
          <span>Latest posts</span>
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

        <div className="text-center space-y-3">
          <p className="text-text-muted text-sm">
            <span className="font-medium">lemon</span> | Java Backend Developer
          </p>
          <p className="text-xs text-text-muted flex items-center justify-center gap-1">
            <span>📍</span>
            <span>China · {new Date().getFullYear()}</span>
          </p>
          <div className="flex justify-center gap-4 text-xs text-text-muted">
            <a href="https://github.com/lengmodkx" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors flex items-center gap-1">
              <span>GitHub</span>
            </a>
            <span>•</span>
            <a href="https://twitter.com/DKX_LM" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors flex items-center gap-1">
              <span>Twitter</span>
            </a>
            <span>•</span>
            <a href="https://t.me/lemon2Judy" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors flex items-center gap-1">
              <span>Telegram</span>
            </a>
            <span>•</span>
            <a href="mailto:lengmodkx@gmail.com" className="hover:text-primary transition-colors flex items-center gap-1">
              <span>Email</span>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
