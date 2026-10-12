'use client';

import { useCallback, useEffect, useState } from 'react';
import Image from 'next/image';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { CaretLeft, CaretRight, Stack, X } from '@phosphor-icons/react';
import { photoUrl } from '@/lib/photo-url';
import type { TravelPhoto } from '@/types/travel';

export interface PhotoLightboxProps {
  photos: TravelPhoto[];
  /** Index of the open photo inside `photos`; null means closed. */
  index: number | null;
  onClose: () => void;
  onNavigate: (index: number) => void;
}

export default function PhotoLightbox({ photos, index, onClose, onNavigate }: PhotoLightboxProps) {
  const reduce = useReducedMotion();
  const open = index !== null && index >= 0 && index < photos.length;
  const photo = open ? photos[index] : null;

  // Burst browsing: position is keyed by photo id, so it resets automatically
  // when navigating to another photo (no effect needed).
  const burst = photo?.burst && photo.burst.length > 1 ? photo.burst : null;
  const [burstPos, setBurstPos] = useState<{ id: string; index: number } | null>(null);

  const repIndex = burst ? burst.findIndex((f) => f.id === photo!.id) : -1;
  const shownIndex =
    burst && burstPos && burstPos.id === photo?.id ? burstPos.index : repIndex >= 0 ? repIndex : 0;
  const shown = burst ? burst[shownIndex] : photo;

  const goBurstPrev = useCallback(() => {
    if (!burst || !photo) return;
    setBurstPos({ id: photo.id, index: (shownIndex - 1 + burst.length) % burst.length });
  }, [burst, photo, shownIndex]);

  const goBurstNext = useCallback(() => {
    if (!burst || !photo) return;
    setBurstPos({ id: photo.id, index: (shownIndex + 1) % burst.length });
  }, [burst, photo, shownIndex]);

  const goPrev = useCallback(() => {
    if (index === null) return;
    onNavigate((index - 1 + photos.length) % photos.length);
  }, [index, photos.length, onNavigate]);

  const goNext = useCallback(() => {
    if (index === null) return;
    onNavigate((index + 1) % photos.length);
  }, [index, photos.length, onNavigate]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') goPrev();
      if (e.key === 'ArrowRight') goNext();
    };
    window.addEventListener('keydown', onKey);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = previousOverflow;
    };
  }, [open, onClose, goPrev, goNext]);

  return (
    <AnimatePresence>
      {open && photo && (
        <motion.div
          initial={reduce ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/85 backdrop-blur-sm p-4"
          onClick={onClose}
        >
          <button
            onClick={onClose}
            aria-label="关闭"
            className="absolute top-4 right-4 p-2 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
          >
            <X size={22} />
          </button>

          {photos.length > 1 && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  goPrev();
                }}
                aria-label="上一张"
                className="absolute left-3 md:left-6 p-2 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
              >
                <CaretLeft size={24} />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  goNext();
                }}
                aria-label="下一张"
                className="absolute right-3 md:right-6 p-2 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
              >
                <CaretRight size={24} />
              </button>
            </>
          )}

          <motion.figure
            initial={reduce ? false : { opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-5xl w-full flex flex-col items-center gap-3"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative w-full max-h-[75vh] aspect-[3/2]">
              <Image
                src={photoUrl(shown!.src)}
                alt={shown!.caption || `${shown!.city} · ${shown!.date}`}
                fill
                sizes="(max-width: 1024px) 100vw, 1024px"
                className="object-contain"
                unoptimized
                priority
              />
            </div>
            <figcaption className="text-center text-sm text-white/80 space-y-1">
              {shown!.caption && <p>{shown!.caption}</p>}
              <p>
                {shown!.date} · {shown!.city}，{shown!.province}
                {photos.length > 1 && (
                  <span className="ml-2 text-white/50">
                    {index! + 1} / {photos.length}
                  </span>
                )}
              </p>
              {burst && (
                <div className="inline-flex items-center gap-2 text-white/70">
                  <button
                    type="button"
                    onClick={goBurstPrev}
                    aria-label="连拍上一帧"
                    className="p-1 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                  >
                    <CaretLeft size={14} />
                  </button>
                  <span className="inline-flex items-center gap-1 text-xs">
                    <Stack size={13} />
                    {photo.stackKind === 'group' ? '同景' : '连拍'} {shownIndex + 1} / {burst.length}
                  </span>
                  <button
                    type="button"
                    onClick={goBurstNext}
                    aria-label="连拍下一帧"
                    className="p-1 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                  >
                    <CaretRight size={14} />
                  </button>
                </div>
              )}
            </figcaption>
          </motion.figure>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
