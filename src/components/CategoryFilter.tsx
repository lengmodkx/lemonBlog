'use client';

import { useRouter, useSearchParams } from 'next/navigation';

interface CategoryFilterProps {
  categories: string[];
  selectedCategory?: string;
}

export default function CategoryFilter({
  categories,
  selectedCategory,
}: CategoryFilterProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const updateFilter = (category?: string) => {
    const params = new URLSearchParams(searchParams);
    if (category) {
      params.set('cat', category);
    } else {
      params.delete('cat');
    }
    router.push(`/blog?${params.toString()}`);
  };

  const allCategories = ['全部', ...categories];

  return (
    <div className="mb-10">
      <div className="flex flex-wrap gap-2">
        {allCategories.map((cat) => {
          const isSelected =
            cat === '全部' ? !selectedCategory : selectedCategory === cat;
          return (
            <button
              key={cat}
              onClick={() => updateFilter(cat === '全部' ? undefined : cat)}
              className={`px-4 py-1.5 text-sm rounded-full transition-colors ${
                isSelected
                  ? 'bg-accent text-accent-foreground font-medium'
                  : 'bg-muted text-muted-foreground hover:text-foreground hover:bg-muted/80'
              }`}
            >
              {cat}
            </button>
          );
        })}
      </div>
    </div>
  );
}
