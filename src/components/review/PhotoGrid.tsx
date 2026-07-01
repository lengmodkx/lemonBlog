'use client';

import { motion, useReducedMotion } from 'motion/react';
import Image from 'next/image';

interface Photo {
  src: string;
  alt?: string;
}

interface PhotoGridProps {
  layout: 'full' | 'pair' | 'trio';
  images?: Photo[];
  src?: string;
  alt?: string;
  caption?: string;
  aspectRatio?: string;
  priority?: boolean;
}

function Photo({ src, alt, priority, aspectRatio = '4/5', className = '' }: {
  src: string;
  alt?: string;
  priority?: boolean;
  aspectRatio?: string;
  className?: string;
}) {
  return (
    <div
      className={`relative overflow-hidden rounded-xl bg-muted ${className}`}
      style={{ aspectRatio }}
    >
      <Image
        src={src}
        alt={alt || ''}
        fill
        priority={priority}
        className="object-cover transition-transform duration-700 ease-out hover:scale-[1.02]"
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
      />
    </div>
  );
}

export default function PhotoGrid({
  layout,
  images,
  src,
  alt,
  caption,
  aspectRatio,
  priority,
}: PhotoGridProps) {
  const reduce = useReducedMotion();

  const gridClass = {
    full: '',
    pair: 'grid grid-cols-2 gap-3 md:gap-4',
    trio: 'grid grid-cols-3 gap-2 md:gap-4',
  }[layout];

  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      className="my-8 md:my-10"
    >
      {layout === 'full' && src && (
        <Photo src={src} alt={alt} priority={priority} aspectRatio={aspectRatio || '4/5'} className="w-full" />
      )}

      {layout !== 'full' && images && (
        <div className={gridClass}>
          {images.map((image, index) => (
            <Photo
              key={index}
              src={image.src}
              alt={image.alt}
              priority={priority && index === 0}
              aspectRatio={aspectRatio || (layout === 'pair' ? '1/1' : '3/4')}
              className="w-full"
            />
          ))}
        </div>
      )}

      {caption && (
        <p className="mt-4 text-xs md:text-sm text-muted-foreground tracking-wide">
          {caption}
        </p>
      )}
    </motion.div>
  );
}
