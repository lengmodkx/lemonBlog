'use client';

import { useEffect, useState } from 'react';

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

  // Extract headings from content - 使用 ref 避免在渲染时直接操作 DOM
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
  }, [content]);

  // 单独处理 DOM 操作，确保在客户端执行
  useEffect(() => {
    if (headings.length === 0) return;

    // Add IDs to headings in the document
    const articleHeadings = document.querySelectorAll('article h2, article h3');
    articleHeadings.forEach((heading, index) => {
      heading.id = `heading-${index}`;
    });
  }, [headings]);

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
