import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getPostBySlug, getAllPosts } from '@/lib/posts';

interface BlogPostPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateStaticParams() {
  const posts = getAllPosts();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({ params }: BlogPostPageProps) {
  const resolvedParams = await params;
  const post = await getPostBySlug(resolvedParams.slug);

  if (!post) {
    return {
      title: 'Post not found',
    };
  }

  return {
    title: post.title,
    description: post.description,
    openGraph: {
      title: post.title,
      description: post.description,
      type: 'article',
      publishedTime: post.date,
      authors: [post.author],
      tags: post.tags,
    },
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const resolvedParams = await params;
  const post = await getPostBySlug(resolvedParams.slug);

  if (!post) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-paper-50 dark:bg-ink-DEFAULT">
      <article className="max-w-3xl mx-auto px-4 py-12">
        {/* Back Link */}
        <Link
          href="/blog"
          className="inline-flex items-center text-sm text-muted hover:text-accent dark:hover:text-accent-dark mb-8 transition-colors"
        >
          ← 返回博客
        </Link>

        {/* Article Header */}
        <header className="mb-12">
          <h1 className="text-5xl font-bold text-ink dark:text-text-primary mb-6 leading-tight">
            {post.title}
          </h1>

          <div className="flex flex-wrap items-center gap-4 text-sm text-muted">
            <time dateTime={post.date}>
              {new Date(post.date).toLocaleDateString('zh-CN', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </time>
            <span>·</span>
            <span>{post.readingTime || 5} 分钟阅读</span>
            {post.tags && post.tags.length > 0 && (
              <>
                <span>·</span>
                <div className="flex gap-2">
                  {post.tags.map((tag) => (
                    <span key={tag} className="text-accent dark:text-accent-dark">
                      #{tag}
                    </span>
                  ))}
                </div>
              </>
            )}
          </div>
        </header>

        {/* Article Content */}
        <div
          className="prose prose-lg dark:prose-invert max-w-none
            prose-headings:text-ink dark:prose-headings:text-text-primary
            prose-p:text-ink-light dark:prose-p:text-text-secondary
            prose-p:leading-relaxed
            prose-a:text-accent dark:prose-a:text-accent-dark
            prose-strong:text-ink dark:prose-strong:text-text-primary
            prose-code:text-accent dark:prose-code:text-accent-dark
            prose-pre:bg-paper-100 dark:prose-pre:bg-gray-900
            prose-img:rounded-lg"
          dangerouslySetInnerHTML={{ __html: post.content || '' }}
        />

        {/* Article Footer */}
        <footer className="mt-16 pt-8 border-t border-gray-200 dark:border-gray-700">
          <p className="text-muted text-sm">
            感谢阅读！如有问题或建议，欢迎留言讨论。
          </p>
        </footer>
      </article>
    </div>
  );
}