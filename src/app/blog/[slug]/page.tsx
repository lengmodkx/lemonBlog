import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { getPostBySlug, getAllPosts } from '@/lib/posts';
import TableOfContents from '@/components/TableOfContents';
import ReadingProgress from '@/components/ReadingProgress';
import GiscusComments from '@/components/GiscusComments';
import ReviewPost from '@/components/review/ReviewPost';
import { ArrowLeft, Clock, Calendar } from '@phosphor-icons/react/dist/ssr';

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

  if (post.layout === 'review') {
    return <ReviewPost post={post} />;
  }

  const formattedDate = new Date(post.date).toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="min-h-screen bg-background">
      <ReadingProgress />

      <div className="max-w-5xl mx-auto px-6 py-12">
        <div className="flex gap-16">
          <article className="flex-1 max-w-2xl min-w-0">
            <Link
              href="/blog"
              className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-8 transition-colors"
            >
              <ArrowLeft size={14} weight="bold" />
              返回文章列表
            </Link>

            <header className="mb-10">
              <h1 className="text-3xl md:text-4xl font-semibold text-foreground leading-tight tracking-tight mb-6">
                {post.title}
              </h1>

              <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1.5">
                  <Calendar size={14} weight="regular" />
                  <time dateTime={post.date}>{formattedDate}</time>
                </div>
                <div className="flex items-center gap-1.5">
                  <Clock size={14} weight="regular" />
                  <span>{post.readingTime || 5} 分钟阅读</span>
                </div>
                {post.tags && post.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {post.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-accent text-xs px-2 py-0.5 rounded-full bg-accent/10"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </header>

            {post.coverImage && (
              <div className="relative w-full aspect-[16/9] mb-10 rounded-xl overflow-hidden border border-border">
                <Image
                  src={post.coverImage}
                  alt={post.title}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 900px"
                  className="object-cover"
                  priority
                />
              </div>
            )}

            <div
              className="markdown-content max-w-none"
              dangerouslySetInnerHTML={{ __html: post.content || '' }}
            />

            <footer className="mt-16 pt-8 border-t border-border">
              <p className="text-muted-foreground text-sm text-center">
                感谢阅读
              </p>
            </footer>

            <GiscusComments />
          </article>

          <TableOfContents content={post.content || ''} />
        </div>
      </div>
    </div>
  );
}
