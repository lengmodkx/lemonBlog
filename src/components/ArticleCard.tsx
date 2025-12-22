'use client';

import Link from 'next/link';
import { formatDate } from '@/utils/date';
import BannerImage from '@/components/BannerImage';
import { Post } from '@/types/post';

interface ArticleCardProps {
  post: Post;
  className?: string;
}

export default function ArticleCard({ post, className = '' }: ArticleCardProps) {
  return (
    <article className={`group border-b border-gray-200 dark:border-gray-700 pb-8 last:border-b-0 ${className}`}>
      <Link href={`/blog/${post.slug}`} className="block">
        {/* Banner Image - 优化加载 */}
        <div className="mb-4 aspect-video">
          <BannerImage
            tags={post.tags || []}
            title={post.title}
            width={800}
            height={400}
            className="w-full rounded-lg"
            preferredSource="unsplash"
            showAttribution={false}
          />
        </div>

        {/* Meta Information */}
        <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-3">
          <span>Published on: {formatDate(post.date)}</span>
          <span className="mx-2">•</span>
          <span>5 mins read</span>
        </div>

        {/* Title */}
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
          {post.title}
        </h3>

        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-3">
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="text-xs text-gray-500 dark:text-gray-400"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* Description */}
        <p className="text-gray-600 dark:text-gray-300 mb-3 line-clamp-2">
          {post.description}
        </p>

        {/* Read More */}
        <div className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 text-sm font-medium">
          Read article →
        </div>
      </Link>
    </article>
  );
}