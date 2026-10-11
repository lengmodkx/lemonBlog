'use client';

import PhotoGrid from './PhotoGrid';
import type { TimelineMonth, TravelPhoto } from '@/types/travel';

export interface TimelineViewProps {
  months: TimelineMonth[];
  /** Called with the clicked photo, its index and the photos of the same month. */
  onPhotoClick?: (photo: TravelPhoto, index: number, group: TravelPhoto[]) => void;
}

/** 月份标题：2026 年 8 月 */
function formatMonth(key: string): string {
  const [year, month] = key.split('-');
  return `${year} 年 ${Number(month)} 月`;
}

export default function TimelineView({ months, onPhotoClick }: TimelineViewProps) {
  return (
    <div className="relative">
      {/* vertical rail */}
      <div className="absolute left-[7px] md:left-[11px] top-2 bottom-2 w-px bg-border" aria-hidden />

      <div className="space-y-12">
        {months.map((month) => (
          <section key={month.key} className="relative pl-8 md:pl-12">
            <div
              className="absolute left-0 md:left-1 top-1.5 w-[15px] h-[15px] rounded-full border-2 border-accent bg-background"
              aria-hidden
            />
            <header className="mb-4 flex items-baseline gap-3">
              <h3 className="text-lg font-semibold text-foreground">{formatMonth(month.key)}</h3>
              <span className="text-xs text-muted-foreground">{month.photos.length} 张照片</span>
            </header>
            <PhotoGrid
              photos={month.photos}
              onPhotoClick={(photo, index) => onPhotoClick?.(photo, index, month.photos)}
            />
          </section>
        ))}
      </div>
    </div>
  );
}
