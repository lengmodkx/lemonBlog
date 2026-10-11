'use client';

import { useMemo, useState } from 'react';
import dynamic from 'next/dynamic';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import { MapTrifold, ClockCounterClockwise, X, MapPin } from '@phosphor-icons/react';
import { useIsDarkTheme } from '@/lib/use-theme';
import PhotoGrid from './PhotoGrid';
import TimelineView from './TimelineView';
import PhotoLightbox from './PhotoLightbox';
import type {
  CityMarker,
  ProvinceStats,
  TimelineMonth,
  TravelPhoto,
  TravelStats,
} from '@/types/travel';

const ChinaMap = dynamic(() => import('./ChinaMap'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[480px] md:h-[620px] flex items-center justify-center text-muted-foreground text-sm">
      地图加载中…
    </div>
  ),
});

export interface TravelGalleryProps {
  photos: TravelPhoto[];
  markers: CityMarker[];
  provinces: ProvinceStats[];
  timeline: TimelineMonth[];
  stats: TravelStats;
}

interface Selection {
  type: 'city' | 'province';
  name: string;
  photos: TravelPhoto[];
}

type ViewMode = 'map' | 'timeline';

export default function TravelGallery({ photos, markers, provinces, timeline, stats }: TravelGalleryProps) {
  const isDark = useIsDarkTheme();
  const reduce = useReducedMotion();
  const [view, setView] = useState<ViewMode>('map');
  const [selection, setSelection] = useState<Selection | null>(null);
  const [lightbox, setLightbox] = useState<{ group: TravelPhoto[]; index: number } | null>(null);

  const photoCountByCity = useMemo(
    () => new Map(markers.map((m) => [m.city, m.photos.length])),
    [markers],
  );

  const openCity = (marker: CityMarker) =>
    setSelection({ type: 'city', name: marker.city, photos: marker.photos });

  const openProvince = (province: string) => {
    const list = photos.filter((p) => p.province === province);
    if (list.length > 0) setSelection({ type: 'province', name: province, photos: list });
  };

  return (
    <div className="space-y-8">
      {/* stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: '照片', value: stats.photoCount, unit: '张' },
          { label: '足迹', value: stats.cityCount, unit: '个城市' },
          { label: '点亮', value: stats.provinceCount, unit: '个省份' },
          {
            label: '时间跨度',
            value: stats.startDate ? `${stats.startDate.slice(0, 7)} ~ ${stats.endDate?.slice(0, 7)}` : '—',
            unit: '',
          },
        ].map((item) => (
          <div key={item.label} className="rounded-xl border border-border bg-card p-4">
            <p className="text-xs text-muted-foreground">{item.label}</p>
            <p className="mt-1 text-xl font-semibold text-foreground">
              {item.value}
              {item.unit && <span className="ml-1 text-xs font-normal text-muted-foreground">{item.unit}</span>}
            </p>
          </div>
        ))}
      </div>

      {/* view switch */}
      <div className="flex items-center gap-2">
        <div className="inline-flex rounded-lg border border-border p-1 bg-card">
          {(
            [
              { key: 'map', label: '地图', icon: MapTrifold },
              { key: 'timeline', label: '时间线', icon: ClockCounterClockwise },
            ] as const
          ).map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              type="button"
              onClick={() => setView(key)}
              className={`inline-flex items-center gap-1.5 px-4 py-1.5 rounded-md text-sm transition-colors ${
                view === key
                  ? 'bg-accent text-accent-foreground'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Icon size={16} />
              {label}
            </button>
          ))}
        </div>
        <p className="text-xs text-muted-foreground hidden md:block">
          {view === 'map'
            ? '滚轮缩放、拖拽移动地图；点击城市圆点或省份查看照片'
            : '按拍摄时间倒序浏览'}
        </p>
      </div>

      {/* views */}
      <AnimatePresence mode="wait">
        {view === 'map' ? (
          <motion.div
            key="map"
            initial={reduce ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="space-y-6"
          >
            <div className="rounded-2xl border border-border bg-card overflow-hidden">
              <ChinaMap
                markers={markers}
                provinces={provinces}
                isDark={isDark}
                onCityClick={openCity}
                onProvinceClick={openProvince}
              />
            </div>

            <AnimatePresence>
              {selection && (
                <motion.section
                  key={selection.type + selection.name}
                  initial={reduce ? false : { opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 16 }}
                  transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                  className="rounded-2xl border border-border bg-card p-5 md:p-6"
                >
                  <header className="mb-5 flex items-center justify-between gap-4">
                    <div>
                      <h3 className="flex items-center gap-2 text-lg font-semibold text-foreground">
                        <MapPin size={18} className="text-accent" />
                        {selection.name}
                        <span className="text-xs font-normal text-muted-foreground">
                          {selection.type === 'city' ? '城市' : '省份'} · {selection.photos.length} 张照片
                        </span>
                      </h3>
                      {selection.type === 'city' && photoCountByCity.has(selection.name) && (
                        <p className="mt-1 text-xs text-muted-foreground">
                          {selection.photos[0]?.date} 起在这里记录
                        </p>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => setSelection(null)}
                      aria-label="关闭地点面板"
                      className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                    >
                      <X size={18} />
                    </button>
                  </header>
                  <PhotoGrid
                    photos={selection.photos}
                    onPhotoClick={(_, index) => setLightbox({ group: selection.photos, index })}
                  />
                </motion.section>
              )}
            </AnimatePresence>
          </motion.div>
        ) : (
          <motion.div
            key="timeline"
            initial={reduce ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          >
            <TimelineView
              months={timeline}
              onPhotoClick={(_, index, group) => setLightbox({ group, index })}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {photos.length === 0 && (
        <p className="text-center text-sm text-muted-foreground py-12">
          还没有照片。往 content/travel/photos.json 里添加第一条记录吧。
        </p>
      )}

      <PhotoLightbox
        photos={lightbox?.group ?? []}
        index={lightbox?.index ?? null}
        onClose={() => setLightbox(null)}
        onNavigate={(index) => setLightbox((prev) => (prev ? { ...prev, index } : null))}
      />
    </div>
  );
}
