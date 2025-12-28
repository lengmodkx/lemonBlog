import Link from 'next/link';
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
      {/* Hero Section */}
      <section className="max-w-2xl mx-auto px-4 py-20 text-center">
        <div className="mb-8">
          <div className="w-20 h-20 bg-gradient-to-br from-lavender-400 to-lavender-600 rounded-full mx-auto mb-6 flex items-center justify-center shadow-lg ring-4 ring-lavender-100 dark:ring-lavender-900/30">
            <span className="text-white font-bold text-3xl">L</span>
          </div>
          <h1 className="text-3xl font-bold text-ink dark:text-text-primary mb-3">
            Hello, World
          </h1>
          <p className="text-ink-light dark:text-text-secondary text-base max-w-md mx-auto">
            热爱编程，专注于 Web 开发与技术分享
          </p>
        </div>

        <div className="flex justify-center gap-6 text-sm">
          <Link href="/blog" className="text-text-muted hover:text-primary transition-colors">
            文章
          </Link>
          <Link href="/about" className="text-text-muted hover:text-primary transition-colors">
            关于
          </Link>
        </div>
      </section>

      {/* Latest Posts */}
      <section className="max-w-2xl mx-auto px-4 pb-20">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-xl font-semibold text-ink dark:text-text-primary">
            最新文章
          </h2>
          <Link
            href="/blog"
            className="text-sm text-primary hover:text-primary-hover transition-colors"
          >
            查看全部 →
          </Link>
        </div>

        {latestPosts.length > 0 ? (
          <div className="space-y-4">
            {latestPosts.map((post) => (
              <ArticleCard key={post.slug} post={post} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-text-muted">暂无文章</p>
          </div>
        )}
      </section>
    </div>
  );
}
