'use client';

import { motion, useReducedMotion } from 'motion/react';

interface VideoStageProps {
  src: string;
  caption?: string;
}

export default function VideoStage({ src, caption }: VideoStageProps) {
  const reduce = useReducedMotion();

  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      className="my-8 md:my-10"
    >
      <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-muted border border-border">
        <video
          src={src}
          controls
          playsInline
          preload="metadata"
          className="w-full h-full object-cover"
        />
      </div>
      {caption && (
        <p className="mt-4 text-xs md:text-sm text-muted-foreground tracking-wide">
          {caption}
        </p>
      )}
    </motion.div>
  );
}
