import Link from 'next/link';
import { Sparkle } from '@phosphor-icons/react/dist/ssr';
import type { Post } from '@/types/post';

interface ArticleCardProps {
  post: Post;
}

export default function ArticleCard({ post }: ArticleCardProps) {
  const formattedDate = new Date(post.date).toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).replace(/\//g, '.');

  return (
    <article className="group py-6 border-b border-border last:border-b-0">
      <Link href={`/blog/${post.slug}`} className="block">
        <div className="flex flex-col sm:flex-row sm:items-baseline gap-2 sm:gap-4 mb-2">
          <time
            dateTime={post.date}
            className="text-xs font-medium text-muted-foreground shrink-0"
          >
            {formattedDate}
          </time>

          <h3 className="text-lg font-semibold text-foreground group-hover:text-accent transition-colors tracking-tight">
            {post.title}
          </h3>

          {post.layout === 'review' && (
            <span className="inline-flex items-center gap-1 self-start text-xs font-medium text-accent bg-accent/10 px-2 py-0.5 rounded-full">
              <Sparkle size={12} weight="fill" />
              回顾
            </span>
          )}
        </div>

        <p className="text-muted-foreground text-sm line-clamp-2 sm:pl-[4.5rem]">
          {post.description}
        </p>

        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-3 sm:pl-[4.5rem]">
            {post.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="px-2 py-0.5 text-xs rounded-full bg-muted text-muted-foreground"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </Link>
    </article>
  );
}
