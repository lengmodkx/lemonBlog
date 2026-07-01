'use client';

import { motion, useReducedMotion } from 'motion/react';

interface ReviewHeroProps {
  number: string;
  unit: string;
  label: string;
  intro: string;
  period?: string;
  author?: string;
}

export default function ReviewHero({ number, unit, label, intro, period, author }: ReviewHeroProps) {
  const reduce = useReducedMotion();

  return (
    <section className="min-h-[80dvh] flex flex-col justify-between py-16 md:py-24">
      <motion.div
        initial={reduce ? false : { opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="flex justify-between items-baseline text-xs font-medium text-muted-foreground uppercase tracking-[0.14em]"
      >
        <span>{period}</span>
        <span>{author || 'Lemon'}</span>
      </motion.div>

      <div className="flex-1 flex flex-col justify-center py-12">
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
        >
          <span className="text-sm font-medium text-accent tracking-wide">{label}</span>
        </motion.div>

        <motion.h1
          initial={reduce ? false : { opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          className="text-[clamp(7rem,22vw,16rem)] leading-[0.9] font-semibold tracking-tighter text-foreground mt-4 font-mono"
        >
          {number}
        </motion.h1>

        <motion.p
          initial={reduce ? false : { opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
          className="text-xl md:text-2xl text-accent mt-4 font-medium"
        >
          {unit}
        </motion.p>

        <motion.p
          initial={reduce ? false : { opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className="text-muted-foreground mt-8 max-w-md text-base md:text-lg leading-relaxed whitespace-pre-line"
        >
          {intro}
        </motion.p>
      </div>
    </section>
  );
}
