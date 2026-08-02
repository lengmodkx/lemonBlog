import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Calendar, Clock } from '@phosphor-icons/react/dist/ssr';
import { getAllThoughts, getThoughtBySlug } from '@/lib/thoughts';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return getAllThoughts().map((thought) => ({
    slug: thought.slug,
  }));
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const thought = await getThoughtBySlug(slug);
  if (!thought) {
    return { title: 'Thought not found' };
  }
  return {
    title: thought.title || `Thought — ${thought.date}`,
    description: thought.excerpt,
  };
}

export default async function ThoughtDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const thought = await getThoughtBySlug(slug);
  if (!thought) notFound();

  const formattedDate = new Date(thought.date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-2xl mx-auto px-6 py-16 md:py-20">
        <Link
          href="/thoughts"
          className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-10 transition-colors"
        >
          <ArrowLeft size={14} weight="bold" />
          Back to thoughts
        </Link>

        <article>
          <header className="mb-8">
            {thought.title && (
              <h1 className="text-3xl md:text-4xl font-semibold text-foreground tracking-tight mb-4">
                {thought.title}
              </h1>
            )}
            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1.5">
                <Calendar size={14} weight="regular" />
                <time dateTime={thought.date}>{formattedDate}</time>
              </div>
              {thought.readingTime !== undefined && (
                <div className="flex items-center gap-1.5">
                  <Clock size={14} weight="regular" />
                  <span>{thought.readingTime} min read</span>
                </div>
              )}
              {thought.tags && thought.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {thought.tags.map((tag) => (
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

          <div
            className="markdown-content prose prose-neutral dark:prose-invert max-w-none text-foreground leading-relaxed [&_p]:my-4 [&_h1]:text-2xl [&_h2]:text-xl [&_h3]:text-lg [&_blockquote]:border-l-4 [&_blockquote]:border-border [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:text-muted-foreground [&_ul]:list-disc [&_ol]:list-decimal [&_li]:my-1 [&_a]:text-accent [&_a]:underline [&_code]:bg-muted [&_code]:px-1 [&_code]:rounded"
            dangerouslySetInnerHTML={{ __html: thought.contentHtml || '' }}
          />
        </article>
      </div>
    </div>
  );
}
