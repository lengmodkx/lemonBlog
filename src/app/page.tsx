import Link from 'next/link';
import { getLatestPosts } from '@/lib/posts';
import ArticleCard from '@/components/ArticleCard';
import { ArrowRight } from '@phosphor-icons/react/dist/ssr';

export const metadata = {
  title: 'Lemon Blog',
  description: 'Personal blog about web development, programming, and technology.',
};

export default function Home() {
  const latestPosts = getLatestPosts(5);
  const techStack = ['Java', 'Spring Boot', 'MySQL', 'Redis', 'Docker'];

  return (
    <div className="min-h-screen bg-background">
      <section className="max-w-5xl mx-auto px-6 pt-20 pb-16 md:pt-28 md:pb-20">
        <p className="text-sm text-muted-foreground mb-4">你好，我是</p>

        <h1 className="text-4xl md:text-6xl font-semibold text-foreground tracking-tight mb-6">
          lemon
        </h1>

        <p className="text-lg text-muted-foreground leading-relaxed max-w-xl mb-8">
          一名 Java 后端开发者，喜欢编程、阅读和分享知识。这个博客用于记录我的学习和思考。
        </p>

        <div className="flex flex-wrap gap-4">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-accent text-accent-foreground rounded-lg font-medium hover:bg-accent/90 transition-colors"
          >
            浏览文章
            <ArrowRight size={16} weight="bold" />
          </Link>
          <Link
            href="/about"
            className="inline-flex items-center px-5 py-2.5 bg-muted text-foreground rounded-lg font-medium hover:bg-muted/80 transition-colors"
          >
            关于我
          </Link>
        </div>
      </section>

      <section className="border-y border-border bg-card">
        <div className="max-w-5xl mx-auto px-6 py-6">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <span className="text-sm text-muted-foreground shrink-0">常用技术</span>
            <div className="flex flex-wrap gap-2">
              {techStack.map((tech) => (
                <span
                  key={tech}
                  className="px-3 py-1 text-sm rounded-full bg-background text-muted-foreground border border-border"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-6 py-16 md:py-20">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-semibold text-foreground tracking-tight">
            最新文章
          </h2>
          <Link
            href="/blog"
            className="text-sm text-muted-foreground hover:text-accent transition-colors inline-flex items-center gap-1"
          >
            全部文章
            <ArrowRight size={14} weight="bold" />
          </Link>
        </div>

        {latestPosts.length > 0 ? (
          <div>
            {latestPosts.map((post) => (
              <ArticleCard key={post.slug} post={post} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-card rounded-xl border border-border">
            <p className="text-muted-foreground">暂无文章</p>
          </div>
        )}
      </section>
    </div>
  );
}
