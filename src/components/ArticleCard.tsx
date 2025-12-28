import Link from 'next/link';
import type { Post } from '@/types/post';

interface ArticleCardProps {
  post: Post;
}

export default function ArticleCard({ post }: ArticleCardProps) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group block bg-card rounded-xl p-6 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 hover:border-l-4 hover:border-lavender-500"
    >
      {post.tags && post.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-3">
          {post.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="text-xs px-2 py-1 rounded-full bg-lavender-100 dark:bg-lavender-900/30 text-primary dark:text-lavender-400"
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      <h3 className="text-xl font-semibold text-ink dark:text-text-primary mb-2 line-clamp-2 group-hover:text-primary dark:group-hover:text-primary transition-colors">
        {post.title}
      </h3>

      <p className="text-ink-light dark:text-text-secondary line-clamp-2 mb-4 text-sm">
        {post.description || post.excerpt || ''}
      </p>

      <div className="flex items-center gap-4 text-xs text-text-muted">
        <time dateTime={post.date}>
          {new Date(post.date).toLocaleDateString('zh-CN', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
          })}
        </time>
        <span>·</span>
        <span>{post.readingTime || 5} 分钟阅读</span>
      </div>
    </Link>
  );
}
