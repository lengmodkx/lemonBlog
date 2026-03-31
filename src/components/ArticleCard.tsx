import Link from 'next/link';
import type { Post } from '@/types/post';

interface ArticleCardProps {
  post: Post;
}

export default function ArticleCard({ post }: ArticleCardProps) {
  return (
    <article className="py-6 border-b border-border last:border-b-0">
      <Link
        href={`/blog/${post.slug}`}
        className="group block"
      >
        <div className="flex items-baseline gap-4 mb-2">
          <time
            dateTime={post.date}
            className="text-sm text-ink-light shrink-0 w-24"
          >
            {new Date(post.date).toLocaleDateString('zh-CN', {
              year: 'numeric',
              month: '2-digit',
              day: '2-digit',
            }).replace(/\//g, '.')}
          </time>

          <h3 className="text-lg font-medium text-ink group-hover:text-accent transition-colors">
            {post.title}
          </h3>
        </div>

        <p className="text-ink-light text-sm ml-28 line-clamp-1">
          {post.description}
        </p>
      </Link>
    </article>
  );
}
