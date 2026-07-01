import { getAllCategories, getPostsByCategory } from '@/lib/posts';
import ArticleCard from '@/components/ArticleCard';
import CategoryFilter from '@/components/CategoryFilter';

export const metadata = {
  title: 'Blog',
  description: 'All posts',
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
    <div className="min-h-screen bg-background">
      <div className="max-w-5xl mx-auto px-6 py-16 md:py-20">
        <header className="mb-10">
          <h1 className="text-3xl md:text-4xl font-semibold text-foreground tracking-tight mb-3">
            All posts
          </h1>
          <p className="text-muted-foreground max-w-xl">
            Notes on learning, thinking, and engineering practice.
          </p>
        </header>

        <CategoryFilter
          categories={categories}
          selectedCategory={catParam}
        />

        {posts.length > 0 ? (
          <div className="bg-card rounded-xl border border-border px-6">
            {posts.map((post) => (
              <ArticleCard key={post.slug} post={post} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-card rounded-xl border border-border">
            <p className="text-muted-foreground">No posts yet</p>
          </div>
        )}
      </div>
    </div>
  );
}
