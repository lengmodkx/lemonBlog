import Link from 'next/link';
import { getLatestPosts } from '@/lib/posts';
import ArticleCard from '@/components/ArticleCard';

export const metadata = {
  title: 'Lemon Blog',
  description: 'Personal blog about web development, programming, and technology.',
};

export default function Home() {
  const latestPosts = getLatestPosts(5);

  return (
    <div className="min-h-screen bg-paper">
      {/* Hero Section */}
      <section className="max-w-3xl mx-auto px-6 py-16 md:py-24">
        {/* Simple Greeting */}
        <p className="text-ink-light text-sm mb-4">你好，我是</p>

        <h1 className="font-hand text-5xl md:text-6xl text-ink mb-6">
          lemon
        </h1>

        <p className="text-ink-light text-lg mb-10 leading-relaxed max-w-lg">
          一名 Java 后端开发者，喜欢编程、阅读和分享知识。
          这个博客用于记录我的学习和思考。
        </p>

        {/* Tech Stack */}
        <div className="flex flex-wrap gap-2 mb-10">
          {['Java', 'Spring Boot', 'MySQL', 'Redis', 'Docker'].map((tech) => (
            <span
              key={tech}
              className="px-3 py-1 text-sm text-ink-light border border-border rounded-sm bg-paper-dark"
            >
              {tech}
            </span>
          ))}
        </div>

        {/* Quick Links */}
        <div className="flex flex-wrap gap-6 text-sm">
          <Link href="/blog" className="text-accent hover:text-accent-muted transition-colors font-medium">
            文章 →
          </Link>
          <Link href="/about" className="text-accent hover:text-accent-muted transition-colors font-medium">
            关于 →
          </Link>
          <a
            href="https://github.com/lengmodkx"
            target="_blank"
            rel="noopener noreferrer"
            className="text-accent hover:text-accent-muted transition-colors font-medium"
          >
            GitHub →
          </a>
        </div>
      </section>

      {/* Divider */}
      <div className="max-w-3xl mx-auto px-6">
        <div className="h-px bg-border" />
      </div>

      {/* Latest Posts */}
      <section className="max-w-3xl mx-auto px-6 py-12">
        <h2 className="font-hand text-2xl text-ink mb-8">
          最新文章
        </h2>

        {latestPosts.length > 0 ? (
          <div>
            {latestPosts.map((post) => (
              <ArticleCard key={post.slug} post={post} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-ink-light">暂无文章</p>
          </div>
        )}

        <div className="mt-8 text-center">
          <Link
            href="/blog"
            className="text-sm text-accent hover:text-accent-muted transition-colors"
          >
            查看全部文章 →
          </Link>
        </div>
      </section>
    </div>
  );
}
