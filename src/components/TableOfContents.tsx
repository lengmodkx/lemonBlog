'use client';

import { useEffect, useState, useMemo } from 'react';

interface Heading {
  id: string;
  text: string;
  level: number;
}

interface TableOfContentsProps {
  content: string;
}

export default function TableOfContents({ content }: TableOfContentsProps) {
  const [activeId, setActiveId] = useState<string>('');
  const [headings, setHeadings] = useState<Heading[]>([]);

  // Extract headings from content
  useEffect(() => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(content, 'text/html');
    const headingElements = doc.querySelectorAll('h2, h3');

    const extractedHeadings: Heading[] = Array.from(headingElements).map((heading, index) => {
      const id = `heading-${index}`;
      return {
        id,
        text: heading.textContent || '',
        level: parseInt(heading.tagName.substring(1)),
      };
    });

    setHeadings(extractedHeadings);

    // Add IDs to headings in the document
    const articleHeadings = document.querySelectorAll('article h2, article h3');
    articleHeadings.forEach((heading, index) => {
      heading.id = `heading-${index}`;
    });
  }, [content]);

  // Intersection Observer for active heading
  useEffect(() => {
    if (headings.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      {
        rootMargin: '-100px 0px -66%',
        threshold: 0,
      }
    );

    headings.forEach((heading) => {
      const element = document.getElementById(heading.id);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, [headings]);

  const handleClick = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 100; // Header offset
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });
    }
  };

  if (headings.length === 0) return null;

  return (
    <div className="hidden lg:block sticky top-24 h-[calc(100vh-6rem)] overflow-y-auto">
      <div className="w-64">
        <h3 className="text-sm font-bold text-ink dark:text-text-primary mb-4 flex items-center gap-2">
          <span>📑</span>
          <span>目录</span>
        </h3>
        <nav className="space-y-2">
          {headings.map((heading) => (
            <button
              key={heading.id}
              onClick={() => handleClick(heading.id)}
              className={`block w-full text-left transition-colors duration-200 ${
                heading.level === 3 ? 'pl-4' : 'pl-0'
              } ${
                activeId === heading.id
                  ? 'text-primary font-semibold border-l-2 border-primary'
                  : 'text-text-muted hover:text-primary border-l-2 border-transparent'
              }`}
              style={{
                fontSize: heading.level === 3 ? '0.875rem' : '0.9rem',
              }}
            >
              <span className="truncate block">{heading.text}</span>
            </button>
          ))}
        </nav>
      </div>
    </div>
  );
}
