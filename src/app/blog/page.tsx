import { getAllCategories, getPostsByCategory } from '@/lib/posts';
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
    <div className="min-h-screen bg-paper">
      <div className="max-w-3xl mx-auto px-6 py-12">
        <h1 className="font-hand text-3xl text-ink mb-8">
          所有文章
        </h1>

        <CategoryFilter
          categories={categories}
          selectedCategory={catParam}
        />

        {posts.length > 0 ? (
          <div>
            {posts.map((post) => (
              <ArticleCard key={post.slug} post={post} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-ink-light">暂无文章</p>
          </div>
        )}
      </div>
    </div>
  );
}
