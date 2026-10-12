'use client';

import Image from 'next/image';
import { motion, useReducedMotion } from 'motion/react';
import { photoUrl } from '@/lib/photo-url';
import type { TravelPhoto } from '@/types/travel';

export interface PhotoMasonryProps {
  photos: TravelPhoto[];
  /** Called with the photo and its index inside `photos`. */
  onPhotoClick?: (photo: TravelPhoto, index: number) => void;
  /** Max visible columns. */
  columns?: 2 | 3 | 4;
}

const columnClass = {
  2: 'columns-2 gap-3',
  3: 'columns-2 lg:columns-3 gap-3',
  4: 'columns-2 lg:columns-4 gap-3',
};

/** 默认固有尺寸（生成流水线的输出规格） */
function sizeOf(photo: TravelPhoto) {
  if (photo.width && photo.height) return { width: photo.width, height: photo.height };
  return { width: 1600, height: 1067 };
}

export default function PhotoMasonry({ photos, onPhotoClick, columns = 3 }: PhotoMasonryProps) {
  const reduce = useReducedMotion();

  return (
    <div className={columnClass[columns]}>
      {photos.map((photo, index) => {
        const { width, height } = sizeOf(photo);
        return (
          <motion.button
            key={photo.id}
            type="button"
            initial={reduce ? false : { opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.1 }}
            transition={{ duration: 0.45, delay: Math.min((index % 12) * 0.03, 0.3), ease: [0.16, 1, 0.3, 1] }}
            onClick={() => onPhotoClick?.(photo, index)}
            className="group mb-3 block w-full break-inside-avoid text-left"
          >
            <div className="relative overflow-hidden rounded-xl bg-muted">
              <Image
                src={photoUrl(photo.thumb || photo.src)}
                alt={photo.caption || `${photo.city} · ${photo.date}`}
                width={width}
                height={height}
                sizes="(max-width: 768px) 50vw, 33vw"
                unoptimized
                className="w-full h-auto transition-transform duration-500 ease-out group-hover:scale-[1.03]"
              />
              {(photo.burst?.length ?? 0) > 1 && (
                <span className="absolute top-2 right-2 px-1.5 py-0.5 rounded-md bg-black/55 text-white text-[10px] font-medium tracking-wide">
                  ×{photo.burst!.length}
                </span>
              )}
              <div className="absolute inset-x-0 bottom-0 p-2.5 bg-gradient-to-t from-black/55 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <p className="text-[11px] text-white/90 tracking-wide">
                  {photo.date} · {photo.city}
                </p>
              </div>
            </div>
          </motion.button>
        );
      })}
    </div>
  );
}
