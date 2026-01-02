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

  return (
    <div className="mb-6">
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => updateFilter()}
          className={`px-4 py-2 rounded-full text-sm transition-colors ${
            !selectedCategory
              ? 'bg-blue-500 text-white'
              : 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600'
          }`}
        >
          全部
        </button>
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => updateFilter(cat)}
            className={`px-4 py-2 rounded-full text-sm transition-colors ${
              selectedCategory === cat
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>
    </div>
  );
}
