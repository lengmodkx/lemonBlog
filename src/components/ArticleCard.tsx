import Link from 'next/link';
import type { Post } from '@/types/post';

interface ArticleCardProps {
  post: Post;
}

export default function ArticleCard({ post }: ArticleCardProps) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group block bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm hover:shadow-lg transition-all duration-200 hover:-translate-y-1"
    >
      {post.tags && post.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-3">
          {post.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="text-xs px-2 py-1 rounded-full bg-paper-100 dark:bg-gray-700 text-accent dark:text-accent-dark"
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      <h3 className="text-xl font-semibold text-ink dark:text-text-primary mb-2 line-clamp-2 group-hover:text-accent dark:group-hover:text-accent-dark transition-colors">
        {post.title}
      </h3>

      <p className="text-ink-light dark:text-text-secondary line-clamp-3 mb-4">
        {post.description || post.excerpt || ''}
      </p>

      <div className="flex items-center gap-4 text-sm text-muted">
        <time dateTime={post.date}>
          {new Date(post.date).toLocaleDateString('zh-CN', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}
        </time>
        <span>·</span>
        <span>{post.readingTime || 5} 分钟阅读</span>
      </div>
    </Link>
  );
}
