'use client';

import { motion, useReducedMotion } from 'motion/react';

interface ListItem {
  num?: string;
  title: string;
  em?: string;
  tag?: string;
}

interface ReadingListProps {
  items: ListItem[];
}

function HighlightTitle({ title, em }: { title: string; em?: string }) {
  if (!em) return <>{title}</>;

  const parts = title.split(em);
  if (parts.length === 1) return <>{title}</>;

  return (
    <>
      {parts.map((part, index) => (
        <span key={index}>
          {part}
          {index < parts.length - 1 && <span className="text-accent">{em}</span>}
        </span>
      ))}
    </>
  );
}

export default function ReadingList({ items }: ReadingListProps) {
  const reduce = useReducedMotion();

  return (
    <motion.ul
      initial={reduce ? false : { opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="border-t border-border my-8 md:my-10"
    >
      {items.map((item, index) => (
        <li
          key={index}
          className="grid grid-cols-[3rem_1fr_auto] md:grid-cols-[4rem_1fr_auto] gap-4 items-baseline py-4 md:py-5 border-b border-border"
        >
          <span className="text-xs text-muted-foreground font-mono tabular-nums">
            {item.num || String(index + 1).padStart(2, '0')}
          </span>
          <span className="text-foreground text-base md:text-lg font-medium">
            <HighlightTitle title={item.title} em={item.em} />
          </span>
          {item.tag && (
            <span className="text-xs text-muted-foreground uppercase tracking-wider whitespace-nowrap">
              {item.tag}
            </span>
          )}
        </li>
      ))}
    </motion.ul>
  );
}
