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
    `px-3 py-1 text-sm transition-colors ${
      isSelected
        ? 'text-ink border-b-2 border-accent'
        : 'text-ink-light hover:text-ink'
    }`;

  return (
    <div className="mb-8">
      <div className="flex flex-wrap gap-1 border-b border-border pb-4">
        <button
          onClick={() => updateFilter()}
          className={buttonClasses(!selectedCategory)}
        >
          全部
        </button>
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => updateFilter(cat)}
            className={buttonClasses(selectedCategory === cat)}
          >
            {cat}
          </button>
        ))}
      </div>
    </div>
  );
}
