/** A single travel photo with location metadata. */
export interface TravelPhoto {
  /** Unique id (also used as React key). */
  id: string;
  /** Full-size image URL (RustFS or local /travel/...). */
  src: string;
  /** Optional thumbnail URL; falls back to src. */
  thumb?: string;
  /** Taken date, YYYY-MM-DD. */
  date: string;
  /** City name in Chinese, e.g. "杭州". */
  city: string;
  /** Province name, must match the map region name, e.g. "浙江省". */
  province: string;
  /** [lng, lat] of the city. Auto-filled from city-coords when omitted. */
  coords?: [number, number];
  /** Optional caption shown in the timeline and lightbox. */
  caption?: string;
  /** Optional trip id this photo belongs to. */
  trip?: string;
}

/** A trip groups photos taken in one journey. */
export interface TravelTrip {
  id: string;
  title: string;
  startDate: string;
  endDate: string;
  description?: string;
}

export interface TravelData {
  trips: TravelTrip[];
  photos: TravelPhoto[];
}

/** One city aggregated on the map. */
export interface CityMarker {
  city: string;
  province: string;
  coords: [number, number];
  photos: TravelPhoto[];
  /** Earliest/latest photo date of this city. */
  firstDate: string;
  lastDate: string;
}

/** One province aggregated on the map. */
export interface ProvinceStats {
  province: string;
  photoCount: number;
  cities: string[];
}

/** Photos grouped by YYYY-MM for the timeline view. */
export interface TimelineMonth {
  /** YYYY-MM */
  key: string;
  photos: TravelPhoto[];
}

export interface TravelStats {
  photoCount: number;
  cityCount: number;
  provinceCount: number;
  /** First and last photo date. */
  startDate?: string;
  endDate?: string;
}
