import { getAllPosts, getAllCategories, getPostsByCategory } from '@/lib/posts';
import ArticleCard from '@/components/ArticleCard';
import CategoryFilter from '@/components/CategoryFilter';

export const metadata = {
  title: '博客 | Lemon Blog',
  description: '所有文章',
};

export default async function BlogPage({
  searchParams,
}: {
  searchParams: Promise<{ cat?: string }>;
}) {
  const params = await searchParams;
  const catParam = params.cat;

  const posts = getPostsByCategory(catParam);
  const categories = getAllCategories();

  return (
    <div className="min-h-screen bg-paper-50 dark:bg-ink-DEFAULT">
      <div className="max-w-2xl mx-auto px-4 py-12">
        <h1 className="text-2xl font-bold text-ink dark:text-text-primary mb-8">
          所有文章
        </h1>

        <CategoryFilter
          categories={categories}
          selectedCategory={catParam}
        />

        {posts.length > 0 ? (
          <div className="space-y-4">
            {posts.map((post) => (
              <ArticleCard key={post.slug} post={post} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-text-muted">暂无文章</p>
          </div>
        )}
      </div>
    </div>
  );
}
