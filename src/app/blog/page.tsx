import { getAllPosts } from '@/lib/posts';
import ArticleCard from '@/components/ArticleCard';

export const metadata = {
  title: '博客 | Lemon Blog',
  description: '所有文章',
};

export default function BlogPage() {
  const posts = getAllPosts();

  return (
    <div className="min-h-screen bg-paper-50 dark:bg-ink-DEFAULT">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-ink dark:text-text-primary mb-8">
          所有文章
        </h1>

        {posts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post) => (
              <ArticleCard key={post.slug} post={post} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="text-muted text-lg">暂无文章</p>
          </div>
        )}
      </div>
    </div>
  );
}