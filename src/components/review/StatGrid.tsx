'use client';

import { motion, useReducedMotion } from 'motion/react';

interface Stat {
  number: string;
  label: string;
}

interface StatGridProps {
  stats: Stat[];
}

export default function StatGrid({ stats }: StatGridProps) {
  const reduce = useReducedMotion();

  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.4 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="grid grid-cols-3 gap-0 border-y border-border py-12 md:py-16"
    >
      {stats.map((stat, index) => (
        <div
          key={index}
          className={`px-4 md:px-8 ${index !== 0 ? 'border-l border-border' : ''}`}
        >
          <div className="text-[clamp(2.25rem,7vw,4rem)] leading-none font-semibold tracking-tight text-foreground font-mono">
            {stat.number}
          </div>
          <div className="text-xs md:text-sm text-muted-foreground uppercase tracking-[0.08em] mt-3 leading-relaxed">
            {stat.label.split('\n').map((line, i) => (
              <span key={i} className="block">
                {line}
              </span>
            ))}
          </div>
        </div>
      ))}
    </motion.div>
  );
}
