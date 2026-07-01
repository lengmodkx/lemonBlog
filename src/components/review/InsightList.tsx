'use client';

import { motion, useReducedMotion } from 'motion/react';

interface Insight {
  num?: string;
  lines: string[];
  highlights?: number[];
}

interface InsightListProps {
  insights: Insight[];
}

function HighlightLine({ line, highlighted }: { line: string; highlighted: boolean }) {
  if (!highlighted) return <>{line}</>;
  return <span className="text-accent">{line}</span>;
}

export default function InsightList({ insights }: InsightListProps) {
  const reduce = useReducedMotion();

  return (
    <div className="flex flex-col gap-12 md:gap-16 my-8 md:my-10">
      {insights.map((insight, index) => (
        <motion.div
          key={index}
          initial={reduce ? false : { opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.7, delay: index * 0.08, ease: [0.16, 1, 0.3, 1] }}
          className="grid grid-cols-[2rem_1fr] md:grid-cols-[3rem_1fr] gap-4 md:gap-6 items-start"
        >
          <span className="text-xs md:text-sm font-medium text-accent pt-1.5 md:pt-2 font-mono">
            {insight.num || String(index + 1).padStart(2, '0')}
          </span>
          <p className="text-xl md:text-2xl lg:text-3xl font-medium text-foreground leading-snug tracking-tight">
            {insight.lines.map((line, lineIndex) => (
              <span key={lineIndex}>
                <HighlightLine
                  line={line}
                  highlighted={insight.highlights?.includes(lineIndex) ?? false}
                />
                {lineIndex < insight.lines.length - 1 && <br />}
              </span>
            ))}
          </p>
        </motion.div>
      ))}
    </div>
  );
}
