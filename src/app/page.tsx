import Link from 'next/link';
import { getLatestPosts } from '@/lib/posts';
import ArticleCard from '@/components/ArticleCard';

export const metadata = {
  title: 'Lemon Blog',
  description: 'Personal blog about web development, programming, and technology.',
};

export default function Home() {
  const latestPosts = getLatestPosts(9); // 获取最多9篇文章

  return (
    <div className="min-h-screen bg-paper-50 dark:bg-ink-DEFAULT">
      {/* Hero Section */}
      <section className="max-w-4xl mx-auto px-4 py-20 text-center">
        <div className="mb-8">
          <div className="w-24 h-24 bg-gradient-to-br from-accent to-accent-hover rounded-full mx-auto mb-6 flex items-center justify-center shadow-lg">
            <span className="text-white font-bold text-4xl">L</span>
          </div>
          <h1 className="text-4xl font-bold text-ink dark:text-text-primary mb-4">
            你好，我是 Lemon
          </h1>
          <p className="text-lg text-ink-light dark:text-text-secondary max-w-2xl mx-auto">
            热爱编程，专注于 Web 开发与技术分享
          </p>
        </div>

        <div className="flex justify-center gap-6 text-sm text-muted">
          <Link href="/blog" className="hover:text-accent dark:hover:text-accent-dark transition-colors">
            文章
          </Link>
          <Link href="/about" className="hover:text-accent dark:hover:text-accent-dark transition-colors">
            关于
          </Link>
        </div>
      </section>

      {/* Latest Posts Grid */}
      <section className="max-w-6xl mx-auto px-4 pb-20">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold text-ink dark:text-text-primary">
            最新文章
          </h2>
          <Link
            href="/blog"
            className="text-accent dark:text-accent-dark hover:text-accent-hover dark:hover:text-accent-darkHover text-sm font-medium"
          >
            查看全部 →
          </Link>
        </div>

        {latestPosts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {latestPosts.map((post) => (
              <ArticleCard key={post.slug} post={post} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="text-muted text-lg">暂无文章</p>
          </div>
        )}
      </section>
    </div>
  );
}
