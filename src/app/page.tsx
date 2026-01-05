import Link from 'next/link';
import { getLatestPosts } from '@/lib/posts';
import ArticleCard from '@/components/ArticleCard';
import FixedInfoCard from '@/components/FixedInfoCard';

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
      <section className="relative max-w-3xl mx-auto px-4 py-36">
        {/* Greeting */}
        <p className="text-primary font-medium mb-8 text-5xl lg:text-6xl">Howdy, fellow! 👋</p>

        {/* Main Content with Info and Fixed Card */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_20rem] items-stretch gap-0 lg:gap-28 mb-16">
          {/* Self Introduction */}
          <div className="flex flex-col">
            <h1 className="text-lg font-bold text-ink dark:text-text-primary mb-6 leading-tight">
              I&apos;m <span className="text-primary">lemon</span>
            </h1>
            <p className="text-text-secondary text-xl lg:text-2xl mb-12 leading-relaxed">
              Learner | Builder | Java Backend Developer
            </p>

            {/* Introduction */}
            <div className="space-y-5 text-text-secondary text-lg leading-relaxed">
              <p className="flex items-start gap-3">
                <span className="shrink-0 mt-1">•</span>
                <span>I&apos;m a learner, builder, and knowledge seeker.</span>
              </p>
              <p className="flex items-start gap-3">
                <span className="shrink-0 mt-1">•</span>
                <span>I live in China and work as a backend engineer.</span>
              </p>
              <p className="flex items-start gap-3">
                <span className="shrink-0 mt-1">•</span>
                <span>My first programming language was Java.</span>
              </p>
              <p className="flex items-start gap-3">
                <span className="shrink-0 mt-1">•</span>
                <span>I work mostly with Java technologies.</span>
              </p>
              <p className="flex items-start gap-3">
                <span className="shrink-0 mt-1">•</span>
                <span>I love coding, reading, and sharing knowledge.</span>
              </p>
              <p className="flex items-start gap-3">
                <span className="shrink-0 mt-1">•</span>
                <span>I started this blog to document and share my experience.</span>
              </p>
            </div>
          </div>

          {/* Fixed Info Card */}
          <FixedInfoCard />
        </div>

        {/* Tech Stack */}
        <div className="mb-12">
          <p className="text-base text-text-muted mb-5 flex items-center gap-2">
            <span>💻</span>
            <span>I work with:</span>
          </p>
          <div className="flex flex-wrap gap-3">
            {['Java', 'Spring Boot', 'MySQL', 'Redis', 'Docker', 'Python'].map((tech) => (
              <span
                key={tech}
                className="px-4 py-2 rounded-full bg-lavender-100 dark:bg-lavender-900/30 text-primary dark:text-lavender-400 text-base font-medium"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>

        {/* Quick Links */}
        <div className="flex flex-wrap gap-6 text-base">
          <Link href="/blog" className="text-text-muted hover:text-primary transition-colors flex items-center gap-2">
            <span>📝</span>
            <span>My writings</span>
          </Link>
          <Link href="/about" className="text-text-muted hover:text-primary transition-colors flex items-center gap-2">
            <span>👤</span>
            <span>About me</span>
          </Link>
          <a href="https://github.com/lengmodkx" target="_blank" rel="noopener noreferrer" className="text-text-muted hover:text-primary transition-colors flex items-center gap-2">
            <span>🔗</span>
            <span>GitHub</span>
          </a>
        </div>
      </section>

      {/* Divider */}
      <div className="max-w-3xl mx-auto px-4">
        <div className="h-px bg-gradient-to-r from-transparent via-lavender-300 dark:via-lavender-700 to-transparent" />
      </div>

      {/* Latest Posts */}
      <section className="max-w-3xl mx-auto px-4 py-20">
        <h2 className="text-2xl font-semibold text-ink dark:text-text-primary mb-10 flex items-center gap-2">
          <span>📚</span>
          <span>Latest posts</span>
        </h2>

        {latestPosts.length > 0 ? (
          <div className="space-y-10">
            {latestPosts.map((post) => (
              <ArticleCard key={post.slug} post={post} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-text-muted text-lg">No posts yet</p>
          </div>
        )}

        <div className="mt-12 text-center">
          <Link
            href="/blog"
            className="text-base text-primary hover:text-primary-hover transition-colors font-medium"
          >
            View all posts →
          </Link>
        </div>
      </section>

      {/* Footer Info */}
      <section className="max-w-3xl mx-auto px-4 pb-20">
        <div className="h-px bg-gradient-to-r from-transparent via-lavender-300 dark:via-lavender-700 to-transparent mb-12" />

        <div className="text-center space-y-4">
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
