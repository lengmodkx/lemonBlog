import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getPostBySlug, getAllPosts } from '@/lib/posts';
import TableOfContents from '@/components/TableOfContents';

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

  if (!post) return { title: 'Post not found' };

  return {
    title: post.title,
    description: post.description,
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const resolvedParams = await params;
  const post = await getPostBySlug(resolvedParams.slug);

  if (!post) notFound();

  return (
    <div className="min-h-screen bg-paper-50 dark:bg-ink-DEFAULT">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="flex gap-8">
          {/* Main Article Content */}
          <article className="flex-1 max-w-2xl">
            {/* Back Link */}
            <Link
              href="/blog"
              className="inline-flex items-center text-sm text-text-muted hover:text-primary mb-8 transition-colors"
            >
              ← 返回
            </Link>

            {/* Article Header */}
            <header className="mb-10">
              <h1 className="text-3xl font-bold text-ink dark:text-text-primary mb-4 leading-tight">
                {post.title}
              </h1>

              <div className="flex flex-wrap items-center gap-3 text-sm text-text-muted">
                <time dateTime={post.date}>
                  {new Date(post.date).toLocaleDateString('zh-CN', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </time>
                <span>·</span>
                <span>{post.readingTime || 5} 分钟</span>
                {post.tags && post.tags.length > 0 && (
                  <>
                    <span>·</span>
                    <div className="flex gap-2">
                      {post.tags.map((tag) => (
                        <span key={tag} className="text-primary">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </header>

            {/* Divider */}
            <div className="w-12 h-1 bg-gradient-to-r from-lavender-400 to-lavender-600 rounded-full mb-10" />

            {/* Article Content */}
            <div
              className="prose dark:prose-invert max-w-none"
              dangerouslySetInnerHTML={{ __html: post.content || '' }}
            />

            {/* Article Footer */}
            <footer className="mt-12 pt-8 border-t border-lavender-200 dark:border-lavender-800">
              <p className="text-text-muted text-sm text-center">
                感谢阅读
              </p>
            </footer>
          </article>

          {/* Table of Contents */}
          <TableOfContents content={post.content || ''} />
        </div>
      </div>
    </div>
  );
}
