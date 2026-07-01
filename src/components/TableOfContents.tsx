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

function generateHeadingId(text: string, index: number): string {
  const slug = text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .slice(0, 50);
  return slug ? `heading-${slug}-${index}` : `heading-${index}`;
}

function parseHeadings(content: string): Heading[] {
  // Use a lightweight regex-based parser so this works during SSR as well as
  // on the client. DOMParser is only available in the browser, which caused the
  // TOC to render empty on first paint.
  const headingRegex = /<h([23])[^>]*>([\s\S]*?)<\/h\1>/gi;
  const headings: Heading[] = [];
  let match;

  while ((match = headingRegex.exec(content)) !== null) {
    const level = parseInt(match[1], 10);
    // Strip any nested HTML tags (e.g. icons, anchors) to get clean text.
    const text = match[2]
      .replace(/<[^>]+>/g, '')
      .replace(/&nbsp;/g, ' ')
      .trim();

    if (text) {
      headings.push({
        id: generateHeadingId(text, headings.length),
        text,
        level,
      });
    }
  }

  return headings;
}

export default function TableOfContents({ content }: TableOfContentsProps) {
  const [activeId, setActiveId] = useState<string>('');

  const headings = useMemo<Heading[]>(() => parseHeadings(content), [content]);

  useEffect(() => {
    if (headings.length === 0) return;

    // Exclude headings inside the comments section so "文章评论" doesn't appear
    // in the table of contents.
    const articleHeadings = document.querySelectorAll(
      'article h2:not(#comments *, [id*="comment"] *), article h3:not(#comments *, [id*="comment"] *)'
    );

    articleHeadings.forEach((heading, index) => {
      const text = heading.textContent || '';
      heading.id = generateHeadingId(text, index);
    });

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
    <aside className="hidden lg:block sticky top-24 h-[calc(100vh-6rem)] overflow-y-auto">
      <div className="w-52">
        <h3 className="text-sm font-semibold text-foreground mb-4 tracking-tight">
          目录
        </h3>
        <nav className="space-y-1 border-l border-border">
          {headings.map((heading) => (
            <button
              key={heading.id}
              onClick={() => handleClick(heading.id)}
              className={`block w-full text-left text-sm transition-colors py-1 ${
                heading.level === 3 ? 'pl-5' : 'pl-4'
              } ${
                activeId === heading.id
                  ? 'text-accent border-l border-accent -ml-px font-medium'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <span className="truncate block">{heading.text}</span>
            </button>
          ))}
        </nav>
      </div>
    </aside>
  );
}
