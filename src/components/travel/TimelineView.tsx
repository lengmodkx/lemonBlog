'use client';

import PhotoMasonry from './PhotoMasonry';
import type { TimelineMonth, TravelPhoto } from '@/types/travel';

export interface TimelineViewProps {
  months: TimelineMonth[];
  /** Called with the clicked photo, its index and the photos of the same day. */
  onPhotoClick?: (photo: TravelPhoto, index: number, group: TravelPhoto[]) => void;
}

const WEEKDAYS = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];

/** 日期标题：10 月 4 日 · 周六 */
function formatDay(key: string): string {
  const [year, month, day] = key.split('-').map(Number);
  const weekday = WEEKDAYS[new Date(year, month - 1, day).getDay()];
  return `${month} 月 ${day} 日 · ${weekday}`;
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
              <h3 className="text-lg font-semibold text-foreground">{formatDay(month.key)}</h3>
              <span className="text-xs text-muted-foreground">{month.photos.length} 张照片</span>
            </header>
            <PhotoMasonry
              photos={month.photos}
              onPhotoClick={(photo, index) => onPhotoClick?.(photo, index, month.photos)}
            />
          </section>
        ))}
      </div>
    </div>
  );
}
