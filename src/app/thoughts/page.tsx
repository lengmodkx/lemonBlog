import Link from 'next/link';
import { ArrowLeft, ArrowRight, Lightbulb, ArrowUpRight } from '@phosphor-icons/react/dist/ssr';
import { remark } from 'remark';
import remarkGfm from 'remark-gfm';
import remarkRehype from 'remark-rehype';
import rehypeStringify from 'rehype-stringify';
import { getThoughtsPaginated, THOUGHTS_PER_PAGE, Thought } from '@/lib/thoughts';
import { formatDate } from '@/utils/date';

/** Render thought markdown to HTML. */
async function renderMarkdown(md: string): Promise<string> {
  const out = await remark()
    .use(remarkGfm)
    .use(remarkRehype, { allowDangerousHtml: true })
    .use(rehypeStringify, { allowDangerousHtml: true })
    .process(md);
  return out.toString();
}

export const metadata = {
  title: 'Thoughts',
  description: 'Random thoughts, ideas, and reflections',
};

interface PageProps {
  searchParams: Promise<{ page?: string }>;
}

export default async function ThoughtsPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const requestedPage = parseInt(params.page || '1', 10);
  const { thoughts, currentPage, totalPages, totalThoughts } = getThoughtsPaginated(requestedPage);

  const showPagination = totalPages > 1;
  const hasPrev = currentPage > 1;
  const hasNext = currentPage < totalPages;

  // Pre-render markdown for each thought so list and detail pages match.
  const items: Array<Thought & { contentHtml: string }> = await Promise.all(
    thoughts.map(async (t) => ({
      ...t,
      contentHtml: await renderMarkdown(t.content),
    })),
  );

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-2xl mx-auto px-6 py-16 md:py-20">
        <Link
          href="/"
          className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-10 transition-colors"
        >
          <ArrowLeft size={14} weight="bold" />
          Back to home
        </Link>

        <h1 className="text-3xl md:text-4xl font-semibold text-foreground tracking-tight mb-3">
          Thoughts
        </h1>
        <p className="text-muted-foreground mb-10 leading-relaxed">
          Random thoughts, ideas, and reflections — captured as they come.
        </p>

        {items.length > 0 ? (
          <>
            <ol className="relative border-l border-border ml-2">
              {items.map((thought) => (
                <li key={thought.slug} className="relative pl-6 pb-10 last:pb-0">
                  <span className="absolute -left-[5px] top-1.5 flex h-2.5 w-2.5 rounded-full bg-accent ring-4 ring-background" />
                  <div className="flex items-baseline gap-3 flex-wrap">
                    <time className="text-sm text-muted-foreground">
                      {formatDate(thought.date)}
                    </time>
                    <Link
                      href={`/thoughts/${thought.slug}`}
                      className="inline-flex items-center gap-0.5 text-xs text-muted-foreground hover:text-accent transition-colors"
                      aria-label={`Open thought ${thought.date} as a page`}
                    >
                      Open
                      <ArrowUpRight size={12} weight="bold" />
                    </Link>
                  </div>
                  {thought.title && (
                    <h2 className="mt-2 text-lg font-medium text-foreground">
                      <Link
                        href={`/thoughts/${thought.slug}`}
                        className="hover:text-accent transition-colors"
                      >
                        {thought.title}
                      </Link>
                    </h2>
                  )}
                  <div
                    className="mt-2 text-foreground leading-relaxed [&_p]:my-4 first:[&_p]:mt-0 last:[&_p]:mb-0"
                    dangerouslySetInnerHTML={{ __html: thought.contentHtml }}
                  />
                </li>
              ))}
            </ol>

            {showPagination && (
              <nav className="mt-10 flex items-center justify-between text-sm">
                {hasPrev ? (
                  <Link
                    href={`/thoughts?page=${currentPage - 1}`}
                    className="inline-flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <ArrowLeft size={14} weight="bold" />
                    Newer
                  </Link>
                ) : (
                  <span />
                )}
                <span className="text-muted-foreground">
                  Page {currentPage} of {totalPages} · {totalThoughts} total
                </span>
                {hasNext ? (
                  <Link
                    href={`/thoughts?page=${currentPage + 1}`}
                    className="inline-flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Older
                    <ArrowRight size={14} weight="bold" />
                  </Link>
                ) : (
                  <span />
                )}
              </nav>
            )}
            {!showPagination && totalThoughts > 0 && (
              <p className="mt-10 text-xs text-muted-foreground text-center">
                {totalThoughts} {totalThoughts === 1 ? 'thought' : 'thoughts'} · {THOUGHTS_PER_PAGE} per page when more are added
              </p>
            )}
          </>
        ) : (
          <div className="text-center py-16 bg-card rounded-xl border border-border">
            <Lightbulb size={32} className="mx-auto mb-3 text-muted-foreground" />
            <p className="text-muted-foreground">No thoughts yet</p>
          </div>
        )}
      </div>
    </div>
  );
}
