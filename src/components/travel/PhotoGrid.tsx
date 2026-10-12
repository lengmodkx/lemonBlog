'use client';

import Image from 'next/image';
import { motion, useReducedMotion } from 'motion/react';
import { photoUrl } from '@/lib/photo-url';
import type { TravelPhoto } from '@/types/travel';

export interface PhotoGridProps {
  photos: TravelPhoto[];
  /** Called with the photo and its index inside `photos`. */
  onPhotoClick?: (photo: TravelPhoto, index: number) => void;
  /** Grid columns preset. */
  columns?: 2 | 3 | 4;
}

const columnClass = {
  2: 'grid grid-cols-2 gap-3 md:gap-4',
  3: 'grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4',
  4: 'grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4',
};

export default function PhotoGrid({ photos, onPhotoClick, columns = 3 }: PhotoGridProps) {
  const reduce = useReducedMotion();

  return (
    <div className={columnClass[columns]}>
      {photos.map((photo, index) => (
        <motion.button
          key={photo.id}
          type="button"
          initial={reduce ? false : { opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.15 }}
          transition={{ duration: 0.5, delay: Math.min(index * 0.04, 0.3), ease: [0.16, 1, 0.3, 1] }}
          onClick={() => onPhotoClick?.(photo, index)}
          className="group text-left"
        >
          <div className="relative aspect-[4/5] overflow-hidden rounded-xl bg-muted">
            <Image
              src={photoUrl(photo.thumb || photo.src)}
              alt={photo.caption || `${photo.city} · ${photo.date}`}
              fill
              sizes="(max-width: 768px) 50vw, 33vw"
              unoptimized
              className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.04]"
            />
            {(photo.burst?.length ?? 0) > 1 && (
              <span className="absolute top-2 right-2 px-1.5 py-0.5 rounded-md bg-black/55 text-white text-[10px] font-medium tracking-wide">
                ×{photo.burst!.length}
              </span>
            )}
            <div className="absolute inset-x-0 bottom-0 p-2 bg-gradient-to-t from-black/55 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
              <p className="text-xs text-white/90 truncate">{photo.city}</p>
            </div>
          </div>
          <div className="mt-2 space-y-0.5">
            <p className="text-xs text-muted-foreground">{photo.date}</p>
            {photo.caption && (
              <p className="text-sm text-foreground/90 line-clamp-2">{photo.caption}</p>
            )}
          </div>
        </motion.button>
      ))}
    </div>
  );
}
