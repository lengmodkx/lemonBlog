import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { resolveCityCoords } from '@/data/city-coords';
import {
  TravelData,
  TravelPhoto,
  TravelTrip,
  TravelVideo,
  TravelStats,
  CityMarker,
  ProvinceStats,
  TimelineMonth,
} from '@/types/travel';

export type {
  TravelData,
  TravelPhoto,
  TravelTrip,
  TravelVideo,
  TravelStats,
  CityMarker,
  ProvinceStats,
  TimelineMonth,
} from '@/types/travel';

const travelDirectory = path.join(process.cwd(), 'content/travel');
const photosJsonPath = path.join(travelDirectory, 'photos.json');

/** Normalize a date value to YYYY-MM-DD. */
function normalizeDate(value: unknown, fallback = '1970-01-01'): string {
  if (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value)) return value;
  if (value instanceof Date && !isNaN(value.getTime())) {
    return value.toISOString().split('T')[0];
  }
  return fallback;
}

interface RawPhoto {
  id?: string;
  src: string;
  thumb?: string;
  date: string;
  city: string;
  province: string;
  coords?: [number, number];
  caption?: string;
  trip?: string;
}

/** Fill in missing coords from the city table and validate required fields. */
function normalizePhoto(raw: RawPhoto, index: number): TravelPhoto | null {
  if (!raw || typeof raw.src !== 'string' || !raw.city || !raw.province) {
    console.warn(`[travel] photos.json entry #${index} is missing src/city/province, skipped`);
    return null;
  }
  const coords = raw.coords ?? resolveCityCoords(raw.city);
  return {
    id: raw.id ?? `photo-${index}`,
    src: raw.src,
    thumb: raw.thumb,
    date: normalizeDate(raw.date),
    city: raw.city,
    province: raw.province,
    coords: coords ?? undefined,
    caption: raw.caption,
    trip: raw.trip,
  };
}

/**
 * Read content/travel/photos.json and return normalized travel data.
 * Photos are sorted by date (newest first).
 */
export function getTravelData(): TravelData {
  if (!fs.existsSync(photosJsonPath)) {
    return { trips: [], photos: [], videos: [] };
  }

  const raw = JSON.parse(fs.readFileSync(photosJsonPath, 'utf8'));
  const rawPhotos: RawPhoto[] = Array.isArray(raw) ? raw : (raw.photos ?? []);
  const rawTrips: TravelTrip[] = Array.isArray(raw?.trips) ? raw.trips : [];
  const rawVideos: TravelVideo[] = Array.isArray(raw?.videos) ? raw.videos : [];

  const photos = rawPhotos
    .map((p, i) => normalizePhoto(p, i))
    .filter((p): p is TravelPhoto => p !== null)
    .sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0));

  const videos = rawVideos
    .filter((v) => v && typeof v.src === 'string' && v.city && v.province)
    .map((v, i) => ({
      ...v,
      id: v.id ?? `video-${i}`,
      date: normalizeDate(v.date),
    }))
    .sort((a, b) => (a.date < b.date ? 1 : -1));

  const trips = rawTrips
    .map((t) => ({
      ...t,
      startDate: normalizeDate(t.startDate),
      endDate: normalizeDate(t.endDate, normalizeDate(t.startDate)),
    }))
    .sort((a, b) => (a.startDate < b.startDate ? 1 : -1));

  return { trips, photos, videos };
}

/**
 * Aggregate photos into city markers for the map.
 * A city shows photos taken there, plus photos of trips that passed it.
 */
export function getCityMarkers(photos: TravelPhoto[], trips: TravelTrip[] = []): CityMarker[] {
  const tripById = new Map(trips.map((t) => [t.id, t]));

  // Candidate cities: explicit photo cities + trip waypoints.
  const candidateCities = new Map<string, string>(); // city -> province
  for (const photo of photos) {
    if (!candidateCities.has(photo.city)) candidateCities.set(photo.city, photo.province);
  }
  for (const trip of trips) {
    for (const city of trip.cities ?? []) {
      if (!candidateCities.has(city)) {
        const province = photos.find((p) => p.trip === trip.id)?.province;
        if (province) candidateCities.set(city, province);
      }
    }
  }

  const markers: CityMarker[] = [];
  for (const [city, province] of candidateCities) {
    const list = photos.filter((photo) => {
      if (photo.city === city) return true;
      const trip = photo.trip ? tripById.get(photo.trip) : undefined;
      return !!trip?.cities?.includes(city);
    });
    if (list.length === 0) continue;

    const coords = list.find((p) => p.coords)?.coords ?? resolveCityCoords(city);
    if (!coords) {
      console.warn(`[travel] no coords for city "${city}", add it to src/data/city-coords.ts`);
      continue;
    }
    const dates = list.map((p) => p.date).sort();
    markers.push({
      city,
      province,
      coords,
      photos: list,
      firstDate: dates[0],
      lastDate: dates[dates.length - 1],
    });
  }
  return markers.sort((a, b) => (a.lastDate < b.lastDate ? 1 : -1));
}

/** Aggregate photos per province (must match map region names). */
export function getProvinceStats(photos: TravelPhoto[]): ProvinceStats[] {
  const byProvince = new Map<string, { count: number; cities: Set<string> }>();
  for (const photo of photos) {
    const entry = byProvince.get(photo.province) ?? { count: 0, cities: new Set<string>() };
    entry.count += 1;
    entry.cities.add(photo.city);
    byProvince.set(photo.province, entry);
  }
  return [...byProvince.entries()]
    .map(([province, { count, cities }]) => ({
      province,
      photoCount: count,
      cities: [...cities],
    }))
    .sort((a, b) => b.photoCount - a.photoCount);
}

/**
 * Group photos for the timeline (newest first).
 * Key is a YYYY-MM-DD date bucket, so dense multi-day trips read naturally.
 */
export function getTimeline(photos: TravelPhoto[]): TimelineMonth[] {
  const byDay = new Map<string, TravelPhoto[]>();
  for (const photo of photos) {
    const key = photo.date.slice(0, 10);
    const list = byDay.get(key) ?? [];
    list.push(photo);
    byDay.set(key, list);
  }
  return [...byDay.entries()]
    .map(([key, list]) => ({ key, photos: list }))
    .sort((a, b) => (a.key < b.key ? 1 : -1));
}

export function getTravelStats(photos: TravelPhoto[]): TravelStats {
  const cities = new Set(photos.map((p) => `${p.province}|${p.city}`));
  const provinces = new Set(photos.map((p) => p.province));
  const dates = photos.map((p) => p.date).sort();
  return {
    photoCount: photos.length,
    cityCount: cities.size,
    provinceCount: provinces.size,
    startDate: dates[0],
    endDate: dates[dates.length - 1],
  };
}

/**
 * Parse travel articles from my-article style markdown (optional helper):
 * any .md file in content/travel/ with frontmatter { title, date, city, province }
 * can reference images; not used by the default JSON workflow.
 */
export function getTravelNotes(): { slug: string; title: string; date: string; city?: string; province?: string }[] {
  if (!fs.existsSync(travelDirectory)) return [];
  return fs
    .readdirSync(travelDirectory)
    .filter((f) => f.endsWith('.md'))
    .map((f) => {
      const slug = f.replace(/\.md$/, '');
      const { data } = matter(fs.readFileSync(path.join(travelDirectory, f), 'utf8'));
      return {
        slug,
        title: typeof data.title === 'string' ? data.title : slug,
        date: normalizeDate(data.date),
        city: typeof data.city === 'string' ? data.city : undefined,
        province: typeof data.province === 'string' ? data.province : undefined,
      };
    })
    .sort((a, b) => (a.date < b.date ? 1 : -1));
}
