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

  const buttonClasses = (isSelected: boolean) =>
    `px-4 py-2 rounded-full text-sm font-bold
    transition-all duration-300 ease-out
    hover:scale-105 hover:-translate-y-0.5
    hover:shadow-lg
    ${isSelected
      ? 'bg-primary hover:bg-primary-hover text-white shadow-xl shadow-primary/40 scale-105 border-2 border-primary ring-2 ring-primary/30'
      : 'bg-lavender-100 dark:bg-lavender-900/30 hover:bg-lavender-200 dark:hover:bg-lavender-800/50 text-ink dark:text-text-primary shadow-md border border-transparent hover:border-lavender-300 dark:hover:border-lavender-700'
    }
    animate-fade-in`;

  return (
    <div className="mb-6">
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => updateFilter()}
          className={buttonClasses(!selectedCategory)}
          style={{ animationDelay: '0ms' }}
        >
          全部
        </button>
        {categories.map((cat, index) => (
          <button
            key={cat}
            onClick={() => updateFilter(cat)}
            className={buttonClasses(selectedCategory === cat)}
            style={{ animationDelay: `${(index + 1) * 50}ms` }}
          >
            {cat}
          </button>
        ))}
      </div>
    </div>
  );
}
