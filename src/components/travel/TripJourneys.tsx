'use client';

import { useMemo, useState } from 'react';
import Image from 'next/image';
import { motion, useReducedMotion } from 'motion/react';
import { CaretDown, Images } from '@phosphor-icons/react';
import PhotoMasonry from './PhotoMasonry';
import TripVideos from './TripVideos';
import { photoUrl } from '@/lib/photo-url';
import { countPhotos } from '@/lib/travel-burst';
import type { TravelPhoto, TravelTrip, TravelVideo } from '@/types/travel';

export interface TripJourneysProps {
  trips: TravelTrip[];
  photos: TravelPhoto[];
  /** Videos shown at the end of their trip chapter. */
  videos?: TravelVideo[];
  /** Called with the clicked photo, its index and the photos of the same chapter. */
  onPhotoClick?: (photo: TravelPhoto, index: number, group: TravelPhoto[]) => void;
}

/** 章节默认露出的网格照片数（不含封面） */
const PREVIEW_COUNT = 9;

function formatDateSpan(startDate: string, endDate: string): string {
  const start = startDate.slice(5).replace('-', '.');
  const end = endDate.slice(5).replace('-', '.');
  return start === end ? start : `${start} – ${end}`;
}

function sizeOf(photo: TravelPhoto) {
  return photo.width && photo.height
    ? { width: photo.width, height: photo.height }
    : { width: 1600, height: 1067 };
}

interface Chapter {
  id: string;
  title: string;
  dateSpan: string;
  photos: TravelPhoto[];
  cover?: TravelPhoto;
}

function buildChapters(trips: TravelTrip[], photos: TravelPhoto[]): Chapter[] {
  const chapters: Chapter[] = trips.map((trip) => {
    const list = photos.filter((p) => p.trip === trip.id);
    // 封面：优先用 trip.cover 指定，否则选第一张横构图（更大气）
    const cover =
      (trip.cover ? list.find((p) => p.id === trip.cover) : undefined) ??
      list.find((p) => (p.width ?? 1600) >= (p.height ?? 1067)) ??
      list[0];
    return {
      id: trip.id,
      title: trip.title,
      dateSpan: formatDateSpan(trip.startDate, trip.endDate),
      photos: list,
      cover,
    };
  });

  const orphan = photos.filter((p) => !p.trip || !trips.some((t) => t.id === p.trip));
  if (orphan.length > 0) {
    chapters.push({
      id: 'misc',
      title: '其他',
      dateSpan: '',
      photos: orphan,
      cover: orphan.find((p) => (p.width ?? 1600) >= (p.height ?? 1067)) ?? orphan[0],
    });
  }
  return chapters.filter((c) => c.photos.length > 0);
}

export default function TripJourneys({ trips, photos, videos = [], onPhotoClick }: TripJourneysProps) {
  const reduce = useReducedMotion();
  const chapters = useMemo(() => buildChapters(trips, photos), [trips, photos]);
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  return (
    <div className="space-y-16">
      {chapters.map((chapter) => {
        const isExpanded = expanded[chapter.id];
        // 封面从网格里排除，避免重复
        const gridPhotos = chapter.photos.filter((p) => p.id !== chapter.cover?.id);
        const visible = isExpanded ? gridPhotos : gridPhotos.slice(0, PREVIEW_COUNT);
        const hiddenCount = gridPhotos.length - PREVIEW_COUNT;
        const coverSize = chapter.cover ? sizeOf(chapter.cover) : null;

        return (
          <motion.section
            key={chapter.id}
            initial={reduce ? false : { opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.08 }}
            transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
          >
            <header className="mb-5 flex flex-wrap items-baseline gap-x-4 gap-y-1">
              {chapter.dateSpan && (
                <span className="text-sm font-semibold text-accent tabular-nums">{chapter.dateSpan}</span>
              )}
              <h3 className="text-xl md:text-2xl font-semibold text-foreground tracking-tight">
                {chapter.title}
              </h3>
              <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                <Images size={14} />
                {countPhotos(chapter.photos)} 张
              </span>
            </header>

            {chapter.cover && coverSize && (
              <button
                type="button"
                onClick={() =>
                  onPhotoClick?.(
                    chapter.cover!,
                    chapter.photos.findIndex((p) => p.id === chapter.cover!.id),
                    chapter.photos,
                  )
                }
                className="group block w-full mb-4"
              >
                <div className="relative overflow-hidden rounded-2xl bg-muted">
                  <Image
                    src={photoUrl(chapter.cover.src)}
                    alt={chapter.cover.caption || `${chapter.cover.city} · ${chapter.cover.date}`}
                    width={coverSize.width}
                    height={coverSize.height}
                    sizes="(max-width: 1024px) 100vw, 960px"
                    unoptimized
                    className="w-full h-auto max-h-[62vh] object-cover transition-transform duration-700 ease-out group-hover:scale-[1.015]"
                  />
                  <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/50 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <p className="text-xs text-white/90">
                      {chapter.cover.date} · {chapter.cover.city}
                    </p>
                  </div>
                </div>
              </button>
            )}

            <PhotoMasonry
              photos={visible}
              onPhotoClick={(photo) =>
                onPhotoClick?.(
                  photo,
                  chapter.photos.findIndex((p) => p.id === photo.id),
                  chapter.photos,
                )
              }
            />

            {!isExpanded && hiddenCount > 0 && (
              <button
                type="button"
                onClick={() => setExpanded((prev) => ({ ...prev, [chapter.id]: true }))}
                className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 rounded-lg border border-border text-sm text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
              >
                <CaretDown size={14} />
                展开其余 {hiddenCount} 张
              </button>
            )}

            <TripVideos videos={videos.filter((v) => v.trip === chapter.id)} />
          </motion.section>
        );
      })}
    </div>
  );
}
