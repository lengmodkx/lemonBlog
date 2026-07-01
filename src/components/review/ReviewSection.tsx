'use client';

import { motion, useReducedMotion } from 'motion/react';

interface ReviewSectionProps {
  title: string;
  em?: string;
  description?: string;
  children: React.ReactNode;
}

export default function ReviewSection({ title, em, description, children }: ReviewSectionProps) {
  const reduce = useReducedMotion();

  return (
    <section className="py-16 md:py-24">
      <motion.div
        initial={reduce ? false : { opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="mb-10 md:mb-14"
      >
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-semibold tracking-tight text-foreground leading-tight">
          {title}
          {em && <span className="text-accent">{em}</span>}
        </h2>
        {description && (
          <p className="mt-4 text-muted-foreground text-base md:text-lg max-w-xl leading-relaxed whitespace-pre-line">
            {description}
          </p>
        )}
      </motion.div>

      {children}
    </section>
  );
}
