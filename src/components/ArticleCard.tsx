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
