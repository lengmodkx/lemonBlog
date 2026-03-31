import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getPostBySlug, getAllPosts } from '@/lib/posts';
import TableOfContents from '@/components/TableOfContents';
import ReadingProgress from '@/components/ReadingProgress';
import GiscusComments from '@/components/GiscusComments';

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
    <div className="min-h-screen bg-paper">
      {/* Reading Progress Bar */}
      <ReadingProgress />
      <div className="max-w-5xl mx-auto px-6 py-12">
        <div className="flex gap-16">
          {/* Main Article Content */}
          <article className="flex-1 max-w-2xl">
            {/* Back Link */}
            <Link
              href="/blog"
              className="inline-flex items-center text-sm text-ink-light hover:text-ink mb-8 transition-colors"
            >
              ← 返回
            </Link>

            {/* Article Header */}
            <header className="mb-10">
              <h1 className="font-hand text-3xl md:text-4xl text-ink mb-6 leading-tight">
                {post.title}
              </h1>

              <div className="flex flex-wrap items-center gap-3 text-sm text-ink-light">
                <time dateTime={post.date}>
                  {new Date(post.date).toLocaleDateString('zh-CN', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </time>
                <span className="text-border">|</span>
                <span>{post.readingTime || 5} 分钟阅读</span>
                {post.tags && post.tags.length > 0 && (
                  <>
                    <span className="text-border">|</span>
                    <div className="flex gap-2">
                      {post.tags.map((tag) => (
                        <span key={tag} className="text-accent">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </header>

            {/* Divider */}
            <div className="w-16 h-px bg-accent mb-10" />

            {/* Article Content */}
            <div
              className="prose max-w-none"
              dangerouslySetInnerHTML={{ __html: post.content || '' }}
            />

            {/* Article Footer */}
            <footer className="mt-16 pt-8 border-t border-border">
              <p className="text-ink-light text-sm text-center">
                感谢阅读
              </p>
            </footer>

            {/* Comments Section */}
            <GiscusComments />
          </article>

          {/* Table of Contents */}
          <TableOfContents content={post.content || ''} />
        </div>
      </div>
    </div>
  );
}
