import Link from 'next/link';
import { ArrowLeft } from '@phosphor-icons/react/dist/ssr';
import {
  getTravelData,
  getCityMarkers,
  getProvinceStats,
  getTimeline,
  getTravelStats,
} from '@/lib/travel';
import TravelGallery from '@/components/travel/TravelGallery';

export const metadata = {
  title: 'Travel',
  description: '旅行画廊：按时间线浏览路上的照片，点亮走过的中国地图',
};

export default function TravelPage() {
  const { trips, photos, videos } = getTravelData();
  const markers = getCityMarkers(photos, trips);
  const provinces = getProvinceStats(photos);
  const timeline = getTimeline(photos);
  const stats = getTravelStats(photos);

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-5xl mx-auto px-6 py-16 md:py-20">
        <Link
          href="/"
          className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-10 transition-colors"
        >
          <ArrowLeft size={14} weight="bold" />
          Back to home
        </Link>

        <header className="mb-12">
          <h1 className="text-3xl md:text-4xl font-semibold text-foreground tracking-tight mb-3">
            Travel
          </h1>
          <p className="text-muted-foreground max-w-xl leading-relaxed">
            用照片记录走过的路。在地图上点亮去过的省份，点开每一座城市，看看那里的光景；
            或者沿着时间线，一页页翻回那些日子。
          </p>
        </header>

        <TravelGallery
          photos={photos}
          trips={trips}
          videos={videos}
          markers={markers}
          provinces={provinces}
          timeline={timeline}
          stats={stats}
        />
      </div>
    </div>
  );
}
