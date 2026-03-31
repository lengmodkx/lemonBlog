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

// Generate stable ID from heading text
function generateHeadingId(text: string, index: number): string {
  const slug = text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .slice(0, 50);
  return slug ? `heading-${slug}-${index}` : `heading-${index}`;
}

export default function TableOfContents({ content }: TableOfContentsProps) {
  const [activeId, setActiveId] = useState<string>('');

  // Extract headings and generate stable IDs
  const headings = useMemo<Heading[]>(() => {
    // DOMParser is only available in browser
    if (typeof window === 'undefined') return [];

    const parser = new DOMParser();
    const doc = parser.parseFromString(content, 'text/html');
    const headingElements = doc.querySelectorAll('h2, h3');

    return Array.from(headingElements).map((heading, index) => {
      const text = heading.textContent || '';
      return {
        id: generateHeadingId(text, index),
        text,
        level: parseInt(heading.tagName.substring(1)),
      };
    });
  }, [content]);

  // Assign IDs to DOM elements and setup observer
  useEffect(() => {
    if (headings.length === 0) return;

    const articleHeadings = document.querySelectorAll('article h2, article h3');

    // Assign IDs using same logic as heading generation
    articleHeadings.forEach((heading, index) => {
      const text = heading.textContent || '';
      heading.id = generateHeadingId(text, index);
    });

    // Setup IntersectionObserver
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

    articleHeadings.forEach((heading) => {
      observer.observe(heading);
    });

    return () => observer.disconnect();
  }, [headings]);

  const handleClick = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 100;
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
      <div className="w-48">
        <h3 className="font-hand text-lg text-ink mb-4">
          目录
        </h3>
        <nav className="space-y-1 border-l border-border">
          {headings.map((heading) => (
            <button
              key={heading.id}
              onClick={() => handleClick(heading.id)}
              className={`block w-full text-left text-sm transition-colors ${
                heading.level === 3 ? 'pl-4' : 'pl-3'
              } ${
                activeId === heading.id
                  ? 'text-accent border-l border-accent -ml-px'
                  : 'text-ink-light hover:text-ink'
              }`}
              style={{
                fontSize: heading.level === 3 ? '0.8125rem' : '0.875rem',
              }}
            >
              <span className="truncate block py-1">{heading.text}</span>
            </button>
          ))}
        </nav>
      </div>
    </div>
  );
}
